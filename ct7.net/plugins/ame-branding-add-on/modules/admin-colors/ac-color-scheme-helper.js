'use strict';
/// <reference path="../../assets/jquery.d.ts" />
jQuery(document).on('adminMenuEditor:acRegister.ameBrandingAdminColors', function (event, adminCustomizer) {
    var $ = jQuery;
    //Remove the handler after the first call.
    $(document).off('adminMenuEditor:acRegister.ameBrandingAdminColors');
    var isColorSchemeSectionOpen = false;
    function updateForcedPreviewState() {
        adminCustomizer.executeRpcMethod('ameBrandingAdminColors.setForceEnablePreview', isColorSchemeSectionOpen);
    }
    function isColorSchemeSection(element) {
        var colorSchemeSectionId = 'ame-ac-section-ame-branding-color-scheme';
        return $(element).is('#' + colorSchemeSectionId);
    }
    $('body')
        //Always enable color scheme preview when the user opens the color scheme section.
        .on('adminMenuEditor:enterSection', function (event) {
        isColorSchemeSectionOpen = isColorSchemeSection(event.target);
        updateForcedPreviewState();
    })
        //When the preview frame is reloaded, re-enable color scheme preview if our section
        //is still open.
        .on('adminMenuEditor:acPreviewConnectionReady', function () {
        if (isColorSchemeSectionOpen) {
            updateForcedPreviewState();
        }
    });
});
//# sourceMappingURL=ac-color-scheme-helper.js.map