Currency = Sequelize.define("currency",
    {
        id: {
            type: SLib.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: SLib.STRING(3),
            allowNull: false,
            unique: true,
            uppercase: true,
            validate: {
                is: /^[A-Z]+$/,
                min: 3,
                max: 3
            }
        },
        userData: {
            type: SLib.TEXT,
            allowNull: true,
            get: function() {
                return this.getDataValue("userData") ?
                    JSON.parse(this.getDataValue("userData"))
                    : null;
            },
            set: function(value) {
                return this.setDataValue("userData", JSON.stringify(value));
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
        }
    },
    {
        tableName: "currency",

        classMethods: {
            /**
             * Select all currencies with params.attributes.
             *
             * @param {Object}      params {userId, attributes}
             * @param {Function}    callback
             */
            getCurrencyList: function (params, callback) {
                var attributes = params.attributes || {};
                var raw = params.raw || false;
                Currency.findAll({attributes: attributes, raw: raw}).then(function (currencyList) {
                    return typeof(callback) == typeof(Function) ? callback(currencyList) : currencyList;
                }).catch(function (err) {
                    return typeof(callback) == typeof(Function) ? callback(err) : err;
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