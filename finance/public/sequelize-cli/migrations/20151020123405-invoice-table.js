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
                    type: Sequelize.STRING
                },
                amount: {
                    type: Sequelize.STRING
                },
                currencyId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "currency",
                        key: "id"
                    }
                },
                payToId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "account",
                        key: "id"
                    }
                },
                userData: {
                    type: Sequelize.JSON
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
        queryInterface.dropTable("invoice");
    }
};