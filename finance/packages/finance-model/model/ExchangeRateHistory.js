ExchangeRate = Sequelize.define("exchangeRateHistory",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fromCurrency: {
            type: SLib.STRING(3)
        },
        toCurrency: {
            type: SLib.STRING(3)
        },
        rate: {
            type: SLib.INTEGER
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
        tableName: "exchangeRateHistory"
    }
);