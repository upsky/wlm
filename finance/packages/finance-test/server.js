var CR = {
    method: "POST",

    url: "http://localhost:3000/api/v1/",

    /**
     * HTTP wrap
     *
     * @param {string} path
     * @param {Object} data
     * @return {*}
     */
    httpCall: function (path, data)
    {
        var token = CR.getToken(data.userId);
        data.hash = CR.generateHash(token + JSON.stringify(data.data));
        console.log("[httpCall][start]", path, data);
        try {
            var result = HTTP.call(CR.method, CR.url + path, { data: data });

            console.log("[httpCall][end] ", path, result.content);

            return JSON.parse(result.content).data;
        } catch (e) {
            console.log("[httpCall][error]", path, e);

            return e.message;
        }
    },

    getToken: function (userId) {
        return "fjds0j3lkahdf09u2ioj3knka";
    },

    generateHash: function (string) {
        return CryptoJS.MD5(string).toString();
    }
};

Meteor.methods({
    accountList: function (userId) {
        return CR.httpCall("account/list", {userId: userId, data: {userId: userId}});
    },

    /**
     *
     * @param {string}  userId
     * @param {integer} currencyId
     * @return {*}
     */
    accountNew: function (userId, currencyId) {
        return CR.httpCall("account/new", {userId: userId, data: {userId: userId, currencyId: +currencyId}});
    },

    /**
     *
     * @param {string}  userId
     * @param {integer} accountId
     * @return {*}
     */
    accountDelete: function (userId, accountId) {
        return CR.httpCall("account/delete", {userId: userId, data: {userId: userId, accountId: +accountId}});
    },

    /**
     *
     * @param {string}  userId
     * @param {integer} fromAccountId
     * @param {integer} toAccountId
     * @param {string}  amount
     * @return {*}
     */
    accountTransfer: function (userId, fromAccountId, toAccountId, amount) {
        return CR.httpCall(
            "account/transfer",
            {userId: userId, data: {userId: userId, fromAccountId: +fromAccountId, toAccountId: +toAccountId, amount: amount}}
        );
    },

    /**
     *
     * @param {string} userId
     * @return {*}
     */
    currencyList: function (userId) {
        return CR.httpCall("currency/list", {userId: userId, data: {userId: userId}});
    },

    /**
     *
     * @param {string} userId
     * @param {string} currencyCode
     * @return {*}
     */
    currencyNew: function (userId, currencyCode) {
        return CR.httpCall("currency/new", {userId: userId, data: {userId: userId, currencyCode: currencyCode}});
    },

    /**
     *
     * @param {string} userId
     * @param {string} currencyId
     * @return {*}
     */
    currencyDelete: function (userId, currencyId) {
        return CR.httpCall("currency/delete", {userId: userId, data: {userId: userId, currencyId: +currencyId}});
    },

    /**
     *
     * @param userId
     * @return {*}
     */
    invoiceList: function (userId) {
        return CR.httpCall("invoice/list", {userId: userId, data: {userId: userId}});
    },

    /**
     *
     * @param userId
     * @param payToId
     * @param amount
     * @return {*}
     */
    invoiceNew: function (userId, payToId, amount) {
        return CR.httpCall("invoice/new", {userId: userId, data: {userId: userId, payToId: +payToId, amount: amount}});
    },

    /**
     *
     * @param userId
     * @param invoiceId
     * @return {*}
     */
    invoiceDelete: function (userId, invoiceId) {
        return CR.httpCall("invoice/delete", {userId: userId, data: {userId: userId, invoiceId: +invoiceId}});
    },

    /**
     *
     * @param userId
     * @param invoiceId
     * @return {*}
     */
    invoicePay: function (userId, invoiceId) {
        return CR.httpCall("invoice/pay", {userId: userId, data: {userId: userId, invoiceId: +invoiceId}});
    }
});