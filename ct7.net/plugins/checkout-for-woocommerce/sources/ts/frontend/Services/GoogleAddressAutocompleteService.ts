import cfwGetWPHooks                  from '../../functions/cfwGetWPHooks';
import AutocompleteStrategyFactory    from '../GoogleAddressAutocomplete/AutocompleteStrategies/AutocompleteStrategyFactory';
import FieldValidationRefresher       from '../Interfaces/FieldValidationRefresher';
import DataService                    from './DataService';
import LoggingService                 from './LoggingService';

/* global google */

class GoogleAddressAutocompleteService {
    private _fieldValidator: FieldValidationRefresher;

    constructor( fieldValidator: FieldValidationRefresher ) {
        LoggingService.logNotice( 'Loading Google Address Autocomplete Service' );

        if ( DataService.getRuntimeParameter( 'loaded_google_autocomplete' ) ) {
            return;
        }

        if ( !DataService.getSetting( 'enable_address_autocomplete' ) ) {
            return;
        }

        this._fieldValidator = fieldValidator;

        if ( typeof google === 'undefined' || typeof google.maps === 'undefined' || typeof google.maps.places === 'undefined' || typeof google.maps.places.Autocomplete === 'undefined' ) {
            LoggingService.logError( 'CheckoutWC: Could not load Google Maps object.' );
            return;
        }

        if ( DataService.getSetting( 'needs_shipping_address' ) === true ) {
            this.initAutocomplete( 'shipping_', 'shipping_address_1', DataService.getSetting( 'address_autocomplete_shipping_countries' ) );
        }

        this.initAutocomplete( 'billing_', 'billing_address_1', DataService.getSetting( 'address_autocomplete_billing_countries' )  );

        DataService.setRuntimeParameter( 'loaded_google_autocomplete', true );
    }

    initAutocomplete( prefix: string, mountId: string, countryRestrictions?: string|string[] ): void {
        const field = document.getElementById( mountId ) as HTMLInputElement;

        if ( !field ) {
            return;
        }

        field.autocomplete = 'new-password';

        const options = {
            fields: [ 'address_component' ],
            types: DataService.getSetting( 'google_address_autocomplete_type' ).split( '|' ),
        };

        const autocomplete = new google.maps.places.Autocomplete( field, options );

        if ( countryRestrictions ) {
            autocomplete.setComponentRestrictions( { country: countryRestrictions } );
        }

        // Variable to store the user's input value
        let userInputValue = '';

        // Listen for input events to capture the user's search term
        field.addEventListener( 'input', () => {
            userInputValue = field.value;
        } );

        autocomplete.addListener( 'place_changed', () => {
            this.fillAddress( prefix, autocomplete, field, userInputValue );
        } );
    }

    fillAddress( prefix: string, autocomplete: google.maps.places.Autocomplete, { value: formattedAddress }: HTMLInputElement, userInputValue: string ): void {
        cfwGetWPHooks().doAction( 'cfw_google_address_autocomplete_fill_address', autocomplete, prefix );

        const { address_components: components } = autocomplete.getPlace();

        if ( !components ) {
            return;
        }

        LoggingService.logNotice( 'Google Address Autocomplete Components', components );
        LoggingService.logNotice( 'Google Address Autocomplete Formatted Address', formattedAddress );

        const strategy = AutocompleteStrategyFactory.get( components, formattedAddress, userInputValue );

        this.queueStateUpdate( prefix, strategy.getState() );

        this.updateField( `${prefix}address_1`, strategy.getAddress1() );
        this.updateField( `${prefix}address_2`, strategy.getAddress2() );
        this.updateField( `${prefix}city`, strategy.getCity() );
        this.updateField( `${prefix}postcode`, strategy.getPostcode() );
        this.updateField( `${prefix}country`, strategy.getCountry() );

        const address2 = jQuery( `#${prefix}address_2` );

        if ( address2.length && address2.val() !== '' ) {
            jQuery( `#${prefix}address_2_field` ).prev( '.cfw-add-field' ).trigger( 'click' );
        }
    }

    updateField( id: string, value: string ): void {
        const field = document.getElementById( id );

        if ( !field ) {
            return;
        }

        jQuery( field ).val( value ).trigger( 'change', [ 'cfw_address_autocompleted' ] );

        this._fieldValidator.refreshField( field );
    }

    queueStateUpdate( prefix: string, state: string ): void {
        jQuery( document.body ).one( 'country_to_state_changing', () => {
            setTimeout( () => {
                const stateField = jQuery( `#${prefix}state` );

                const noFuzzySearchNeeded = !stateField.is( 'select' ) || stateField.find( `option[value="${state}"]` ).length;
                const stateValue          = noFuzzySearchNeeded ? state : stateField.find( `option:contains(${state.replace( "'", '’' )})` ).val();

                stateField.val( stateValue );

                stateField.trigger( 'change', [ 'cfw_address_autocompleted' ] );

                this._fieldValidator.refreshField( stateField.get( 0 ) );
            } );
        } );
    }
}

export default GoogleAddressAutocompleteService;
