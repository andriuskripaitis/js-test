(function () {

    'use strict';

    $(document).ready(function () {
        var input = $('.search-input');
        var button = $('.search-button');
        var result = $('.result');
        var $table = $('table.data');

        function getCompanySymbol(companyName) {
            return $.getJSON('Api/v2/Lookup/json', {input: companyName});
        }

        function getQuote(symbol) {
            return $.getJSON('Api/v2/Quote/json', {symbol: symbol});
        }

        function showData(data) {
            
            var $headRow = $('<tr></tr>');
            var $dataRow = $('<tr class="result"></tr>');
            var initialized = $table.data('initialized') || false;

            $.each(Object.keys(data), function(i, key) {

                if (!initialized) {
                    $headRow.append('<th>' + key + '</th>');
                }
                var value = data[key];
                if (typeof value === 'number') {
                    value = value.toFixed(3);
                }
                $dataRow.append('<td>' + value + '</td>');
            });

            if (!initialized) {
                 $table
                    .append($headRow)
                    .data('initialized', true)
            }
           
            $table
                .append($dataRow)
                .show();
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
            $table.hide().find('.result').remove();
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
                    return showData(data);
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
