import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../lib/format";

export function RestaurantCard({ restaurant }) {
  const eta = 20 + (restaurant.title?.length || 0) % 18;
  const rating = Number(restaurant.rating || 4.3).toFixed(1);

  return (
    <article className="card restaurant-card-refined">
      <div className="card-media">
        <img src={restaurant.imageURL || restaurant.logoURL || fallbackImage(restaurant.title)} alt={restaurant.title} />
        <div className="restaurant-status-tag">
          {restaurant.isOpen ? "Open now" : "Closed"}
        </div>
      </div>
      <div className="card-body">
        <div className="between" style={{ marginBottom: "var(--space-xs)" }}>
          <h3 style={{ fontSize: "var(--text-xl)" }}>{restaurant.title}</h3>
          <div className="rating-badge">
            <span style={{ fontSize: "14px" }}>*</span>
            <span>{rating}</span>
          </div>
        </div>

        <div className="stack restaurant-card-copy" style={{ gap: "4px", marginBottom: "var(--space-md)" }}>
          <p className="muted">Reliable local restaurant with a straightforward menu and predictable checkout flow.</p>
          <div className="restaurant-detail-row">
            <span>{restaurant.delivery ? "Free delivery" : "Pickup only"}</span>
            <span>{eta}-{eta + 10} min</span>
          </div>
        </div>

        <div className="card-actions" style={{ gridTemplateColumns: "1fr" }}>
          <Link className="btn primary-btn" to={`/restaurant/${restaurant._id}`}>
            View Restaurant
          </Link>
        </div>
      </div>
    </article>
  );
}
