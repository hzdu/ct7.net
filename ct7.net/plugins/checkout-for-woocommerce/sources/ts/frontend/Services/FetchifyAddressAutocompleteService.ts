import FieldValidationRefresher from '../Interfaces/FieldValidationRefresher';
import DataService              from './DataService';
import LoggingService           from './LoggingService';

declare let clickToAddress: any;

class FetchifyAddressAutocompleteService {
    protected fieldValidationRefresher: FieldValidationRefresher;

    constructor( fieldValidationRefresher: FieldValidationRefresher ) {
        this.fieldValidationRefresher = fieldValidationRefresher;

        if ( typeof clickToAddress === 'undefined' ) {
            LoggingService.logError( 'CheckoutWC: Could not load Fetchify object.' );
        }

        const config = {
            accessToken: DataService.getSetting( 'fetchify_access_token' ),
            gfxMode: 1,
            domMode: 'name', // Use names to find form elements
            countryMatchWith: 'iso_2',
            enabledCountries: this.getAllowedCountries(),
            defaultCountry: DataService.getSetting( 'fetchify_default_country' ),
            getIpLocation: DataService.getSetting( 'fetchify_enable_geolocation' ),
        };

        // eslint-disable-next-line new-cap
        const fetchify = new clickToAddress( config );

        this.attachFetchify( 'billing', fetchify );

        if ( DataService.getSetting( 'needs_shipping_address' ) === true ) {
            this.attachFetchify( 'shipping', fetchify );
        }

        jQuery( '.cfw-fetchify-enter-address-manually' ).on( 'click', ( e ) => {
            e.preventDefault();

            let prefix = '';

            if ( jQuery( e.currentTarget ).parents( '.woocommerce-shipping-fields' ).length ) {
                prefix = 'shipping';
            } else {
                prefix = 'billing';
            }

            jQuery( e.currentTarget ).hide();
            this.showAddressFields( prefix );
        } );
    }

    showAddressFields( prefix: string ): void {
        jQuery( `#${prefix}_address_1_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_address_2_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_city_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_postcode_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_country_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_state_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300 );
        jQuery( `#${prefix}_company_field` ).parents( '.cfw-input-wrap-row' ).slideDown( 300, () => {
            jQuery( `#${prefix}_address_1` ).trigger( 'focus' );
        } );

        jQuery( `.woocommerce-${prefix}-fields` ).find( '.cfw-fetchify-enter-address-manually' ).hide();
    }

    attachFetchify( prefix: string, fetchify: any ): void {
        const onResultSelected = ( object: any, dom: any, result: any ) => {
            this.safeFillCountryState( prefix, result );
            this.showAddressFields( prefix );

            this.fieldValidationRefresher.refreshField( document.getElementById( `${prefix}_address_1` ) );
            this.fieldValidationRefresher.refreshField( document.getElementById( `${prefix}_address_2` ) );
            this.fieldValidationRefresher.refreshField( document.getElementById( `${prefix}_company` ) );
            this.fieldValidationRefresher.refreshField( document.getElementById( `${prefix}_city` ) );
            this.fieldValidationRefresher.refreshField( document.getElementById( `${prefix}_postcode` ) );

            jQuery( `#${prefix}_fetchify_search` ).val( '' );

            const address2 = jQuery( `#${prefix}_address_2` );

            if ( address2.length && address2.val() !== '' ) {
                jQuery( `#${prefix}_address_2_field` ).prev( '.cfw-add-field' ).trigger( 'click' );
            }
        };

        fetchify.attach( {
            search: jQuery( `#${prefix}_fetchify_search` ).length ? `${prefix}_fetchify_search` : `${prefix}_address_1`, // search box element
            line_1: `${prefix}_address_1`,
            line_2: `${prefix}_address_2`,
            company: `${prefix}_company`,
            town: `${prefix}_city`,
            postcode: `${prefix}_postcode`,
            country: `${prefix}_country`,
            placeholders: true,
            texts: {
                default_placeholder: DataService.getMessage( 'fetchify_default_placeholder' ),
            },
        }, { onResultSelected } );

        if (
            jQuery( `#${prefix}_address_1` ).val() === ''
            && jQuery( `#${prefix}_address_2` ).val() === ''
            && jQuery( `#${prefix}_company` ).val() === ''
            && jQuery( `#${prefix}_city` ).val() === ''
            && jQuery( `#${prefix}_postcode` ).val() === ''
        ) {
            jQuery( `#${prefix}_address_1_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_address_2_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_city_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_postcode_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_country_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_state_field` ).parents( '.cfw-input-wrap-row' ).hide();
            jQuery( `#${prefix}_company_field` ).parents( '.cfw-input-wrap-row' ).hide();
        } else {
            jQuery( `.woocommerce-${prefix}-fields` ).find( '.cfw-fetchify-enter-address-manually' ).hide();
        }
    }

    safeFillCountryState( prefix: any, result: any ): void {
        try {
            this.fillCountryState( prefix, result );
        } catch ( err ) {
            LoggingService.logError( err );
        }
    }

    fillCountryState( prefix: any, result: any ): void {
        if ( !result ) {
            return;
        }

        jQuery( document.body ).one( 'cfw_fetchify_country_changed', () => {
            setTimeout( () => {
                const state = jQuery( `#${prefix}_state` );
                const foundState = result.province_name.replace( 'County ', '' );

                // Special State handling
                if ( !state.is( 'select' ) || state.find( `option[value="${foundState}"]` ).length ) {
                    state.val( foundState );
                } else {
                    state.val( state.find( `option:contains(${foundState})` ).val() );
                }

                state.trigger( 'change', [ 'cfw_address_autocompleted ' ] );

                this.fieldValidationRefresher.refreshField( state.get( 0 ) );
            }, 300 );
        } );

        const country = jQuery( `#${prefix}_country` ).val( result.country.iso_3166_1_alpha_2 ).trigger( 'change', [ 'cfw_address_autocompleted' ] );

        this.fieldValidationRefresher.refreshField( country.get( 0 ) );

        jQuery( document.body ).trigger( 'cfw_fetchify_country_changed' );
    }

    getAllowedCountries(): Array<string> {
        const countryNames = [];

        jQuery( '#shipping_country option, #billing_country option' ).each( ( index, elem ) => {
            const countryVal = jQuery( elem ).val();

            if ( countryVal !== '' && countryNames.indexOf( countryVal ) === -1 ) {
                countryNames.push( countryVal );
            }
        } );

        return countryNames;
    }
}

export default FetchifyAddressAutocompleteService;
