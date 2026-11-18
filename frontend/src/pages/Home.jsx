import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getFavorites } from "../lib/store";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { RestaurantCard } from "../components/RestaurantCard";
import { FoodCard } from "../components/FoodCard";

function Home() {
  const [data, setData] = useState({ foods: [], categories: [], restaurants: [] });
  const [favorites, setFavorites] = useState(getFavorites());
  const [loading, setLoading] = useState(true);

  const openRestaurants = data.restaurants.filter((restaurant) => restaurant.isOpen);
  const featuredRestaurants = (openRestaurants.length ? openRestaurants : data.restaurants).slice(0, 6);
  const trendingFoods = data.foods.slice(0, 6);
  const curatedCategories = data.categories.slice(0, 8);

  useEffect(() => {
    Promise.all([
      api("/food/getallfoods"),
      api("/category/getallcategories"),
      api("/resturant/getallresturants")
    ])
      .then(([foods, categories, restaurants]) => {
        setData({
          foods: foods.foods || [],
          categories: categories.categories || [],
          restaurants: restaurants.resturants || []
        });
      })
      .catch((err) => console.error("Error loading home data:", err))
      .finally(() => setLoading(false));

    const sync = () => setFavorites(getFavorites());
    window.addEventListener("plateful:storage", sync);
    return () => window.removeEventListener("plateful:storage", sync);
  }, []);

  return (
    <>
      <Hero
        categories={data.categories.length}
        foods={data.foods.length}
        restaurants={data.restaurants.length}
        favorites={favorites.length}
      />

      <section className="section mini-stats">
        <article className="mini-stat">
          <span className="muted">Kitchens Open Now</span>
          <strong>{openRestaurants.length || data.restaurants.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Saved in Your Tasting List</span>
          <strong>{favorites.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Curated Dishes</span>
          <strong>{data.foods.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Avg. Delivery Speed</span>
          <strong style={{ color: "var(--color-success)" }}>22 min</strong>
        </article>
      </section>

      {/* Featured Kitchens */}
      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Curated Selection</div>
            <h2>Award-Winning Kitchens to Order From Now</h2>
            <p className="muted">A verified shortlist of culinary destinations with exceptional ratings and real-time fulfillment.</p>
          </div>
          <Link className="btn ghost-btn" to="/restaurants">Browse all kitchens</Link>
        </div>
        <div className="grid restaurant-grid">
          {featuredRestaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
        </div>
      </section>

      {/* Value Proposition / Why Plateful */}
      <section className="section why-plateful-section">
        <div className="section-head" style={{ textAlign: "center", justifyContent: "center" }}>
          <div className="stack" style={{ alignItems: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>The Plateful Standard</div>
            <h2>Why Connoisseurs Choose Plateful</h2>
            <p className="muted" style={{ maxWidth: "600px" }}>We don't deliver fast food. We deliver culinary dining experiences with precision temperature control and zero compromises.</p>
          </div>
        </div>

        <div className="grid value-props-grid">
          <div className="card value-prop-card">
            <div className="value-icon">👨‍🍳</div>
            <h3>Chef-Driven Menus</h3>
            <p className="muted">Exclusively partner with independent restaurants and artisanal kitchens with an average customer rating of 4.7+ stars.</p>
          </div>
          <div className="card value-prop-card">
            <div className="value-icon">🌡️</div>
            <h3>Thermal Precision Transit</h3>
            <p className="muted">Specialized insulated chambers ensure crisp crusts stay crunchy, hot soups arrive steaming, and gelato stays perfectly frozen.</p>
          </div>
          <div className="card value-prop-card">
            <div className="value-icon">📍</div>
            <h3>Transparent Fulfillment</h3>
            <p className="muted">Second-by-second visibility from pan to plate. Track order preparation, courier dispatch, and live arrival times.</p>
          </div>
        </div>
      </section>

      {/* Trending Dishes */}
      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Signature Dishes</div>
            <h2>Most Requested Creations This Week</h2>
            <p className="muted">Artisanal specialties prepared to order using premium seasonal ingredients.</p>
          </div>
          <Link className="btn ghost-btn" to="/menu">Explore full menu</Link>
        </div>
        <div className="grid food-grid">
          {trendingFoods.map((food) => <FoodCard key={food._id} food={food} />)}
        </div>
      </section>

      {/* Cuisines Categories */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">Explore Cuisines</div>
            <h2>Browse by Your Cravings</h2>
            <p className="muted">Select from handmade pasta, certified bluefin sushi, smash burgers, and French patisserie.</p>
          </div>
        </div>
        <CategoryGrid categories={curatedCategories} />
      </section>

      {/* VIP Launch Promo Banner */}
      <section className="section">
        <div className="vip-promo-banner">
          <div className="vip-promo-content">
            <span className="eyebrow" style={{ color: "#ffffff", opacity: 0.9 }}>Limited Launch Promotion</span>
            <h2>Get Rs 50 Off Your Next Dining Experience</h2>
            <p>Enter promo code <span className="promo-code-pill">LAUNCH50</span> at checkout to unlock savings. Free delivery included for orders above Rs 500.</p>
            <div className="vip-promo-actions">
              <Link className="btn primary-btn btn-lg" to="/menu">Claim Your Discount</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Customer Testimonials */}
      <section className="section testimonials-section">
        <div className="section-head" style={{ textAlign: "center", justifyContent: "center" }}>
          <div className="stack" style={{ alignItems: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Verified Reviews</div>
            <h2>What Food Lovers Are Saying</h2>
            <p className="muted">Over 15,000 satisfied food enthusiasts order through Plateful every week.</p>
          </div>
        </div>

        <div className="grid testimonials-grid">
          <article className="card testimonial-card">
            <div className="rating-stars">★★★★★</div>
            <p className="testimonial-quote">"The Truffle Tagliolini from Bella Napoli arrived piping hot, exactly as if I were seated in their dining room. Hands down the highest quality delivery in the city."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Elena Rostova" className="author-avatar" />
              <div>
                <strong>Elena Rostova</strong>
                <small className="muted">Verified Gourmet • Manhattan</small>
              </div>
            </div>
          </article>

          <article className="card testimonial-card">
            <div className="rating-stars">★★★★★</div>
            <p className="testimonial-quote">"The live status updates are incredibly accurate. When it said 22 minutes, the courier was ringing my bell on the 21st minute. The packaging is pure luxury."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Marcus Sterling" className="author-avatar" />
              <div>
                <strong>Marcus Sterling</strong>
                <small className="muted">Verified Foodie • Downtown</small>
              </div>
            </div>
          </article>

          <article className="card testimonial-card">
            <div className="rating-stars">★★★★★</div>
            <p className="testimonial-quote">"As a vendor, managing our kitchen orders through Plateful's dashboard has been seamless. The customer base genuinely cares about authentic culinary craftsmanship."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=100&q=80" alt="Chef Marco" className="author-avatar" />
              <div>
                <strong>Chef Marco Rossi</strong>
                <small className="muted">Owner, Trattoria Bella Napoli</small>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Saved for Later */}
      {favorites.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Favorites</div>
              <h2>Saved in Your Tasting List</h2>
              <p className="muted">Quickly reorder the signature dishes you love.</p>
            </div>
            <Link className="btn ghost-btn" to="/menu?saved=1">View all saved ({favorites.length})</Link>
          </div>
          <div className="grid food-grid">
            {favorites.slice(0, 3).map((food) => <FoodCard key={food._id} food={food} />)}
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
