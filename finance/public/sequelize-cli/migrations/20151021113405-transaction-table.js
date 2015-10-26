'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        queryInterface.createTable(
            "transaction",
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                accountId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "account",
                        key: "id"
                    }
                },
                amount: {
                    type: Sequelize.STRING
                },
                amountInt: {
                    type: Sequelize.BIGINT
                },
                invoiceId: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: "invoice",
                        key: "id"
                    }
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
        queryInterface.dropTable("transaction")
    }
};