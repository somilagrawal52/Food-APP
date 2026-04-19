export function currency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

export function fallbackImage(seed) {
  const s = String(seed || "").toLowerCase();
  
  // Specific fallbacks for common categories
  if (s.includes("coffee") || s.includes("cafe") || s.includes("tea") || s.includes("beverage")) {
    return `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("pizza")) {
    return `https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("burger")) {
    return `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("sushi") || s.includes("japanese")) {
    return `https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("dessert") || s.includes("cake") || s.includes("sweet")) {
    return `https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("pasta") || s.includes("italian")) {
    return `https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }
  if (s.includes("salad") || s.includes("healthy") || s.includes("vegan")) {
    return `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s)}`;
  }

  // Generic food fallback
  return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80&sig=${encodeURIComponent(s || "food")}`;
}

export function query(name) {
  return new URLSearchParams(window.location.search).get(name);
}
