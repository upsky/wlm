'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable(
            "exchangeRate",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                fromCurrencyId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "currency",
                        key: "id"
                    }
                },
                toCurrencyId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "currency",
                        key: "id"
                    }
                },
                rate: {
                    type: Sequelize.INTEGER
                },
                userData: {
                    type: Sequelize.BLOB
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }
        );
        queryInterface.createTable(
            "account",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                ownerId: {
                    type: Sequelize.STRING
                },
                currencyId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "currency",
                        key: "id"
                    }
                },
                amount: {
                    type: Sequelize.STRING,
                    defaultValue: "0"
                },
                amountInt: {
                    type: Sequelize.BIGINT
                },
                userData: {
                    type: Sequelize.BLOB
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable("exchangeRate");
        queryInterface.dropTable("account");
    }
};