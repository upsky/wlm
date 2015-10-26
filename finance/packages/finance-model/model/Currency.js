Currency = Sequelize.define("currency",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: SLib.STRING(3),
            uppercase: true,
            validate: {
                is: /^[A-Z]+$/,
                min: 3,
                max: 3
            }
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
        }
    },
    {
        tableName: "currency",
        indexes: [
            {
                unique: true,
                fields: ['code']
            }
        ],

        classMethods: {
            /**
             * Select all currencies with params.attributes.
             *
             * @param {Object}      params {userId, attributes}
             * @param {Function}    callback
             */
            getCurrencyList: function (params, callback) {
                var attributes = {attributes: params.attributes} || {};
                Currency.findAll(attributes).then(function (currencyList) {
                    return callback ? callback(currencyList) : currencyList;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                })
            },

            /**
             * Create currency by given params.currencyCode.
             *
             * @param {Object}      params {userId, currencyCode, attributes}
             * @param {Function}    callback
             */
            addCurrency: function (params, callback) {
                Currency.create({code: params.currencyCode}).then(function (currency) {
                    var parsedCurrency = _.pick(currency, params.attributes);

                    return callback ? callback(parsedCurrency) : parsedCurrency;
                }).catch(function (err) {
                    return callback ? callback(err) : err;
                })
            },

            /**
             * Wipe currency from DB.
             *
             * @param {Object}      params {userId, currencyId}
             * @param {Function}    callback
             */
            deleteCurrency: function (params, callback) {
                Currency.destroy({where: {id: params.currencyId}}).then(function (deleteResult) {
                    return callback(deleteResult);
                }).catch(function (err) {
                    return callback(err);
                });
            }
        }
    }
);