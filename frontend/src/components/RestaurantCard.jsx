import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../lib/format";

export function RestaurantCard({ restaurant }) {
  const eta = 20 + (restaurant.title?.length || 0) % 18;

  return (
    <article className="card restaurant-card-refined">
      <div className="card-media">
        <img src={restaurant.imageURL || restaurant.logoURL || fallbackImage(restaurant.title)} alt={restaurant.title} />
        <div className="restaurant-status-tag">
          {restaurant.isOpen ? "● Open Now" : "○ Closed"}
        </div>
      </div>
      <div className="card-body">
        <div className="between" style={{ marginBottom: "var(--space-xs)" }}>
          <h3 style={{ fontSize: "var(--text-xl)" }}>{restaurant.title}</h3>
          <div className="rating-badge">
            <span style={{ fontSize: "14px" }}>★</span>
            <span>{Number(restaurant.rating || 4.3).toFixed(1)}</span>
          </div>
        </div>
        
        <div className="stack" style={{ gap: "4px", marginBottom: "var(--space-md)" }}>
          <div className="muted" style={{ fontSize: "var(--text-sm)", display: "flex", gap: "8px" }}>
            <span>{restaurant.delivery ? "Free Delivery" : "Pickup Only"}</span>
            <span>•</span>
            <span>{eta}-{eta + 10} min</span>
          </div>
        </div>

        <div className="card-actions" style={{ gridTemplateColumns: "1fr" }}>
          <Link className="btn primary-btn" to={`/restaurant/${restaurant._id}`}>
            View Kitchen
          </Link>
        </div>
      </div>
    </article>
  );
}
