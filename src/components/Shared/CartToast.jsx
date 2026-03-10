import React from 'react';

export function CartToast({ item, visible }) {
    return (
        <div className={`cart-toast ${visible ? "show" : ""}`}>
            <span>{"\u2713"}</span>
            <span>{item ? item.name : ""} added to cart</span>
        </div>
    );
}

export default CartToast;
