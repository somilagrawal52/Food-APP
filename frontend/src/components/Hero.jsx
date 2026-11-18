import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Hero({ categories = 0, foods = 0, restaurants = 0, favorites = 0 }) {
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/menu");
    }
  };

  return (
    <section className="hero-refined">
      <div className="hero-content">
        <div className="eyebrow-accent">
          <span className="live-dot-pulse"></span>
          <span>Now Delivering Across Metropolitan Kitchens</span>
        </div>
        <h1>
          Order food that fits the moment,
          {" "}
          <span className="text-gradient">not just the menu</span>
        </h1>
        <p className="hero-description">
          Experience chef-curated dining delivered with thermal precision. Compare live kitchen wait times, save repeat favorites, and enjoy seamless checkout built for discerning food lovers.
        </p>

        {/* Hero Quick Search Box */}
        <form className="hero-search-container" onSubmit={handleSearchSubmit}>
          <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            placeholder="Search pizza, ramen, truffle pasta, burgers..."
            className="hero-search-input"
          />
          <button type="submit" className="btn primary-btn hero-search-btn">
            Explore Menu
          </button>
        </form>

        <div className="hero-trust-strip">
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <span>25-Min Delivery</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">★</span>
            <span>4.9 Chef Quality</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🌱</span>
            <span>Eco-Insulated Packaging</span>
          </div>
        </div>

        <div className="hero-stats-strip">
          <div className="stat-pill">
            <span className="stat-val">{restaurants || 7}</span>
            <span className="stat-lbl">Artisan Kitchens</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{foods || 22}</span>
            <span className="stat-lbl">Signature Dishes</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{categories || 8}</span>
            <span className="stat-lbl">Cuisines</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
            alt="Artisanal prepared gourmet food feast"
            className="hero-main-img"
          />
          <div className="hero-glow-underlay"></div>

          {/* Floating Live Indicator 1 */}
          <div className="floating-hero-pill float-top-right">
            <span className="floating-badge-icon">🔥</span>
            <div>
              <strong>Truffle Umami Burger</strong>
              <small>#1 Best Seller • 4.9 ★</small>
            </div>
          </div>

          {/* Floating Live Indicator 2 */}
          <div className="floating-hero-pill float-bottom-left">
            <span className="floating-badge-icon pulse-badge">⏱️</span>
            <div>
              <strong>Live Dispatch Active</strong>
              <small>Avg. fulfillment: 22 mins</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
