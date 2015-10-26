ExchangeRate = Sequelize.define("exchangeRate",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fromCurrencyId: {
            type: SLib.INTEGER,
            references: {
                model: Currency
            }
        },
        toCurrencyId: {
            type: SLib.INTEGER,
            references: {
                model: Currency
            }
        },
        rate: {
            type: SLib.INTEGER
        },
        userData: {
            type: SLib.BLOB
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
        tableName: "exchangeRate"
    }
);