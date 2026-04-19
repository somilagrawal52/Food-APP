import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { addCartItem, isFavorite, saveRecentFood, toggleFavorite } from "../lib/store";
import { fallbackImage, currency } from "../lib/format";
import { showToast } from "../lib/utils";

function Food() {
  const { id } = useParams();
  const [food, setFood] = useState(null);

  useEffect(() => {
    if (!id) return;
    api(`/food/food/${id}`).then((data) => {
      setFood(data.food);
      saveRecentFood(data.food);
    });
  }, [id]);

  if (!id) return <div className="section empty">Missing food id.</div>;
  if (!food) return <div className="section empty">Loading food...</div>;

  return (
    <>
      <section className="section cart-grid">
        <img className="detail-cover" src={food.imageURL || fallbackImage(food.title)} alt={food.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        <aside className="side-panel stack-lg">
          <div className="eyebrow">Signature Selection</div>
          <h1>{food.title}</h1>
          <p className="muted" style={{ fontSize: 'var(--text-lg)' }}>{food.description}</p>
          
          <div className="detail-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span className="tag">{food.category || "Gourmet"}</span>
            <span className="tag">{food.Resturants?.title || "Premium Kitchen"}</span>
            <span className="tag" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>Estimated 25 min</span>
          </div>

          <div className="checkout-lines" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
            <div className="between">
              <span className="muted font-medium">Unit Price</span>
              <strong style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-accent)' }}>{currency(food.price)}</strong>
            </div>
          </div>

          <div className="promo-row stack" style={{ gap: '12px' }}>
            <div className="tag" style={{ textAlign: 'center', background: 'rgba(50, 215, 75, 0.1)', color: 'var(--color-success)' }}>Chef's Special Recommendation</div>
            <p className="muted text-xs">Prepared using premium ingredients and artisanal techniques.</p>
          </div>

          <div className="stack" style={{ gap: '12px' }}>
            <button className="btn primary-btn" style={{ width: '100%' }} type="button" onClick={() => { addCartItem(food); showToast(`${food.title} added to cart`); window.dispatchEvent(new Event("plateful:storage")); }}>
              Add to Cart
            </button>
            <div className="between" style={{ gap: '12px' }}>
              <button
                className="btn ghost-btn"
                style={{ flex: 1 }}
                type="button"
                onClick={() => {
                  const next = toggleFavorite(food);
                  showToast(next ? `${food.title} saved` : `${food.title} removed`);
                  window.dispatchEvent(new Event("plateful:storage"));
                }}
              >
                {isFavorite(food._id) ? "♥ Saved" : "♡ Save for Later"}
              </button>
              <Link className="btn ghost-btn" style={{ flex: 1 }} to="/cart">Open Cart</Link>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

export default Food;
