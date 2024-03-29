( function( $, _, Backbone, api, settings ) {

	happyForms.classes.models.parts.hidden_text = happyForms.classes.models.Part.extend( {
		defaults: function() {
			return _.extend(
				{},
				settings.formParts.hidden_text.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.hidden_text = happyForms.classes.views.Part.extend( {
		template: '#customize-happyforms-hidden-text-template',

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply(this, arguments);

			this.listenTo( this.model, 'change:use_as_subject', this.onUseAsSubjectChange );
		},

		onUseAsSubjectChange: function( model, value ) {
			if ( 1 === value ) {
				var singleLineParts = happyForms.form.get( 'parts' ).where({ type: 'hidden_text' });

				_(singleLineParts).each(function( partModel ) {
					if ( partModel.id !== model.id ) {
						partModel.set( 'use_as_subject', 0 );
					}
				});
			} else {
				$( '[data-bind=use_as_subject]', this.$el ).prop( 'checked', false );
			}
		}
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );
