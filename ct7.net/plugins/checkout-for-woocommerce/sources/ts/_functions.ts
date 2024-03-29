/**
 * An error tolerant DOM ready replacement for jQuery(document).ready()
 * @param fn
 */
function cfwDomReady( fn ): void {
    if ( document.readyState !== 'loading' ) {
        fn();
    } else {
        document.addEventListener( 'DOMContentLoaded', fn );
    }
}

function cfwDefineScrollToNotices(): void {
    // Common scroll to element code.
    jQuery.scroll_to_notices = ( scrollElement ) => {
        if ( scrollElement.length ) {
            jQuery( 'html, body' ).animate( {
                scrollTop: ( scrollElement.offset().top - 100 ),
            }, 1000 );
        }
    };
}

export { cfwDomReady, cfwDefineScrollToNotices };
