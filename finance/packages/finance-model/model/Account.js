Account = Sequelize.define("account",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: SLib.STRING,
            allowNull: false
        },
        currencyId: {
            type: SLib.INTEGER,
            allowNull: false,
            references: {
                model: "currency",
                key: "id"
            }
        },
        amount: {
            type: SLib.CHAR(100),
            allowNull: false,
            defaultValue: "0"
        },
        amountInt: {
            type: SLib.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        userData: {
            type: SLib.TEXT,
            allowNull: true,
            get: function() {
                return this.getDataValue("userData") ?
                    JSON.parse(this.getDataValue("userData"))
                    : null;
            },
            set: function(value) {
                return this.setDataValue("userData", JSON.stringify(value));
            }
        },
        updatedAt: {
            type: SLib.DATE,
            defaultValue: SLib.NOW
        },
        createdAt: {
            type: SLib.DATE,
            allowNull: false,
            defaultValue: SLib.NOW
        },
        deletedAt: {
            type: SLib.DATE,
            allowNull: true
        }
    },
    {
        paranoid: true,
        tableName: "account",

        classMethods: {
            /**
             * Select accounts by params.userId with params.attributes.
             *
             * @param {Object}      params {userId, attributes, raw}
             * @param {Function}    callback
             */
            getUserAccounts: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || {};
                Account.findAll({
                    where: {ownerId: params.userId},
                    attributes: attributes,
                    include: {model: Currency, attributes: ["id", "code"] },
                    raw: !!params.raw,
                    nest: !!params.raw
                }).then(function (accounts) {
                    return callback ? callback(accounts) : accounts;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            /**
             * Create account with params.userId and params.currencyId.
             *
             * @param {Object}      params {userId, currencyId, attributes}
             * @param {Function}    callback
             */
            createAccount: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || {};
                Account.create({
                    ownerId: params.userId, currencyId: params.currencyId
                }).then(function (account) {
                    var parsedAccount = _.pick(account, attributes);

                    return callback ? callback(parsedAccount) : parsedAccount;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            /**
             * Check params.accountId account as deleted by setting deletedAt field (paranoid: true).
             *
             * @param {Object}      params {userId, accountId}
             * @param {Function}    callback
             */
            deleteAccount: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || null;
                Account.findOne({
                    where: {id: params.accountId, ownerId: params.userId}
                }).then(function (account) {
                    if (!account) {
                        let error = new FH.RequestError(404, "NOT-FOUND", `account not found with id={params.accountId}`);

                        return callback ? callback(error) : error;
                    }

                    if (account.get('amount') !== "0") {
                        let error = new FH.RequestError(403, "ACCESS-DENIED", "can not remove not empty account");

                        return callback ? callback(error) : error;
                    }

                    account.destroy().then(function (deleteResult) {
                        var result = _.pick(deleteResult, attributes);

                        return callback ? callback(result) : result;
                    }).catch(function (err) {
                        return callback ? callback(err) : err;
                    });
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            /**
             * Transfer params.amount from params.fromAccountId to params.toAccountId.
             * Uses transaction.
             *
             * @param {Object}      params {userId, fromAccountId, toAccountId, amount}
             * @param {Function}    callback
             * @return {Promise.<T>}
             */
            transferBTAccounts: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                return Sequelize.transaction(function (t) {
                    return Account.checkTransferAbility(params, function (result) {
                        if (result instanceof FH.RequestError) {
                            return callback ? callback(result) : result;
                        }

                        var accounts = result;
                        var fromAccount = accounts[0].get("id") === params.fromAccountId
                            ? accounts.shift()
                            : accounts.pop();
                        var toAccount = accounts[0];
                        let amount = (new BN(fromAccount.get("amount"))).minus(params.amount).toString();
                        let amountInt = FH.amountToInt(amount);

                        return fromAccount.set("amount", amount).set("amountInt", amountInt).save({transaction: t})
                            .then(function () {
                                let amount = (new BN(toAccount.get("amount"))).plus(params.amount).toString();
                                let amountInt = FH.amountToInt(amount);

                                return toAccount.set("amount", amount).set("amountInt", amountInt).save({transaction: t})
                                    .then(function () {
                                        let amount = (new BN(params.amount)).times(-1).toString();
                                        let negativeAmountInt = FH.amountToInt(amount);

                                        let positiveAmountInt = FH.amountToInt(params.amount);

                                        return Transaction.bulkCreate([
                                            {
                                                accountId: params.fromAccountId,
                                                amount: amount,
                                                amountInt: negativeAmountInt,
                                                userData: {userId: params.userId}
                                            },
                                            {
                                                accountId: params.toAccountId,
                                                amount: params.amount,
                                                amountInt: positiveAmountInt,
                                                userData: {userId: params.userId}
                                            }
                                        ], {transaction: t, raw: true, attributes: ["amount"]}).then(function (transactions) {
                                            var ts = [];
                                            // notice: postgres return rows from DB, mysql not!
                                            _.each(transactions, function (t) {
                                                ts.push(_.pick(t, ["id", "amount"]));
                                            });

                                            return callback ? callback(ts) : ts;
                                        });
                                    }).catch(function (err) {
                                        return callback ? callback(err) : err;
                                    });
                            }).catch(function (err) {
                                return callback ? callback(err) : err;
                            });
                    }, t);
                }).then(function (result) {
                    return callback ? callback(result) : result;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            /**
             * Checks ability to transfer params.amount from params.fromAccountId to params.toAccountId.
             *
             * @param {Object}                  params {userId, fromAccountId, toAccountId, amount}
             * @param {Function}                callback
             * @param {Sequelize.Transaction}   transaction
             * @return {*}
             */
            checkTransferAbility: function (params, callback, transaction) {
                FH.checkClassMethodParams(params, callback);

                if (params.fromAccountId === params.toAccountId) {
                    let error = new FH.RequestError(
                        403, "WRONG-ACCOUNT", "can not transfer between the same account"
                    );

                    return callback ? callback(error) : error;
                }

                // search accounts with same ownerId
                //TODO: we definitely must have ability to transfer between different ownerId accounts
                return Account.findAll({
                    where: {ownerId: params.userId, id: {$in: [params.fromAccountId, params.toAccountId]}},
                    attributes: ["id", "currencyId", "amount", "amountInt"],
                    include: {model: Currency, attributes: ["code"]},
                    transaction: transaction
                }).then(function (accounts) {
                    if (accounts.length !== 2) {
                        var wrongId = null;
                        if (!accounts) {
                            wrongId = params.fromAccountId + ", " + params.toAccountId;
                        } else {
                            wrongId = accounts[0].get("id") === params.fromAccountId
                                ? params.toAccountId
                                : params.fromAccountId;
                        }

                        let error = new FH.RequestError(404, "NOT-FOUND", "account not found with id " + wrongId);

                        return callback ? callback(error) : error;
                    }

                    // check that accounts with same currency
                    //TODO: is that necessary? maybe we need to make exchange to proper currency instead (from toAccount)?
                    var fromAccount = accounts[0].get("id") === params.fromAccountId
                        ? accounts.shift()
                        : accounts.pop();
                    var toAccount = accounts[0];
                    if (fromAccount.get("currencyId") !== toAccount.get("currencyId")) {
                        let error = new FH.RequestError(
                            403, "WRONG-CURRENCY", "can not transfer between different currency accounts"
                        );

                        return callback ? callback(error) : error;
                    }

                    // checks amount >= 0
                    var amount = new BN(params.amount);
                    if (amount.lte(0)) {
                        let error = new FH.RequestError(403, "WRONG-AMOUNT", "amount value is wrong");

                        return callback ? callback(error) : error;
                    }

                    // check fromAccountAmount >= amount
                    var fromAccountAmount = new BN(fromAccount.get("amount"));
                    if (fromAccountAmount.minus(amount).lt(0)) {
                        let error = new FH.RequestError(
                            403, "WRONG-AMOUNT", "can not transfer more then account contains"
                        );

                        return callback ? callback(error) : error;
                    }

                    var returnAccounts = [fromAccount, toAccount];

                    return callback ? callback(returnAccounts) : returnAccounts;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            }
        }
    }
);

Account.belongsTo(Currency, {foreignKey: "currencyId"});