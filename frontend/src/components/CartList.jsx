import React from "react";
import { getCart, removeCartItem, updateCartItem } from "../lib/store";
import { currency, fallbackImage } from "../lib/format";

export function CartList({ onRefresh } = {}) {
  const items = getCart();
  if (!items.length) return <div className="empty">Your cart is empty. Begin your culinary journey.</div>;

  const refresh = () => {
    if (onRefresh) onRefresh();
    else window.location.reload();
    window.dispatchEvent(new Event("plateful:storage"));
  };

  return (
    <div className="list stack-lg">
      {items.map((item) => (
        <div className="cart-item" key={item._id}>
          <img src={item.imageURL || fallbackImage(item.title)} alt={item.title} />
          <div>
            <div className="between">
              <h3>{item.title}</h3>
              <button className="btn ghost-btn" style={{ padding: "8px 12px" }} type="button" onClick={() => { removeCartItem(item._id); refresh(); }}>Remove</button>
            </div>
            <p className="muted">{currency(item.price)}</p>
            <div className="qty-row">
              <button className="qty-btn" type="button" onClick={() => { updateCartItem(item._id, -1); refresh(); }}>-</button>
              <strong>{item.quantity}</strong>
              <button className="qty-btn" type="button" onClick={() => { updateCartItem(item._id, 1); refresh(); }}>+</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
