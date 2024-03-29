import DataService            from '../Services/DataService';
import EmailAutocompleteInput from './EmailAutocompleteInput';

class FormField {
    private static _floatClass = 'cfw-label-is-floated';

    constructor() {
        this.processFieldLabels();

        jQuery( document.body ).on( 'keyup change', '.cfw-input-wrap :input', ( e ) => {
            FormField.maybeAddFloatClass( jQuery( e.target ) );
        } );

        // Handle fields after dynamic refreshes
        jQuery( document.body ).on( 'updated_checkout', () => {
            this.processFieldLabels();
        } );

        // Disable highlighted countries separator
        jQuery( '.country_select' ).find( 'option:contains(---)' ).attr( 'disabled', 'disabled' );

        jQuery( document.body ).on( 'click', '.cfw-password-toggle', function () {
            jQuery( this ).toggleClass( 'cfw-password-eye-open' );

            if ( jQuery( this ).hasClass( 'cfw-password-eye-open' ) ) {
                jQuery( this ).next( 'input' ).attr( 'type', 'password' );
            } else {
                jQuery( this ).next( 'input' ).attr( 'type', 'text' );
            }
        } );

        jQuery( window ).on( 'load', () => {
            // Attempt to remove our styling from select2 styled fields
            jQuery( '.cfw-select-input' ).each( ( index, element ) => {
                if ( !jQuery( element ).find( '.select2-hidden-accessible' ).length ) {
                    return;
                }

                jQuery( element ).removeClass( 'cfw-select-input cfw-input-wrap cfw-label-is-floated' );
            } );
        } );

        const options: EmailAutocompleteInputOptions = {
            inputElement: jQuery( '#billing_email' ).get( 0 ) as HTMLInputElement,
        };

        new EmailAutocompleteInput( options );

        // Trim email field on change
        DataService.checkoutForm.on( 'change', '#billing_email', ( e ) => {
            const emailField = jQuery( '#billing_email' );

            if ( !emailField.length ) {
                return;
            }

            emailField.val( e.target.value.trim() );
        } );
    }

    static maybeAddFloatClass( element: any ): void {
        const parentElement = jQuery( element ).parents( '.cfw-input-wrap' );

        if ( !parentElement.find( '.cfw-floatable-label' ).length ) {
            return;
        }

        if ( jQuery( element ).attr( 'type' ) === 'hidden' ) {
            return;
        }

        if ( jQuery( element ).val() !== '' || jQuery( element ).is( 'select' )  ) {
            parentElement.addClass( FormField.floatClass );
        } else {
            parentElement.removeClass( FormField.floatClass );
        }
    }

    processFieldLabels(): void {
        jQuery( '.cfw-input-wrap :input' ).each( ( index, element ) => {
            FormField.maybeAddFloatClass( element );
        } );
    }

    static get floatClass(): string {
        return this._floatClass;
    }
}

export default FormField;
