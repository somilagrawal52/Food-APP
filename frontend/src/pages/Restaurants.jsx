import React, { useEffect, useState, useMemo } from "react";
import { api } from "../lib/api";
import { RestaurantCard } from "../components/RestaurantCard";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'open' | 'delivery' | 'pickup'
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'rating' | 'name'

  useEffect(() => {
    api("/resturant/getallresturants")
      .then((data) => setRestaurants(data.resturants || []))
      .catch((err) => console.error("Error loading restaurants:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter((r) => {
      const matchSearch =
        !searchTerm ||
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.coords?.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchFilter =
        filterMode === "all" ||
        (filterMode === "open" && r.isOpen) ||
        (filterMode === "delivery" && r.delivery) ||
        (filterMode === "pickup" && r.pickup);

      return matchSearch && matchFilter;
    });

    return result.sort((a, b) => {
      if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
      // recommended: open first, then higher rating
      if (a.isOpen !== b.isOpen) return a.isOpen ? -1 : 1;
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    });
  }, [restaurants, searchTerm, filterMode, sortBy]);

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">Restaurants</div>
        <h1>Choose a restaurant with confidence</h1>
        <p className="muted">
          Compare local spots by availability, ratings, and delivery options before ordering.
        </p>

        {/* Toolbar */}
        <div className="searchbar stack-lg menu-toolbar" style={{ marginTop: "var(--space-md)" }}>
          <div className="search-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants by name or location..."
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Highest Rating</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <div className="filter-chip-wrap" style={{ gap: "8px" }}>
            <button
              className={`btn ${filterMode === "all" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setFilterMode("all")}
            >
              All ({restaurants.length})
            </button>
            <button
              className={`btn ${filterMode === "open" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setFilterMode("open")}
            >
              Open Now
            </button>
            <button
              className={`btn ${filterMode === "delivery" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setFilterMode("delivery")}
            >
              Free Delivery
            </button>
            <button
              className={`btn ${filterMode === "pickup" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setFilterMode("pickup")}
            >
              Pickup Available
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        {loading ? (
          <div className="empty">Loading restaurants...</div>
        ) : filteredRestaurants.length ? (
          <div className="grid restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No restaurants found</h3>
            <p>
              {searchTerm || filterMode !== "all"
                ? "No establishments match your search criteria. Try adjusting your filters."
                : "The restaurant list is currently empty."}
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default Restaurants;
