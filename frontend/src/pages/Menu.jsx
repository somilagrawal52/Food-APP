import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { FoodCard } from "../components/FoodCard";
import { getFavorites } from "../lib/store";

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState(getFavorites());

  useEffect(() => {
    api("/category/getallcategories").then((data) => setCategories(data.categories || []));
    api("/food/getallfoods").then((data) => setFoods(data.foods || []));

    const sync = () => setFavorites(getFavorites());
    window.addEventListener("plateful:storage", sync);
    return () => window.removeEventListener("plateful:storage", sync);
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((food) => food._id)), [favorites]);

  const filteredFoods = useMemo(() => {
    const result = foods.filter((food) => {
      const categoryMatch = !selectedCategory || food.category === selectedCategory;
      const searchMatch = !search || [food.title, food.description, food.foodtags, food.category].filter(Boolean).some((value) => value.toLowerCase().includes(search.toLowerCase()));
      const favoriteMatch = !showSavedOnly || favoriteIds.has(food._id);
      return categoryMatch && searchMatch && favoriteMatch;
    });

    return result.sort((left, right) => {
      if (sortBy === "price-low") return Number(left.price) - Number(right.price);
      if (sortBy === "price-high") return Number(right.price) - Number(left.price);
      if (sortBy === "title") return left.title.localeCompare(right.title);
      return (right.foodtags?.length || 0) - (left.foodtags?.length || 0);
    });
  }, [favoriteIds, foods, search, selectedCategory, showSavedOnly, sortBy]);

  return (
    <section className="section stack-lg">
      <div className="eyebrow">Discovery</div>
      <h1>Explore Full Menu</h1>
      <p className="muted">Search across {categories.length} culinary lanes and refine your selection with precision filters.</p>
      
      <div className="searchbar stack-lg">
        <div className="search-row">
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search for dishes, ingredients, or flavors..." 
          />
          <select className="btn ghost-btn" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recommended">Sort: Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Alphabetical</option>
          </select>
          <button 
            className={`btn ${showSavedOnly ? "primary-btn" : "ghost-btn"}`} 
            onClick={() => setShowSavedOnly((value) => !value)}
          >
            Saved only
          </button>
        </div>
        <div className="chip-row stack" style={{ gap: "12px" }}>
          <div className="muted font-medium">Cuisine lanes:</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className={`btn ${!selectedCategory ? "primary-btn" : "ghost-btn"}`} onClick={() => setSelectedCategory("")}>All Lanes</button>
            {categories.map((category) => (
              <button 
                key={category._id} 
                className={`btn ${selectedCategory === category.title ? "primary-btn" : "ghost-btn"}`} 
                onClick={() => setSelectedCategory(category.title)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        <div className="promo-row" style={{ display: "flex", gap: "12px" }}>
          <span className="tag">{filteredFoods.length} Creations Found</span>
          <span className="tag">{favorites.length} Saved in Vault</span>
        </div>
      </div>

      <div className="grid food-grid" style={{ marginTop: "var(--space-xl)" }}>
        {filteredFoods.length ? (
          filteredFoods.map((food) => <FoodCard key={food._id} food={food} />)
        ) : (
          <div className="empty">
            <h3>No culinary matches</h3>
            <p>Try adjusting your search terms or exploring other cuisine lanes.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Menu;
