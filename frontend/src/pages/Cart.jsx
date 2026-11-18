import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { getCart, setCart } from "../lib/store";
import { currency } from "../lib/format";
import { CartList } from "../components/CartList";
import { showToast } from "../lib/utils";

function Cart() {
  const [cart, setCartState] = useState(getCart());
  const auth = getAuth();
  const defaultAddress = Array.isArray(auth?.user?.address)
    ? auth.user.address[0]
    : auth?.user?.address || "";
  const [deliveryAddress, setDeliveryAddress] = useState(defaultAddress);
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = cart.length ? 49 : 0;
  const packagingFee = cart.length ? 19 : 0;
  const discount = total >= 500 ? 60 : 0;
  const payable = total + deliveryFee + packagingFee - discount;

  const refreshCart = () => setCartState(getCart());

  const placeOrder = async () => {
    const currentAuth = getAuth();
    if (!currentAuth?.token) {
      showToast("Please log in to place your order", "error");
      navigate("/auth");
      return;
    }
    if (!deliveryAddress.trim()) {
      showToast("Please provide a delivery address", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const fullAddress = orderNote.trim()
        ? `${deliveryAddress.trim()} (Instructions: ${orderNote.trim()})`
        : deliveryAddress.trim();

      await api("/food/placeorder", {
        method: "POST",
        body: JSON.stringify({
          cart,
          deliveryAddress: fullAddress,
        }),
      });
      setCart([]);
      setCartState([]);
      showToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
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

          <div className="stack" style={{ gap: "8px", margin: "var(--space-xs) 0" }}>
            <label className="form-label" style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Delivery Destination
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Delivery address (e.g. 124 Park Ave, Apt 4B)"
              className="input"
              style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}
            />
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Notes for driver / kitchen (optional)"
              className="input"
              style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}
            />
          </div>

          <button
            className="btn primary-btn"
            style={{ width: "100%" }}
            type="button"
            onClick={placeOrder}
            disabled={!cart.length || isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
          </button>
          <Link className="btn ghost-btn" style={{ width: "100%" }} to="/menu">Add more items</Link>
        </aside>
      </section>
    </>
  );
}

export default Cart;
