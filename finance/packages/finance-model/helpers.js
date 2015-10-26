FH = {// FinanceHelpers
    /**
     * String amount to integer converter.
     * toInt(round_up(amount, 2) * 100);
     *
     * @param {string} amount
     * @return integer
     */
    amountToInt: function (amount) {
        var bnAmount = new BN(amount);

        return bnAmount.round(2, BN.ROUND_UP).times(100).toNumber;
    }
};