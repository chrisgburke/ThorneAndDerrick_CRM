var quoteLineValueCoordinator = (function (carriageFamName) {

    var _carriageFamName;
    var _quantity = 0;
    var _salesprice = 0;
    var _costPrice = 0;
    var _vatRate = 0;
    var _discountPercent = 0;
    var _totalLineItemDiscount = 0;
    var _lineTotalProtected = 0.00;
    var _taxAmount = 0;
    var _currencyID = 0;
    var _currencySymbol = "";
    var _profitMarginPercentage = 0;
    var _profitValue = 0;
    var _thisIsCarriage = false;

    var clearValuesPrivate = function () {
        _quantity = 0;
        _salesprice = 0;
        _costPrice = 0;
        _vatRate = 0;
        _discountPercent = 0;
        _lineTotalProtected = 0.00;
    };

    var setValuesPrivate = function (line) {
        _carriageFamName = "29" //this is where this value LIVES!
        _quantity = line.quantity;
        _salesprice = line.salesPrice;
        _costPrice = line.costPrice;
        _vatRate = line.vatRate;
        _discountPercent = line.discountPercent;
        _lineTotalProtected = 0.00;
        _currencySymbol = line.currencySymbol;
        _currencyID = line.currencyID;
        _thisIsCarriage = false;
        if(line.productFamily== _carriageFamName){
            _thisIsCarriage = true;
        }
    };

    var getCurrencyPrivate = function () {
        //need to make an AJAX call to get the currency symbol
        return _currencyID;
    };

    var calculateValuesPrivate = function () {
        calculateLineTotalPrivate();
        calculateTaxPrivate();
        calculateProfitPrivate();
    };

    //LINE TOTALS
    var calculateLineTotalPrivate = function () {
        var undiscLineTotal = (_salesprice * _quantity);
        var lineTotal = (discountedUnitPricePrivate() * _quantity);
        _lineTotalProtected = lineTotal.toFixed(2);//Math.round(lineTotal, 2);
        _totalLineItemDiscount = (undiscLineTotal - _lineTotalProtected).toFixed(2);
    };

    var discountedUnitPricePrivate = function () {
        if (_discountPercent > 0) {
            return (_salesprice * (1 - (_discountPercent / 100))).toFixed(2);
        } else {
            return _salesprice;
        }
    };

    var getLineTotalPrivate = function () {
        if (isNaN(_lineTotalProtected)) {
            return parseFloat(0).toFixed(2);
        }
        return _lineTotalProtected;
    };

    var getLineItemDiscountPrivate = function () {
        return _totalLineItemDiscount;
    }
    /////

    //VAT 
    var calculateTaxPrivate = function () {
        _taxAmount = (_lineTotalProtected * (_vatRate / 100)).toFixed(2);
    };

    var getTaxAmountPrivate = function () {
        return _taxAmount;
    };

    var formatWithCurrencySymbolPrivate = function (iVal) {
        return  _currencySymbol + '\xA0' + parseFloat(iVal).toFixed(2);
    };

    var getProfitValuePrivate = function () {

        return (_lineTotalProtected - (_quantity * _costPrice)).toFixed(2);
    };

    var getProfitPercentPrivate = function () {
        _profitValue = 0;
        _profitMarginPercentage = 0;

        if (!_thisIsCarriage) {
            var profitValue = getProfitValuePrivate();
            _profitValue = profitValue;

            if (_lineTotalProtected > 0) {
                _profitMarginPercentage = ((profitValue / _lineTotalProtected) * 100).toFixed(2);
            } else {
                _profitMarginPercentage = parseFloat(0).toFixed(2);
            }
        }
    };

    var calculateProfitPrivate = function () {
        getProfitPercentPrivate();
    };

    var getProfitMargin = function () {
        return _profitMarginPercentage;
    };

    var getProfitValue = function () {
        return _profitValue;
    };

    return {
        clearValues: clearValuesPrivate,
        setValues: setValuesPrivate,
        calculateValues: calculateValuesPrivate,
        getLineTotal: getLineTotalPrivate,
        formatWithCurrencySymbol: formatWithCurrencySymbolPrivate,
        getCurrencyID: getCurrencyPrivate,
        getProfitValue: getProfitValue,
        getProfitMargin: getProfitMargin,
        getTaxAmount: getTaxAmountPrivate,
        getLineItemDiscount: getLineItemDiscountPrivate
    };

})();