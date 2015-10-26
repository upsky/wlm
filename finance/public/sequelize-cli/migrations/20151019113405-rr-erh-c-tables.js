'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable(
            "rawRequest",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                userId: {
                    type: Sequelize.STRING
                },
                hash: {
                    type: Sequelize.STRING(32)
                },
                method: {
                    type: Sequelize.STRING
                },
                rawData: {
                    type: Sequelize.BLOB
                },
                response: {
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
            "exchangeRateHistory",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                fromCurrency: {
                    type: Sequelize.STRING(3)
                },
                toCurrency: {
                    type: Sequelize.STRING(3)
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
            "currency",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                code: {
                    type: Sequelize.STRING(3)
                },
                userData: {
                    type: Sequelize.BLOB
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                createdAt: {
                    type: Sequelize.DATE
                }
            },
            {
                indexes: [
                    {
                        unique: true,
                        fields: ['code']
                    }
                ]
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable("rawRequest");
        queryInterface.dropTable("exchangeRateHistory");
        queryInterface.dropTable("currency");
    }
};