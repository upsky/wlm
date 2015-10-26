function RequestError (status, statusString, message) {
    this.name = "RequestError";
    this.status = status;
    this.statusString = statusString;
    this.message = message;
}

Account = Sequelize.define("account",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: SLib.STRING
        },
        currencyId: {
            type: SLib.INTEGER,
            references: {
                model: "currency",
                key: "id"
            }
        },
        amount: {
            type: SLib.CHAR(100),
            defaultValue: "0"
        },
        userData: {
            type: SLib.JSON
        },
        updatedAt: {
            type: SLib.DATE,
            defaultValue: SLib.NOW
        },
        createdAt: {
            type: SLib.DATE
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
             * @param {Object}      params {userId, attributes}
             * @param {Function}    callback
             */
            getUserAccounts: function (params, callback) {
                var attributes = params.attributes || {};
                Account.findAll({
                    where: {ownerId: params.userId},
                    attributes: attributes,
                    include: {model: Currency, attributes: ["id", "code"]}
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
                Account.findOne({
                    where: {id: params.accountId, ownerId: params.userId}
                }).then(function (account) {
                    if (!account) {
                        let error = new RequestError(404, "NOT-FOUND", "account not found with id " + params.accountId);

                        return callback ? callback(error) : error;
                    }

                    if (account.get('amount') !== "0") {
                        let error = new RequestError(403, "ACCESS-DENIED", "can not remove not empty account");

                        return callback ? callback(error) : error;
                    }

                    account.destroy().then(function (result) {
                        if (params.attributes) {
                            result = _.pick(result, params.attributes);
                        }

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
             * @param params {userId, fromAccountId, toAccountId, amount}
             * @param callback
             * @return {Promise.<T>}
             */
            transferBTAccounts: function (params, callback) {
                return Sequelize.transaction(function (t) {
                    return Account.checkTransferAbility(params, function (result) {
                        if (result === Array) {
                            console.log("[DEBUG] fire0", result);
                            return callback ? callback(result) : result;
                        }
                        var accounts = result;
                        var fromAccount = accounts[0].get("id") === params.fromAccountId
                            ? accounts.shift()
                            : accounts.pop();
                        var toAccount = accounts[0];
                        return fromAccount.set(
                            "amount",
                            (new BN(fromAccount.get("amount"))).minus(params.amount).toString()).save({transaction: t}
                        )
                            .then(function () {
                                return toAccount.set(
                                    "amount",
                                    (new BN(toAccount.get("amount"))).plus(params.amount).toString()).save({transaction: t}
                                )
                                    .then(function () {
                                        return Transaction.bulkCreate([
                                            {
                                                accountId: params.fromAccountId,
                                                amount: (new BN(params.amount)).times(-1).toString(),
                                                userData: {userId: params.userId}
                                            },
                                            {
                                                accountId: params.toAccountId,
                                                amount: params.amount,
                                                userData: {userId: params.userId}
                                            }
                                        ], {transaction: t});
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
                if (params.fromAccountId === params.toAccountId) {
                    let error = new RequestError(
                        403, "WRONG-ACCOUNT", "can not transfer between the same account"
                    );

                    return callback ? callback(error) : error;
                }

                return Account.findAll({
                    where: {ownerId: params.userId, id: {$in: [params.fromAccountId, params.toAccountId]}},
                    attributes: ["id", "currencyId", "amount"],
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

                        let error = new RequestError(404, "NOT-FOUND", "account not found with id " + wrongId);

                        return callback ? callback(error) : error;
                    }

                    var fromAccount = accounts[0].get("id") === params.fromAccountId
                        ? accounts.shift()
                        : accounts.pop();
                    var toAccount = accounts[0];
                    if (fromAccount.get("currencyId") !== toAccount.get("currencyId")) {
                        let error = new RequestError(
                            403, "WRONG-CURRENCY", "can not transfer between different currency accounts"
                        );

                        return callback ? callback(error) : error;
                    }

                    var amount = new BN(params.amount);
                    if (amount.lte(0)) {
                        let error = new RequestError(403, "WRONG-AMOUNT", "amount value is wrong");

                        return callback ? callback(error) : error;
                    }

                    var fromAccountAmount = new BN(fromAccount.get("amount"));
                    if (fromAccountAmount.minus(amount).lt(0)) {
                        let error = new RequestError(
                            403, "WRONG-AMOUNT", "can not transfer more then account contains"
                        );

                        return callback ? callback(error) : error;
                    }

                    return callback ? callback([fromAccount, toAccount]) : [fromAccount, toAccount];
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            }
        }
    }
);

Account.belongsTo(Currency, {foreignKey: "currencyId"});