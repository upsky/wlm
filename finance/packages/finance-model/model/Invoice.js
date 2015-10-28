Invoice = Sequelize.define("invoice",
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
        amount: {
            type: SLib.STRING,
            allowNull: false
        },
        amountInt: {
            type: SLib.BIGINT,
            allowNull: false
        },
        payToId: {
            type: SLib.INTEGER,
            allowNull: false,
            references: {
                model: Account
            }
        },
        paid: {
            type: SLib.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
            allowNull: false,
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
        tableName: "invoice",

        classMethods: {
            /**
             * Get invoices by given userId.
             *
             * @param {Object}      params {userId, attributes}
             * @param {Function}    callback
             */
            getUserInvoice: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || {};
                Invoice.findAll({
                    where: {ownerId: params.userId},
                    include: {
                        model: Account,
                        attributes: ["currencyId"]
                    },
                    attributes: attributes,
                    raw: !!params.raw,
                    nest: !!params.raw
                }).then(function (invoice) {
                    return _.isFunction(callback) ? callback(invoice) : invoice;
                }).catch(function (err) {
                    return _.isFunction(callback) ? callback(err) : err;
                });
            },

            /**
             * Create invoice for given user.
             *
             * @param {Object}      params {userId, payToId, amount}
             * @param {Function}    callback
             */
            createInvoice: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || {};
                Account.findOne({
                    where: {id: params.payToId, ownerId: params.userId},
                    attributes: ["id"]
                }).then(function (account) {
                    if (!account) {
                        let error = new FH.RequestError(404, "NOT-FOUND", `account not found with id=${params.payToId}`);

                        return _.isFunction(callback) ? callback(error) : error;
                    }
                    Invoice.create({
                        ownerId: params.userId,
                        payToId: params.payToId,
                        amount: params.amount,
                        amountInt: FH.amountToInt(params.amount)
                    }).then(function (invoice) {
                        var parsedInvoice = _.pick(invoice, attributes);

                        return _.isFunction(callback) ? callback(parsedInvoice) : parsedInvoice;
                    }).catch(function (err) {
                        return _.isFunction(callback) ? callback(err) : err;
                    });
                }).catch(function (err) {
                    return _.isFunction(callback) ? callback(err) : err;
                });
            },

            /**
             * Set invoice deletedAt to current date.
             * Only user which account is set to payToId property can delete invoice.
             * Only not paid invoices can be deleted.
             *
             * @param {Object}      params {userId, invoiceId, attributes}
             * @param {Function}    callback
             */
            deleteInvoice: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || ["id", "ownerId"];
                Invoice.findOne({
                    where: {id: params.invoiceId, paid: false},
                    include: [{model: Account, where: {ownerId: params.userId}, attributes: ["id"]}],
                    attributes: ["id"]
                }).then(function (invoice) {
                    if (!invoice) {
                        let error = new FH.RequestError(404, "ACCESS-DENIED", `invoice not found with id=${params.invoiceId}`);

                        return callback ? callback(error) : error;
                    }
                    invoice.destroy().then(function (deleteResult) {
                        var result = _.pick(deleteResult, attributes);

                        return _.isFunction(callback) ? callback(result) : result;
                    }).catch(function (err) {
                        return _.isFunction(callback) ? callback(err) : err;
                    });
                }).catch(function (err) {
                    return _.isFunction(callback) ? callback(err) : err;
                });
            },

            /**
             * Make transactions for closing invoice.
             *
             * @param {Object}      params {userId, invoiceId}
             * @param {Function}    callback
             */
            payInvoice: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || ["id", "ownerId", "currencyId", "amount", "amountInt", "payTo"];
                Invoice.findOne({
                    where: {ownerId: params.userId, id: params.invoiceId},
                    attributes: attributes
                }).then(function () {
                    Account.findOne({
                        where: {ownerId: params.userId, id: params.accountId},
                        attributes: attributes
                    }).then(function (account) {
                        Account.transferBTAccounts(
                            userId, account.get("id"), account.get("payTo"), invoice.get("amount"), callback
                        );
                    }).catch(function (err) {
                        return _.isFunction(callback) ? callback(err) : err;
                    });
                }).catch(function (err) {
                    return _.isFunction(callback) ? callback(err) : err;
                });
            }
        }
    }
);

Invoice.belongsTo(Account, {foreignKey: "payToId"});