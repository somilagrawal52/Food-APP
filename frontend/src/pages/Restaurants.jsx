import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { RestaurantCard } from "../components/RestaurantCard";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    api("/resturant/getallresturants").then((data) => setRestaurants(data.resturants || []));
  }, []);

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">Restaurants</div>
        <h1>Choose a restaurant with confidence</h1>
        <p className="muted">Compare {restaurants.length} local spots by availability, delivery model, and speed before you commit to a cart.</p>
      </section>
      <section className="section">
        <div className="grid restaurant-grid">
          {restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
        </div>
        {!restaurants.length && (
          <div className="empty">
            <h3>No restaurants available</h3>
            <p>The list is empty right now. Add restaurant data in the backend and they will appear here.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default Restaurants;
