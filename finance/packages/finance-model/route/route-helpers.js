/**
 * Error object to handle check logic errors.
 *
 * @param status
 * @param statusString
 * @param message
 * @constructor
 */
function RequestError (status, statusString, message) {
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
     * @param {Object}  err
     */
    parseDbQueryError: function (err) {
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

        return JSON.stringify(_.pick(_.defaults(object, {data: null}), "status", "statusString", "message", "data"));
    },

    makeResponse: function (object, response) {
        response.statusCode = object.status;
        return response.end(BR.makeResponseString(object));
    },

    /**
     * Save rawRequest to DB.
     *
     * @param {string}      method
     * @param {Object}      data
     * @param {Function}    callback
     */
    saveRequest: function (method, data, callback) {
        data = data ? data.data : {};
        RawRequest
            .build({userId: data.userId, hash: data.hash, method: method, rawData: data.data})
            .save()
            .then(function (rawRequest) {
                callback({status: true, rawRequestId: rawRequest.get("id")});
            }).catch(function (err) {
                callback({status: false, responseObject: BR.parseDbQueryError(err)});
            });
    },

    /**
     * Update rawRequest by ORM classMethod response.
     * 
     * @param {Object}      object
     * @param {integer}     rawRequestId
     * @param {Function}    callback
     */
    updateRequest: function (object, rawRequestId, callback) {
        RawRequest.findOne(
            {
                where: {id: rawRequestId},
                attributes: ["id"]
            }
        ).then(function (rawRequest) {
            rawRequest.set("response", object).save().then(function () {
                callback(object);
            }).catch(function (err) {
                callback(BR.parseDbQueryError(err));
            });
        }).catch(function (err) {
            callback(BR.parseDbQueryError(err));
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

        BR.saveRequest(request.url, request.body, function (result) {
            if (!result.status) {
                return BR.makeResponse(result, response);
            }
            // fill methodParams blank object by request.body data
            _.each(methodParams, function (value, key) {
                if (key !== "attributes") {
                    methodParams[key] = request.body.data[key]
                }
            });
            methodParams = [methodParams];
            // add callback for query Promise
            methodParams.push(
                (function (queryResult) {
                    BR.end(BR.checkOrmResponse(queryResult), result.rawRequestId, response);
                })
            );
            // and run ORM method
            method.apply(this, methodParams);
        });
    },

    /**
     * Checks ORM classMethod response and parse it.
     *
     * @param {Object} result
     * @return {Object}
     */
    checkOrmResponse: function (result) {
        var response = "";
        if (result && result.name) {
            response = BR.parseDbQueryError(result);
        } else {
            response = BR.successResponseObject(result);
        }

        return response;
    },

    /**
     * Updates rawRequest response field and send response to client.
     *
     * @param {string}          responseString
     * @param {integer}         rawRequestId
     * @param {Node.response}   response
     */
    end: function (responseString, rawRequestId, response) {
        BR.updateRequest(responseString, rawRequestId, function (resStr) {
            return BR.makeResponse(resStr, response);
        });
    }
};

// should start working someday. iron:router issue.
//Router.onBeforeAction(function () {
//    try {
//        BR.checkRequest(this.request.body);
//    } catch (err) {
//        if (err.name !== "RequestError") {
//            console.log("RequestUnknownError", err);
//            err.status = 500;
//            err.statusString = "SERVER-ERROR";
//            err.message = "Request check error"
//        }
//
//        return this.response.end(JSON.stringify({
//            status: err.status,
//            statusString: err.statusString,
//            message: err.message,
//            data: null
//        }));
//    }
//    BR.saveRequest(post);
//
//    this.next();
//});

// request data
// {userId: <mongoId>, hash: <hashStr>, data: <data obj>}
