RawRequest = Sequelize.define("rawRequest",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: SLib.STRING,
            allowNull: false
        },
        hash: {
            type: SLib.STRING(32),
            allowNull: false
        },
        method: {
            type: SLib.STRING,
            allowNull: false
        },
        rawData: {
            type: SLib.TEXT,
            allowNull: false,
            get: function() {
                return this.getDataValue("rawData") ?
                    JSON.parse(this.getDataValue("rawData"))
                    : null;
            },
            set: function(value) {
                return this.setDataValue("rawData", JSON.stringify(value));
            }
        },
        response: {
            type: SLib.TEXT,
            allowNull: true,
            get: function() {
                return JSON.parse(this.getDataValue("response"));
            },
            set: function(value) {
                return this.setDataValue("response", JSON.stringify(value));
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
        tableName: "rawRequest",
        paranoid: true,

        classMethods: {
            /**
             *
             * @param {Object}      params {method, hash, rawData, [attributes]}
             * @param {Function}    callback
             */
            createRawRequest: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                var attributes = params.attributes || {};
                RawRequest.create({
                    userId: params.userId, hash: params.hash, method: params.method, rawData: params.rawData
                }).then(function (rawRequest) {
                    var parsedRR = _.pick(rawRequest, attributes);

                    return callback ? callback(parsedRR) : parsedRR;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            },

            /**
             *
             * @param {Object}      params {object, id}
             * @param {Function}    callback
             */
            updateRawRequest: function (params, callback) {
                FH.checkClassMethodParams(params, callback);

                RawRequest.findOne(
                    { where: {id: params.id} }
                ).then(function (rawRequest) {
                    if (!rawRequest) { return callback ? callback({}) : {}; }
                    rawRequest.set("response", params.object).save().then(function () {
                        var parsedRR = rawRequest.get({plain: true});

                        return callback ? callback(parsedRR) : parsedRR;
                    }).catch(function (err) {
                        return callback ? callback(err) : err;
                    });
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                });
            }
        }
    }
);