import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isFavorite, toggleFavorite, addCartItem } from "../lib/store";
import { fallbackImage, currency } from "../lib/format";
import { showToast } from "../lib/utils";

export function FoodCard({ food }) {
  const [favorite, setFavorite] = useState(isFavorite(food._id));
  const eta = 18 + (food.title?.length || 0) % 15;
  const restaurantTitle = food.Resturants?.title || food.restaurantTitle || "Popular kitchen";

  useEffect(() => {
    const sync = () => setFavorite(isFavorite(food._id));
    window.addEventListener("plateful:storage", sync);
    return () => window.removeEventListener("plateful:storage", sync);
  }, [food._id]);

  const add = () => {
    addCartItem(food);
    showToast(`${food.title} added to cart`);
    window.dispatchEvent(new Event("plateful:storage"));
  };

  const toggle = (e) => {
    e.preventDefault();
    const next = toggleFavorite(food);
    showToast(next ? "Added to favorites" : "Removed from favorites");
    window.dispatchEvent(new Event("plateful:storage"));
  };

  return (
    <article className="card food-card-interactive">
      <div className="card-media">
        <img src={food.imageURL || fallbackImage(food.title)} alt={food.title} />
        <div className="card-overlay-actions">
          <button 
            className={`heart-btn ${favorite ? "is-favorite" : ""}`} 
            type="button" 
            onClick={toggle}
          >
            <svg viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div className="card-badge">{eta} min</div>
      </div>
      <div className="card-body">
        <div className="between" style={{ marginBottom: "var(--space-2xs)" }}>
          <span className="tag-outline">{food.category || "Menu"}</span>
          <span className="food-price-tag">{currency(food.price)}</span>
        </div>
        <h3 className="card-title-sm">{food.title}</h3>
        <p className="muted text-clamp-2">{food.description}</p>
        
        <div className="card-footer-meta">
          <div className="card-meta-row">
            <div className="restaurant-mini-ref">
              <div className="dot-indicator"></div>
              <span>{restaurantTitle}</span>
            </div>
            <span className="muted">{eta} min</span>
          </div>
        </div>

        <div className="card-actions-row">
          <Link className="btn-text-only" to={`/food/${food._id}`}>View Details</Link>
          <button className="btn primary-btn btn-sm-rounded" type="button" onClick={add}>
            Add <span style={{ marginLeft: "4px", opacity: 0.7 }}>+</span>
          </button>
        </div>
      </div>
    </article>
  );
}
