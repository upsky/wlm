'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable(
            "invoice",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                ownerId: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                amount: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                amountInt: {
                    type: Sequelize.BIGINT,
                    allowNull: false
                },
                currencyId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "currency",
                        key: "id"
                    }
                },
                payToId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "account",
                        key: "id"
                    }
                },
                userData: {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        queryInterface.dropTable("invoice");
    }
};