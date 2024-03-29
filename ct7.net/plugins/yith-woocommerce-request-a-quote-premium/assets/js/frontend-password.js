/* global wp, pwsL10n, ywraq_pwd */
( function ( $ ) {
	'use strict';
	/**
	 * Password Strength Meter class.
	 */
	var raq_password_strength_meter = {

		/**
		 * Initialize strength meter actions.
		 */
		init: function () {
			$( document.body )
				.on( 'keyup change', 'form#yith-ywraq-default-form #account_password', this.strengthMeter );
			$( 'form.checkout #createaccount' ).change();
		},

		/**
		 * Strength Meter.
		 */
		strengthMeter: function () {
			var wrapper    = $( 'form#yith-ywraq-default-form' ),
				submit     = $( 'input[type="submit"]', wrapper ),
				field      = $( '#account_password', wrapper ),
				strength   = 1,
				fieldValue = field.val();

			raq_password_strength_meter.includeMeter( wrapper, field );

			strength = raq_password_strength_meter.checkPasswordStrength( wrapper, field );

			if ( fieldValue.length > 0 && strength < ywraq_pwd.min_password_strength ) {
				submit.attr( 'disabled', 'disabled' ).addClass( 'disabled' );
			} else {
				submit.removeAttr( 'disabled', 'disabled' ).removeClass( 'disabled' );
			}
		},

		/**
		 * Include meter HTML.
		 *
		 * @param {Object} wrapper
		 * @param {Object} field
		 */
		includeMeter: function ( wrapper, field ) {
			var meter = wrapper.find( '.woocommerce-password-strength' );

			if ( '' === field.val() ) {
				meter.remove();
				$( document.body ).trigger( 'wc-password-strength-removed' );
			} else if ( 0 === meter.length ) {
				field.after( '<div class="woocommerce-password-strength" aria-live="polite"></div>' );
				$( document.body ).trigger( 'wc-password-strength-added' );
			}
		},

		/**
		 * Check password strength.
		 *
		 * @param {Object} field
		 *
		 * @return {Int}
		 */
		checkPasswordStrength: function ( wrapper, field ) {
			var meter     = wrapper.find( '.woocommerce-password-strength' );
			var hint      = wrapper.find( '.woocommerce-password-hint' );
			var hint_html = '<small class="woocommerce-password-hint">' + ywraq_pwd.i18n_password_hint + '</small>';
			var strength  = wp.passwordStrength.meter( field.val(), wp.passwordStrength.userInputDisallowedList(), '' );
			var error     = '';

			// Reset
			meter.removeClass( 'short bad good strong' );
			hint.remove();

			// Error to append
			if ( strength < ywraq_pwd.min_password_strength ) {
				error = ' - ' + ywraq_pwd.i18n_password_error;
			}

			switch ( strength ) {
				case 0 :
					meter.addClass( 'short' ).html( pwsL10n['short'] + error );
					meter.after( hint_html );
					break;
				case 1 :
					meter.addClass( 'bad' ).html( pwsL10n.bad + error );
					meter.after( hint_html );
					break;
				case 2 :
					meter.addClass( 'bad' ).html( pwsL10n.bad + error );
					meter.after( hint_html );
					break;
				case 3 :
					meter.addClass( 'good' ).html( pwsL10n.good + error );
					break;
				case 4 :
					meter.addClass( 'strong' ).html( pwsL10n.strong + error );
					break;
				case 5 :
					meter.addClass( 'short' ).html( pwsL10n.mismatch );
					break;
			}

			return strength;
		}
	};

	raq_password_strength_meter.init();
} )( jQuery );
