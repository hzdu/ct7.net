import Compatibility from '../Compatibility';

declare let kco_params: any;

class KlarnaCheckout extends Compatibility {
    protected klarna_button_id = '#klarna-pay-button';

    protected show_easy_tabs = false;

    constructor() {
        super( 'KlarnaCheckout' );
    }

    load( params: any ): void {
        this.show_easy_tabs = params.showEasyTabs;

        if ( !this.show_easy_tabs ) {
            this.hideWooCouponNotification();
        }

        const pay_btn = jQuery( this.klarna_button_id );
        pay_btn.on( 'click', ( evt ) => {
            evt.preventDefault();

            this.maybeChangeToKco();
        } );

        jQuery( window ).on( 'load', () => {
            // If kco_params is undefined, hide the button
            if ( typeof kco_params === 'undefined' ) {
                pay_btn.hide();
            }
        } );
    }

    // When payment method is changed to KCO in regular WC Checkout page.
    maybeChangeToKco() {
        jQuery.ajax( {
            type: 'POST',
            data: {
                kco: true,
                nonce: kco_params.change_payment_method_nonce,
            },
            dataType: 'json',
            url: kco_params.change_payment_method_url,
            success( data ) {},
            error( data ) {},
            complete( data ) {
                window.location.href = data.responseJSON.data.redirect;
            },
        } );
    }

    hideWooCouponNotification() {
        jQuery( '.woocommerce-form-coupon-toggle' ).remove();
        jQuery( '.checkout_coupon.woocommerce-form-coupon' ).remove();
    }
}

export default KlarnaCheckout;
