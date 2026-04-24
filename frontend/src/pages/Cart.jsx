import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { getCart, setCart } from "../lib/store";
import { currency } from "../lib/format";
import { CartList } from "../components/CartList";
import { showToast } from "../lib/utils";

function Cart() {
  const [cart, setCartState] = useState(getCart());
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = cart.length ? 49 : 0;
  const packagingFee = cart.length ? 19 : 0;
  const discount = total >= 500 ? 60 : 0;
  const payable = total + deliveryFee + packagingFee - discount;

  const refreshCart = () => setCartState(getCart());

  const placeOrder = async () => {
    const auth = getAuth();
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    try {
      await api("/food/placeorder", {
        method: "POST",
        body: JSON.stringify({
          cart,
          deliveryAddress: auth.user?.address?.[0] || auth.user?.address || ""
        })
      });
      setCart([]);
      setCartState([]);
      navigate("/orders");
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">Checkout</div>
        <h1>Review your order</h1>
        <p className="muted">Check quantities, fees, and delivery details before placing the order.</p>
      </section>
      <section className="section cart-grid">
        <CartList onRefresh={refreshCart} />
        <aside className="side-panel stack-lg">
          <h2>Order Summary</h2>
          <div className="checkout-lines">
            <div className="checkout-line"><span>Items ({itemCount})</span><strong>{currency(total)}</strong></div>
            <div className="checkout-line"><span>Delivery Fee</span><strong>{currency(deliveryFee)}</strong></div>
            <div className="checkout-line"><span>Service Charge</span><strong>{currency(packagingFee)}</strong></div>
            {discount > 0 && <div className="checkout-line" style={{ color: "var(--color-success)" }}><span>Loyalty Discount</span><strong>- {currency(discount)}</strong></div>}
            <div className="checkout-line total"><span>Total Payable</span><strong>{currency(payable)}</strong></div>
          </div>
          <div className="checkout-note">
            <strong>{total >= 500 ? "Discount unlocked" : `Add ${currency(500 - total)} more to unlock savings`}</strong>
            <p className="muted">Delivery fee and service charge are shown clearly before payment.</p>
          </div>
          <button className="btn primary-btn" style={{ width: "100%" }} type="button" onClick={placeOrder} disabled={!cart.length}>Confirm Order</button>
          <Link className="btn ghost-btn" style={{ width: "100%" }} to="/menu">Add more items</Link>
        </aside>
      </section>
    </>
  );
}

export default Cart;
