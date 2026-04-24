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
  const [showSavedOnly, setShowSavedOnly] = useState(searchParams.get("saved") === "1");
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

  useEffect(() => {
    const next = {};
    if (search) next.search = search;
    if (selectedCategory) next.category = selectedCategory;
    if (showSavedOnly) next.saved = "1";
    setSearchParams(next, { replace: true });
  }, [search, selectedCategory, setSearchParams, showSavedOnly]);

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
      <div className="eyebrow">Menu</div>
      <h1>Find the right dish faster</h1>
      <p className="muted">Search across {categories.length} categories and filter by what you want to eat.</p>
      
      <div className="searchbar stack-lg menu-toolbar">
        <div className="search-row">
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search dishes, ingredients, or restaurant names..." 
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
        <div className="chip-row stack menu-filter-row" style={{ gap: "12px" }}>
          <div className="muted">Browse by category</div>
          <div className="filter-chip-wrap">
            <button className={`btn ${!selectedCategory ? "primary-btn" : "ghost-btn"}`} onClick={() => setSelectedCategory("")}>All</button>
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
      </div>

      <div className="grid food-grid" style={{ marginTop: "var(--space-xl)" }}>
        {filteredFoods.length ? (
          filteredFoods.map((food) => <FoodCard key={food._id} food={food} />)
        ) : (
          <div className="empty">
            <h3>No dishes found</h3>
            <p>Try another search or clear the current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Menu;
