RawRequest = Sequelize.define("rawRequest",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: SLib.STRING
        },
        hash: {
            type: SLib.STRING(32)
        },
        method: {
            type: SLib.STRING
        },
        rawData: {
            type: SLib.BLOB
        },
        response: {
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
        tableName: "rawRequest",
        paranoid: true
    }
);