/**
 * Error object to handle check logic errors.
 *
 * @param {int}     status
 * @param {string}  statusString
 * @param {string}  message
 * @constructor
 */
function RequestError (status, statusString, message) {
    check(status, Number);
    check(statusString, String);
    check(message, String);

    this.name = "RequestError";
    this.status = status;
    this.statusString = statusString;
    this.message = message;
}

BR = {
    /**
     * Get user token from mongo by given userId.
     *
     * @throws RequestError
     * @param {string} userId
     * @returns {string | null}
     */
    getToken: function (userId) {
        if (!userId) {
            throw new RequestError(403, "ACCESS-DENIED", "user not defined")
        }

        check(userId, String);

        if (userId === "902iojklasf") { return "fjds0j3lkahdf09u2ioj3knka"; }

        return null;

        // should use connection to front mongoDB like...
        // var connection = DDP.connect(Meteor.settings.frontMongoConnectUrl);
        // var token = connection.call("getTokenByUserId", userId);
        //connection.disconnect();
        //
        //return token;
    },

    /**
     * Generate md5 hash from given string.
     *
     * @param {string} string
     * @returns {string}
     */
    generateHash: function (string) {
        check(string, String);
        return CryptoJS.MD5(string).toString();
    },

    /**
     * Checks if request.body object valid and throws error otherwise.
     *
     * @throws RequestError
     * @param {Object} data
     */
    checkRequest: function (data) {
        if (!data) {
            throw new RequestError(403, "ACCESS-DENIED", "data not received");
        }

        check(data, Match.ObjectIncluding({userId: String, hash: String, data: Object}));

        var token = BR.getToken(data.userId);
        if (!token) {
            throw new RequestError(403, "ACCESS-DENIED", "user is wrong");
        }

        var rHash = data.hash;
        // hash = md5(concat(token, post.data))
        var gHash = BR.generateHash(token + JSON.stringify(data.data));
        if (rHash !== gHash) {
            throw new RequestError(403, "ACCESS-DENIED", "hash string is wrong");
        }
    },

    /**
     * workaround iron:router issue
     * checks request.body object and return error response to client if it not valid
     *
     * @see https://github.com/iron-meteor/iron-router/issues/1449
     * @param {Object}          requestBody
     * @param {Node.response}   response
     */
    onBeforeAction: function (requestBody, response) {
        check(requestBody, Object);
        try {
            BR.checkRequest(requestBody);
        } catch (err) {
            var parsedErr = BR.parseDbQueryError(err);
            response.statusCode = parsedErr.status;
            response.end(BR.makeResponseString(parsedErr));

            return false
        }

        return true;
    },

    /**
     * Check DB query error and parse it before send to client.
     *
     * @param {Object} err
     */
    parseDbQueryError: function (err) {
        //check(err, Match);
        if (
            err.name !== "RequestError"
            && err.name !== "SequelizeValidationError"
            && err.name !== "SequelizeUniqueConstraintError"
        ) {
            console.log("[API error] RequestUnknownError", err);
            err.status = 500;
            err.statusString = "SERVER-ERROR";
            err.message = "unknown error"
        }
        if (!err.status) { err.status = 500; }

        return {status: err.status, statusString: "WRONG-DATA", message: err.message};
    },

    /**
     * Make string for standard api response.
     *
     * @param {Object} object
     * @returns {string}
     */
    makeResponseString: function (object) {
        object = object || {};
        check(object, Object);

        return JSON.stringify(_.pick(_.defaults(object, {data: null}), "status", "statusString", "message", "data"));
    },

    makeResponse: function (object, response) {
        check(object, Object);
        response.statusCode = object.status;

        return response.end(BR.makeResponseString(object));
    },

    /**
     * Save rawRequest to DB. Make error response if fails.
     *
     * @param {string}      method
     * @param {Object}      data
     * @param {Function}    callback
     */
    saveRequest: function (method, data, callback) {
        check(method, String);
        check(data, Object);
        RawRequest.createRawRequest(
            {userId: data.userId, method: method, hash: data.hash,
                rawData: data.data, attributes: ["id"]}, function (result) {
            if (BR.checkOrmResult(result)) {
                return callback(result.id);
            } else {
                return BR.makeResponse(BR.parseDbQueryError(result));
            }
        });
    },

    /**
     * Fill given object by success object fields for standard api response.
     *
     * @param {Object|null} data
     * @return {Object}
     */
    successResponseObject: function (data) {
        data = data || null;
        //check(data, Match.OneOf(Object, null));

        return {status: 200, statusString: "REQUEST-OK", message: "request success", data: data};
    },

    /**
     * Checks request.body, saves it to DB and send error response to client otherwise.
     *
     * @param {Node.request}    request
     * @param {Node.response}   response
     * @param {Function}        method
     * @param {Object}          methodParams
     * @return {boolean}
     */

    start: function (request, response, method, methodParams) {
        var checkRequest = BR.onBeforeAction(request.body, response);
        if (!checkRequest) { return false; }

        BR.saveRequest(request.url, request.body, function (rawRequestId) {
            check(rawRequestId, Number);
            // fill methodParams blank object by request.body data
            _.each(methodParams, function (value, key) {
                if (_.indexOf(["attributes", "raw", "order", "limit", "offset", "group"], key) === -1) {
                    methodParams[key] = request.body.data[key]
                }
            });

            // every model classMethod gets userId field as parameter
            methodParams.userId = request.body.userId;
            methodParams = [methodParams];
            // add callback for query Promise
            methodParams.push(
                (function (queryResult) {
                    BR.end(BR.parseOrmResult(queryResult), rawRequestId, response);
                })
            );
            // and run ORM method
            method.apply(this, methodParams);
        });
    },

    /**
     * Checks ORM classMethod response.
     *
     * @param {Object | string} result
     * @return {boolean}
     */
    checkOrmResult: function (result) {
        return !(result && result.name);
    },

    parseOrmResult: function (result) {
        return BR.checkOrmResult(result) ? BR.successResponseObject(result) : BR.parseDbQueryError(result);
    },

    /**
     * Update rawRequest by response field with ORM classMethod.
     *
     * @param {Object}      object
     * @param {integer}     rawRequestId
     * @param {Function}    callback
     */
    updateRawRequest: function (object, rawRequestId, callback) {
        check(object, Object);
        check(rawRequestId, Number);
        RawRequest.updateRawRequest({object: object, id: rawRequestId}, callback);
    },

    /**
     * Updates rawRequest response field and send response to client.
     *
     * @param {string}          responseObject
     * @param {integer}         rawRequestId
     * @param {Node.response}   response
     */
    end: function (responseObject, rawRequestId, response) {
        check(responseObject, Object);
        check(rawRequestId, Number);
        BR.updateRawRequest(responseObject, rawRequestId, function () {
            return BR.makeResponse(responseObject, response);
        });
    }
};

// request data
// {userId: <mongoId>, hash: <hashStr>, data: <data obj>}
