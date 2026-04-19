import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getFavorites, getRecentFoods } from "../lib/store";
import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { RestaurantCard } from "../components/RestaurantCard";
import { FoodCard } from "../components/FoodCard";

function Home() {
  const [data, setData] = useState({ foods: [], categories: [], restaurants: [] });
  const [favorites, setFavorites] = useState(getFavorites());
  const [recentFoods, setRecentFoods] = useState(getRecentFoods());

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

    const sync = () => {
      setFavorites(getFavorites());
      setRecentFoods(getRecentFoods());
    };
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
          <span className="muted">Featured kitchens</span>
          <strong>{data.restaurants.filter((restaurant) => restaurant.isOpen).length || data.restaurants.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Favorite dishes</span>
          <strong>{favorites.length}</strong>
        </article>
        <article className="mini-stat">
          <span className="muted">Recently viewed</span>
          <strong>{recentFoods.length}</strong>
        </article>
      </section>
      <section className="section">
        <div className="section-head"><div><h2>Categories</h2><p className="muted">Jump into the menu by craving.</p></div></div>
        <CategoryGrid categories={data.categories.slice(0, 6)} />
      </section>
      
      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Discover</div>
            <h2>Kitchens of Distinction</h2>
            <p className="muted">Explore top-rated restaurants with hand-picked menus.</p>
          </div>
          <Link className="btn ghost-btn" to="/restaurants">See all kitchens</Link>
        </div>
        <div className="grid restaurant-grid">
          {data.restaurants.slice(0, 6).map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
        </div>
      </section>

      <section className="section stack-xl">
        <div className="section-head">
          <div className="stack">
            <div className="eyebrow">Signature Dishes</div>
            <h2>Popular with locals</h2>
            <p className="muted">The most requested culinary creations in your area.</p>
          </div>
          <Link className="btn ghost-btn" to="/menu">Full menu</Link>
        </div>
        <div className="grid food-grid">
          {data.foods.slice(0, 6).map((food) => <FoodCard key={food._id} food={food} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><div><h2>Saved for later</h2><p className="muted">A lightweight favorite system makes repeat ordering easier.</p></div></div>
        <div className="grid food-grid">
          {favorites.length ? favorites.slice(0, 3).map((food) => <FoodCard key={food._id} food={food} />) : <div className="empty">Tap the heart on any dish to save it here.</div>}
        </div>
      </section>
    </>
  );
}

export default Home;
