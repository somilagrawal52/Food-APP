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
        <div className="eyebrow">Explore</div>
        <h1>Kitchens of Distinction</h1>
        <p className="muted">Experience fine dining from the comfort of your home. Discover {restaurants.length} signature kitchens available today.</p>
      </section>
      <section className="section">
        <div className="grid restaurant-grid">
          {restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant} />)}
        </div>
        {!restaurants.length && (
          <div className="empty">
            <h3>No kitchens available</h3>
            <p>We are expanding our network. Check back soon for new gourmet options.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default Restaurants;
