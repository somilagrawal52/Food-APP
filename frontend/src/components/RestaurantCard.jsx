import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../lib/format";

export function RestaurantCard({ restaurant }) {
  const eta = 20 + (restaurant.title?.length || 0) % 15;
  const rating = Number(restaurant.rating || 4.7).toFixed(1);
  const location = restaurant.coords?.address || "Downtown Metropolitan";
  const reviews = restaurant.ratingCount || "300+ reviews";

  return (
    <article className="card restaurant-card-refined">
      <div className="card-media">
        <img
          src={restaurant.imageURL || restaurant.logoURL || fallbackImage(restaurant.title)}
          alt={restaurant.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage(restaurant.title);
          }}
        />
        <div className={`restaurant-status-tag ${restaurant.isOpen ? "tag-open" : "tag-closed"}`}>
          {restaurant.isOpen ? "• Open for Delivery" : "• Closed"}
        </div>
      </div>
      <div className="card-body">
        <div className="between" style={{ marginBottom: "var(--space-2xs)", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: "var(--text-xl)" }}>{restaurant.title}</h3>
            <span className="text-xs muted" style={{ display: "block", marginTop: "2px" }}>📍 {location}</span>
          </div>
          <div className="rating-badge" title={`${rating} stars (${reviews})`}>
            <span style={{ fontSize: "14px", color: "var(--color-accent-amber, #fbbf24)" }}>★</span>
            <span>{rating}</span>
          </div>
        </div>

        <div className="stack restaurant-card-copy" style={{ gap: "6px", marginBottom: "var(--space-md)" }}>
          <p className="muted text-sm text-clamp-2">
            Chef-driven establishment offering verified artisanal dining and precision thermal delivery.
          </p>
          <div className="restaurant-detail-row">
            <span className="pill-badge-outline">{restaurant.delivery ? "Free Delivery" : "Pickup Only"}</span>
            <span className="muted text-xs">⏱️ {eta}-{eta + 10} min</span>
            <span className="muted text-xs">({reviews})</span>
          </div>
        </div>

        <div className="card-actions" style={{ gridTemplateColumns: "1fr" }}>
          <Link className="btn primary-btn" to={`/restaurant/${restaurant._id}`}>
            Explore Menu & Dishes
          </Link>
        </div>
      </div>
    </article>
  );
}
