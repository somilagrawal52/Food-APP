import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { getCart, setCart } from "../lib/store";
import { currency } from "../lib/format";
import { CartList } from "../components/CartList";
import { showToast } from "../lib/utils";

const PROMO_CODES = {
  LAUNCH50: { type: "flat", value: 50, label: "Rs 50 Launch Discount" },
  WELCOME20: { type: "percent", value: 0.2, label: "20% Welcome Saving" },
  FREEDEL: { type: "freedel", value: 49, label: "Free Delivery Waiver" },
};

function Cart() {
  const [cart, setCartState] = useState(getCart());
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
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

  // Delivery fee logic
  const isFreeDeliveryQualified = total >= 500 || appliedPromo?.code === "FREEDEL";
  const standardDeliveryFee = cart.length ? 49 : 0;
  const deliveryFee = isFreeDeliveryQualified ? 0 : standardDeliveryFee;
  const packagingFee = cart.length ? 19 : 0;

  // Discount calculation
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "flat") promoDiscount = Math.min(total, appliedPromo.value);
    else if (appliedPromo.type === "percent") promoDiscount = Math.round(total * appliedPromo.value);
  }

  // Automatic loyalty discount for orders above 600
  const loyaltyDiscount = total >= 600 && !appliedPromo ? 60 : 0;
  const totalDiscount = promoDiscount + loyaltyDiscount;

  const payable = Math.max(0, total + deliveryFee + packagingFee - totalDiscount);

  const freeDeliveryThreshold = 500;
  const amountNeededForFreeDel = Math.max(0, freeDeliveryThreshold - total);
  const freeDelProgress = Math.min(100, Math.round((total / freeDeliveryThreshold) * 100));

  const refreshCart = () => setCartState(getCart());

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      showToast(`Promo ${code} applied successfully!`, "success");
      setPromoInput("");
    } else {
      showToast("Invalid promo code. Try LAUNCH50 or FREEDEL", "error");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast("Promo removed", "info");
  };

  const placeOrder = async () => {
    const currentAuth = getAuth();
    if (!currentAuth?.token) {
      showToast("Please log in to complete your checkout", "error");
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
      showToast("Order placed successfully! Preparing your culinary experience.", "success");
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
        <div className="eyebrow">Cart & Checkout</div>
        <h1>Review Your Order</h1>
        <p className="muted">Review dishes, delivery logistics, promo discounts, and confirm checkout.</p>
      </section>

      {cart.length > 0 ? (
        <section className="section cart-grid">
          <div>
            {/* Free Delivery Meter */}
            <div className="free-delivery-meter-card">
              <div className="between" style={{ marginBottom: "6px" }}>
                <span className="text-sm font-bold">
                  {amountNeededForFreeDel === 0 ? "🎉 Free Delivery Unlocked!" : `Add ${currency(amountNeededForFreeDel)} more for Free Delivery`}
                </span>
                <span className="text-xs muted">{freeDelProgress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${freeDelProgress}%` }}></div>
              </div>
            </div>

            <CartList onRefresh={refreshCart} />
          </div>

          <aside className="side-panel stack-lg">
            <h2>Order Summary</h2>

            {/* Promo Code Input Box */}
            <form className="promo-input-group" onSubmit={applyPromo}>
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo code (e.g. LAUNCH50)"
                className="input promo-input"
              />
              <button type="submit" className="btn ghost-btn promo-apply-btn">
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div className="active-promo-pill between">
                <span className="text-xs font-bold">🏷️ {appliedPromo.code}: {appliedPromo.label}</span>
                <button type="button" className="btn-text-only text-xs" onClick={removePromo}>✕ Remove</button>
              </div>
            )}

            <div className="checkout-lines">
              <div className="checkout-line">
                <span>Items Subtotal ({itemCount})</span>
                <strong>{currency(total)}</strong>
              </div>
              <div className="checkout-line">
                <span>Delivery & Insulated Courier</span>
                <strong>{deliveryFee === 0 ? <span style={{ color: "var(--color-success)" }}>FREE</span> : currency(deliveryFee)}</strong>
              </div>
              <div className="checkout-line">
                <span>Eco-Packaging & Service Charge</span>
                <strong>{currency(packagingFee)}</strong>
              </div>
              {totalDiscount > 0 && (
                <div className="checkout-line" style={{ color: "var(--color-success)" }}>
                  <span>Discount Savings</span>
                  <strong>- {currency(totalDiscount)}</strong>
                </div>
              )}
              <div className="checkout-line total">
                <span>Total Payable</span>
                <strong style={{ color: "var(--color-accent)" }}>{currency(payable)}</strong>
              </div>
            </div>

            {/* Delivery Inputs */}
            <div className="stack" style={{ gap: "10px", margin: "var(--space-2xs) 0" }}>
              <label className="form-label" style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                Delivery Destination
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Street address, apartment, suite number..."
                className="input"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}
              />
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Delivery instructions (e.g. Ring buzzer 4B, leave at door)"
                className="input"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}
              />
            </div>

            {/* Quality & Speed Assurance */}
            <div className="checkout-guarantee-strip">
              <span>🛡️ 100% Thermal Freshness Guarantee • 25-35 min arrival</span>
            </div>

            <button
              className="btn primary-btn btn-lg"
              style={{ width: "100%" }}
              type="button"
              onClick={placeOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Securing Order..." : `Confirm & Pay ${currency(payable)}`}
            </button>
            <Link className="btn ghost-btn" style={{ width: "100%" }} to="/menu">Add More Signature Dishes</Link>
          </aside>
        </section>
      ) : (
        <section className="section empty-cart-section">
          <div className="empty-cart-card">
            <span className="empty-cart-icon">🍽️</span>
            <h2>Your Cart is Currently Empty</h2>
            <p className="muted" style={{ maxWidth: "460px", margin: "8px auto 24px" }}>
              Explore our verified partner restaurants, award-winning chef specials, and add your favorite dishes to start a tasting order.
            </p>
            <Link className="btn primary-btn btn-lg" to="/menu">
              Explore Tasting Menu
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

export default Cart;
