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
  const openRestaurants = data.restaurants.filter((restaurant) => restaurant.isOpen);
  const featuredRestaurants = (openRestaurants.length ? openRestaurants : data.restaurants).slice(0, 6);
  const trendingFoods = data.foods.slice(0, 6);
  const curatedCategories = data.categories.slice(0, 6);

  useEffect(() => {
    Promise.all([
      api("/food/getallfoods"),
      api("/category/getallcategories"),
      api("/resturant/getallresturants")
    ]).then(([foods, categories, restaurants]) => {
      setData({
        foods: foods.foods || [],
        categories: categories.categories || [],
        restaurants: restaurants.resturants || []
      });
    });

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
          <span className="muted">Open now</span>
          <strong>{openRestaurants.length || data.restaurants.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Saved dishes</span>
          <strong>{favorites.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Menu variety</span>
          <strong>{data.foods.length}</strong>
        </article>
      </section>
      
      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Discover</div>
            <h2>Restaurants to order from now</h2>
            <p className="muted">A shorter, clearer shortlist of places with strong menus and better delivery expectations.</p>
          </div>
          <Link className="btn ghost-btn" to="/restaurants">Browse all</Link>
        </div>
        <div className="grid restaurant-grid">
          {featuredRestaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
        </div>
      </section>

      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Trending</div>
            <h2>Popular dishes this week</h2>
            <p className="muted">Quick picks for lunch, dinner, and everything in between.</p>
          </div>
          <Link className="btn ghost-btn" to="/menu">Full menu</Link>
        </div>
        <div className="grid food-grid">
          {trendingFoods.map((food) => <FoodCard key={food._id} food={food} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Browse by craving</h2><p className="muted">Pick the category that matches the meal you want right now.</p></div></div>
        <CategoryGrid categories={curatedCategories} />
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Saved for later</h2><p className="muted">Quick access to dishes you want to order again.</p></div></div>
        <div className="grid food-grid">
          {favorites.length ? favorites.slice(0, 3).map((food) => <FoodCard key={food._id} food={food} />) : <div className="empty">Tap the heart on any dish to save it here.</div>}
        </div>
      </section>
    </>
  );
}

export default Home;
