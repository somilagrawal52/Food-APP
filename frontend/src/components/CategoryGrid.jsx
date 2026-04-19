import React from "react";
import { Link } from "react-router-dom";
import { fallbackImage } from "../lib/format";

export function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid category-grid">
      {categories.map((category) => (
        <article className="card category-card" key={category._id}>
          <div className="card-media">
            <img src={category.imageURL || fallbackImage(category.title)} alt={category.title} />
          </div>
          <div className="card-body">
            <h3>{category.title}</h3>
            <p className="muted">Exquisite {category.title.toLowerCase()} selections.</p>
            <div className="card-actions" style={{ gridTemplateColumns: "1fr" }}>
              <Link className="btn primary-btn" to={`/menu?category=${encodeURIComponent(category.title)}`}>Explore</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
