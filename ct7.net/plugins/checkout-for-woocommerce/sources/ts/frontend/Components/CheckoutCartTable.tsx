import React                                   from 'react';
import { dispatch, useSelect }                 from '@wordpress/data';
import ReactHtmlParser                         from 'react-html-parser';
import CartItemInterface                       from '../../interfaces/CartItemInterface';
import DataStores                              from '../DataStores';
import LoggingService                          from '../Services/LoggingService';
import DataService                             from '../Services/DataService';
import FreeShippingProgressBar                 from './FreeShippingProgressBar';
import SideCartData                            from '../../interfaces/SideCartData';
import CheckoutCartTableRow                    from './CheckoutCartTableRow';

const CheckoutCartTable: React.FC = () => {
    const items = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartItems( null ), [] );
    const staticActions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartStaticActions( null ), [] );
    const sideCartData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getSideCartData( null ), [] ) as SideCartData;

    const updateItem = ( item: CartItemInterface ) => {
        // Find the index of the item to update
        const index = items.findIndex( ( i: CartItemInterface ) => i.item_key === item.item_key );

        if ( index !== -1 ) {
            // Create a new array with the updated item
            const updatedItems = [ ...items ];
            updatedItems[ index ] = item;

            // Trigger update checkout event
            DataService.setRuntimeParameter( 'needsAjaxUpdate', true );
            DataService.setRuntimeParameter( 'updateCartItems', true );

            // Use dispatch to update the items in the store
            ( dispatch( DataStores.cart_store_key ) as any ).setCartItems( updatedItems );
        } else {
            LoggingService.logError( 'Cannot update item quantity. Item not found in items array.' );
        }
    };

    return (
        <>
            {
                !sideCartData.is_empty
                && DataService.getSetting( 'enable_free_shipping_progress_bar' )
                && DataService.getSetting( 'enable_free_shipping_progress_bar_at_checkout' )
                && (
                    <FreeShippingProgressBar/>
                )
            }
            <table className="cfw-cart-table cfw-module">
                <tbody>
                    {ReactHtmlParser( staticActions?.cfw_cart_html_table_start )}
                    {ReactHtmlParser( staticActions?.cfw_checkout_cart_html_table_start )}
                    {items.map( ( item: CartItemInterface ) => ( <CheckoutCartTableRow item={item} updateItem={updateItem} key={item.item_key} /> ) )}
                </tbody>
            </table>
            {ReactHtmlParser( staticActions?.cfw_after_cart_html )}
        </>
    );
};

export default CheckoutCartTable;
