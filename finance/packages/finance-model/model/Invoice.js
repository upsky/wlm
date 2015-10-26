Invoice = Sequelize.define("invoice",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: SLib.STRING
        },
        amount: {
            type: SLib.STRING
        },
        currencyId: {
            type: SLib.INTEGER,
            references: {
                model: Currency
            }
        },
        payToId: {
            type: SLib.INTEGER,
            references: {
                model: Account
            }
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
        tableName: "invoice",

        classMethods: {
            getUserInvoice: function (params, callback) {
                var attributes = params.attributes || {};
                Invoice.findAll({
                    where: {ownerId: params.userId},
                    attributes: attributes,
                    include: {model: Currency, attributes: ["code"]}
                }).then(function (invoice) {
                    return callback ? callback(invoice) : invoice;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            createInvoice: function (params, callback) {
                var attributes = params.attributes || {};
                Invoice.create({
                    ownerId: params.userId, payToId: params.payToId, amount: params.amount
                }).then(function (account) {
                    var parsedInvoice = _.pick(account, attributes);

                    return callback ? callback(parsedInvoice) : parsedInvoice;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            deleteInvoice: function (params, callback) {
                Invoice.findOne({
                    where: {ownerId: params.userId, id: params.invoiceId},
                    attributes: ["id", "ownerId"]
                }).then(function (invoice) {
                    invoice.destroy().then(function (deleteResult) {
                        return callback(deleteResult);
                    }).catch(function (err) {
                        return callback(err);
                    });
                }).catch(function (err) {
                    return callback(err);
                });
            },

            payInvoice: function (params, callback) {
                Invoice.findOne({
                    where: {ownerId: params.userId, id: params.invoiceId},
                    attributes: ["id", "ownerId", "currencyId", "amount"]
                }).then(function () {
                    Account.findOne({
                        where: {ownerId: params.userId, id: params.accountId},
                        attributes: ["id", "ownerId", "currencyId", "amount", "payTo"]
                    }).then(function (account) {
                        Account.transferBTAccounts(
                            userId, account.get("id"), account.get("payTo"), invoice.get("amount"), callback
                        );
                    }).catch(function (err) {
                        return callback(err);
                    });
                }).catch(function (err) {
                    return callback(err);
                });
            }
        }
    }
);

Invoice.belongsTo(Currency, {foreignKey: "currencyId"});
Invoice.belongsTo(Account, {foreignKey: "payToId"});