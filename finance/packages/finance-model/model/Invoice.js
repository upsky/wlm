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
        currencyId: {
            type: SLib.INTEGER,
            allowNull: false,
            references: {
                model: Currency
            }
        },
        payToId: {
            type: SLib.INTEGER,
            allowNull: false,
            references: {
                model: Account
            }
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
                    ownerId: params.userId,
                    payToId: params.payToId,
                    amount: params.amount,
                    amountInt: FH.amountToInt(params.amount)
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
                    attributes: ["id", "ownerId", "currencyId", "amount", "amountInt"]
                }).then(function () {
                    Account.findOne({
                        where: {ownerId: params.userId, id: params.accountId},
                        attributes: ["id", "ownerId", "currencyId", "amount", "amountInt", "payTo"]
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