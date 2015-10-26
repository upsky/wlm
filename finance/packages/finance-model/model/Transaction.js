Transaction = Sequelize.define("transaction",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: SLib.INTEGER,
            references: {
                model: Account
            }
        },
        amount: {
            type: SLib.STRING
        },
        invoiceId: {
            type: SLib.INTEGER,
            references: {
                model: Invoice
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
        tableName: "transaction",

        classMethods: {

        }
    }
);
Transaction.belongsTo(Invoice, {foreignKey: "invoiceId"});
Transaction.belongsTo(Account, {foreignKey: "accountId"});