/**
 * wcj-ajax-exchange-rates.js
 *
 * @version 1.0.0
 */
jQuery(document).ready(function() {
    jQuery(".exchage_rate_button").click(function() {
        var input_id = '#' + this.getAttribute('multiply_by_field_id'); //+' input';
        var data = {
            'action': 'wcj_ajax_get_exchange_rates',
					'wcj_currency_from': this.getAttribute( 'currency_from' ),
					'wcj_currency_to': this.getAttribute( 'currency_to' ),
					'wpnonce': ajax_object.wpnonce,
        };
        jQuery.ajax({
            type: "POST",
            url: ajax_object.ajax_url,
            data: data,
            success: function(response) {
                jQuery(input_id).val(parseFloat(response));
            },
        });
        return false;
    });
});