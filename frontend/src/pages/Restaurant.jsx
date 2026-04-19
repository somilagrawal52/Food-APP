import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { fallbackImage } from "../lib/format";
import { FoodCard } from "../components/FoodCard";

function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (!id) return;
    api(`/resturant/resturant/${id}`).then((data) => setRestaurant(data.resturant));
    api(`/food/foodByResturant/${id}`).then((data) => setFoods(data.foods || []));
  }, [id]);

  if (!id) return <div className="section empty">Missing restaurant id.</div>;
  if (!restaurant) return <div className="section empty">Loading restaurant...</div>;

  return (
    <>
      <section className="section cart-grid">
        <img className="detail-cover" src={restaurant.imageURL || restaurant.logoURL || fallbackImage(restaurant.title)} alt={restaurant.title} />
        <aside className="side-panel stack-lg">
          <div className="eyebrow">Establishment Profile</div>
          <h1>{restaurant.title}</h1>
          <p className="muted" style={{ fontSize: 'var(--text-lg)' }}>{restaurant.time || "A fine dining destination offering curated culinary experiences."}</p>
          
          <div className="detail-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span className={`tag ${restaurant.isOpen ? "" : "warn"}`}>{restaurant.isOpen ? "Open for service" : "Currently closed"}</span>
            <span className="tag">{restaurant.delivery ? "Delivery available" : "Pickup only"}</span>
            <span className="tag" style={{ background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' }}>★ {Number(restaurant.rating || 4.3).toFixed(1)} Rating</span>
          </div>

          <div className="promo-row stack" style={{ gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
            <div className="between">
              <span className="muted">Average Wait Time</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>25-35 min</strong>
            </div>
            <div className="tag" style={{ textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)' }}>Trending in your metropolitan area</div>
          </div>
          
          <div className="card-actions" style={{ gridTemplateColumns: '1fr' }}>
            <a className="btn primary-btn" href="#menu">View Full Menu</a>
          </div>
        </aside>
      </section>
      <section id="menu" className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Catalogue</div>
            <h2>Available Menu</h2>
            <p className="muted">Refining {foods.length} exceptional dishes for your selection.</p>
          </div>
        </div>
        <div className="grid food-grid">
          {foods.length ? (
            foods.map((food) => <FoodCard key={food._id} food={food} />)
          ) : (
            <div className="empty">
              <h3>Menu currently unavailable</h3>
              <p>We are updating the menu for {restaurant.title}. Please check back momentarily.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Restaurant;
