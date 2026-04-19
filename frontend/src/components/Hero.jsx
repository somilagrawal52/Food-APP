import React from "react";
import { Link } from "react-router-dom";

export function Hero({ categories = 0, foods = 0, restaurants = 0, favorites = 0 }) {
  return (
    <section className="hero-refined">
      <div className="hero-content">
        <div className="eyebrow-accent">
          <span className="dot"></span>
          Now delivering excellence
        </div>
        <h1>Elevate Your <br /> <span className="text-gradient">Dining Experience</span></h1>
        <p className="hero-description">Discover the finest kitchens and most delicious dishes in your neighborhood, curated for the discerning palate.</p>
        
        <div className="hero-cta-group">
          <Link className="btn primary-btn btn-lg" to="/menu">
            Explore Menu
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link className="btn ghost-btn btn-lg" to="/restaurants">Find Kitchens</Link>
        </div>

        <div className="hero-stats-strip">
          <div className="stat-pill">
            <span className="stat-val">{restaurants}</span>
            <span className="stat-lbl">Kitchens</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{foods}</span>
            <span className="stat-lbl">Dishes</span>
          </div>
          <div className="stat-pill">
            <span className="stat-val">{categories}</span>
            <span className="stat-lbl">Styles</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" 
            alt="Exquisite Dining" 
            className="hero-main-img"
          />
          <div className="floating-card top-right">
            <div className="icon-wrap">★</div>
            <div>
              <strong>Top Rated</strong>
              <small>4.9 Avg. Rating</small>
            </div>
          </div>
          <div className="floating-card bottom-left">
            <div className="icon-wrap fast">⚡</div>
            <div>
              <strong>Fast Delivery</strong>
              <small>Under 25 mins</small>
            </div>
          </div>
          <div className="hero-glow"></div>
        </div>
      </div>
    </section>
  );
}
