(function () {

    'use strict';

    $(document).ready(function () {
        var input = $('.search-input');
        var button = $('.search-button');
        var result = $('.result');

        function getCompanySymbol(companyName) {
            return $.getJSON('Api/v2/Lookup/json', {input: companyName});
        }

        function getQuote(symbol) {
            return $.getJSON('Api/v2/Quote/json', {symbol: symbol});
        }

        button.on('click', function () {

            var companyName = $.trim(input.val());

            if (!companyName) {
                input
                    .addClass('invalid')
                    .on('keypress', function keypressHandler() {
                        input
                            .removeClass('invalid')
                            .off('keypress', keypressHandler);
                    });

                return;
            }

            result.empty();
            button.prop('disabled', true);

            getCompanySymbol(companyName)
                .then(function(data) {

                    if (!data.length) {

                        result.text("Nothing found");
                        return;
                    }
                    return getQuote(data[0].Symbol);
                })
                .then(function(data) {
                    result.text(JSON.stringify(data, null, 4));
                })
                .fail(function(error) {
                    console.log(error);
                })
                .done(function() {
                    button.prop('disabled', false);
                });
        });
    });

}());
