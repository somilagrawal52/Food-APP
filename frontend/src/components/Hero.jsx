import React from "react";
import { Link } from "react-router-dom";

export function Hero({ categories = 0, foods = 0, restaurants = 0, favorites = 0 }) {
  return (
    <section className="hero-refined">
      <div className="hero-content">
        <div className="eyebrow-accent">Fast local delivery</div>
        <h1>
          Order food that fits the moment,
          {" "}
          <span className="text-gradient">not just the menu</span>
        </h1>
        <p className="hero-description">Browse nearby restaurants, compare delivery times, save repeat orders, and check out with a cleaner flow built for everyday ordering.</p>

        <div className="hero-cta-group">
          <Link className="btn primary-btn btn-lg" to="/menu">
            Order Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link className="btn ghost-btn btn-lg" to="/restaurants">See Restaurants</Link>
        </div>

        <div className="hero-stats-strip">
          <div className="stat-pill">
            <span className="stat-val">{restaurants}</span>
            <span className="stat-lbl">Restaurants</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{foods}</span>
            <span className="stat-lbl">Dishes</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{categories}</span>
            <span className="stat-lbl">Categories</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
            alt="Prepared food on a table"
            className="hero-main-img"
          />
        </div>
      </div>
    </section>
  );
}
