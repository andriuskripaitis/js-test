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

            if (data.Status !== "SUCCESS") {
                return;
            }
            
            var $headRow = $('<tr></tr>');
            var $dataRow = $('<tr class="result"></tr>');
            var initialized = $table.data('initialized') || false;

            $.each(Object.keys(data), function(i, key) {

                if (key === "Status") {
                    return;
                }

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

            $dataRow.on('click', function(){
                 new Markit.InteractiveChartApi(data.Symbol, 3650);
            });
        }

       function search() {

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

                        result.text('Nothing found');
                        return;
                    }

                    result.text('Click on row to load historic chart data.');

                    $.each(data, function(i, data) {

                        getQuote(data.Symbol)
                            .then(function(data){
                                showData(data);
                            });
                    })
                })
                .done(unblockInterface)
                .fail(function(){
                    result.text('Some error has occurred, try again later.');
                    unblockInterface();
                });
        }

        function unblockInterface(){
            button.prop('disabled', false);
        }

        button.on('click', search);

        input.keypress(function (e) {
            if (e.which === 13) {
                search();
            }
        });
    });

}());