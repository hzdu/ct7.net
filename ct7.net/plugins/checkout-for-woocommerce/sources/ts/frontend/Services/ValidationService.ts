import DataService    from './DataService';
import LoggingService from './LoggingService';
import TabService     from './TabService';

type validatorFactory = () => Promise<any>;
type validatorFactoryQueue = Record<string, Array<validatorFactory>>;
class ValidationService {
    protected static validatorFactoryQueue: validatorFactoryQueue = {};

    static load(): void {
        DataService.setRuntimeParameter( 'cfw_suppress_js_field_validation', false );

        ValidationService.validateTabsBeforeSwitch();
        ValidationService.validateOnFormSubmit();

        jQuery( window ).on( 'load', () => { ValidationService.validatePreviousTabs(); } );

        TabService.tabContainer.on( 'easytabs:after', () => {
            // Clean up the state so that the next validation runs fresh
            jQuery( '.cfw-validation-passed' ).removeClass( 'cfw-validation-passed' );
        } );
    }

    static addValidatorFactory( tab: string, validator: validatorFactory ): void {
        if ( !ValidationService.validatorFactoryQueue[ tab ] ) {
            ValidationService.validatorFactoryQueue[ tab ] = [];
        }

        ValidationService.validatorFactoryQueue[ tab ].push( validator );
    }

    static validateTabsBeforeSwitch(): void {
        TabService.tabContainer.on( 'easytabs:before', ( event, clicked, target ) => {
            // TODO: Can we be honest with ourselves and agree that this is a bit of a hack?
            if ( DataService.getRuntimeParameter( 'cfw_suppress_js_field_validation' ) ) {
                return true;
            }

            const targetId      = target.attr( 'id' );
            const currentTab    = TabService.getCurrentTab();
            const alreadyPassed = currentTab.hasClass( 'cfw-validation-passed' );
            const movingBack    = !currentTab.nextAll( `#${targetId}.cfw-panel` ).length; // technically a misnomer

            if ( alreadyPassed || movingBack ) {
                return true;
            }

            ValidationService.validateTab( currentTab.attr( 'id' ), targetId );

            event.stopImmediatePropagation();
            return false;
        } );
    }

    static validateTab( tab: string, destinationTab: string ): void {
        const currentTab = jQuery( `#${tab}` );

        // Prevent duplicate runs
        if ( currentTab.hasClass( 'cfw-validation-pending' ) ) {
            return;
        }

        currentTab.addClass( 'cfw-validation-pending' );
        const currentTabButton = currentTab.find( '.cfw-bottom-controls .cfw-primary-btn ' );

        currentTabButton.addClass( 'cfw-button-loading' );

        const promises = ValidationService.getValidatorPromisesForTab( tab );

        const finished = () => {
            currentTab.removeClass( 'cfw-validation-pending' );
            currentTabButton.removeClass( 'cfw-button-loading' );
        };

        Promise
            .all( promises )
            .then(
                () => {
                    currentTab.addClass( 'cfw-validation-passed' );
                    TabService.go( destinationTab );
                    finished();
                },
                // Faster than a catch block
                ( reason ) => {
                    if ( reason ) {
                        LoggingService.logError( `CheckoutWC Tab Validation Promise Failed: ${reason}` );
                    }
                    finished();
                },
            );
    }

    static validateOnFormSubmit(): void {
        const { checkoutForm } = DataService;

        checkoutForm.on( 'submit', ( e, passedValidation ) => {
            if ( passedValidation ) {
                return; // allow form to submit
            }

            // TODO: Can we be honest with ourselves and agree that this is a bit of a hack?
            if ( DataService.getRuntimeParameter( 'cfw_suppress_js_field_validation' ) ) {
                return;
            }

            // Immediately stop form submission to allow validators to run
            e.preventDefault();
            e.stopImmediatePropagation(); // prevent bubbling up the DOM *and* prevent other submit handlers from firing, such as completeOrder

            const promises = [];
            const tabsToValidate = [];

            if ( DataService.getSetting( 'enable_one_page_checkout' ) ) {
                // Validate all tabs
                jQuery( '.cfw-panel' ).each( ( index, tab ) => {
                    tabsToValidate.push( tab.id );
                } );
            } else if ( DataService.getSetting( 'order_review_step_enabled' ) ) {
                tabsToValidate.push( 'cfw-order-review' );
            } else {
                tabsToValidate.push( 'cfw-payment-method' );
            }

            tabsToValidate.forEach( ( tab ) => {
                promises.push( ...ValidationService.getValidatorPromisesForTab( tab ) );
            } );

            const currentTab = jQuery( '#cfw-payment-method' );
            const currentTabButton = currentTab.find( '.cfw-bottom-controls .cfw-primary-btn ' );
            currentTabButton.addClass( 'cfw-button-loading' );

            const finished = () => {
                currentTabButton.removeClass( 'cfw-button-loading' );
            };

            Promise
                .all( promises )
                .then(
                    () => {
                        checkoutForm.trigger( 'submit', [ true ] );
                        finished();
                    },
                    // Faster than a catch block
                    ( reason ) => {
                        if ( reason ) {
                            LoggingService.logError( `CheckoutWC Validation Promise Failed: ${reason}` );
                        }
                        finished();
                    },
                );
        } );
    }

    static validatePreviousTabs(): void {
        const currentTab = TabService.getCurrentTab();
        const previousTabs = currentTab.prevAll( '.cfw-panel' );

        previousTabs.each( ( index, tab ) => {
            Promise
                .all( ValidationService.getValidatorPromisesForTab( tab.id ) )
                .catch( () => {
                    TabService.go( tab.id );
                } );
        } );
    }

    static getValidatorPromisesForTab( tab: string ): Promise<any>[] {
        const validators = ValidationService.validatorFactoryQueue[ tab ] ?? [];
        const parsleyPromise = DataService.checkoutForm.parsley().whenValidate( { group: tab } ); // technically not a Promise but respected by Promise.all

        return validators.map( ( callback ) => callback() ).concat( [ parsleyPromise ] );
    }
}

export default ValidationService;
