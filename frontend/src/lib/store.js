export function getCart() {
  return JSON.parse(localStorage.getItem("plateful_cart") || "[]");
}

export function setCart(cart) {
  localStorage.setItem("plateful_cart", JSON.stringify(cart));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("plateful_favorites") || "[]");
}

export function toggleFavorite(food) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item._id === food._id);
  const next = exists
    ? favorites.filter((item) => item._id !== food._id)
    : [
        {
          _id: food._id,
          title: food.title,
          price: Number(food.price),
          imageURL: food.imageURL || "",
          category: food.category || "",
          restaurantTitle: food.Resturants?.title || food.restaurantTitle || ""
        },
        ...favorites
      ].slice(0, 12);
  localStorage.setItem("plateful_favorites", JSON.stringify(next));
  return !exists;
}

export function isFavorite(foodId) {
  return getFavorites().some((item) => item._id === foodId);
}

export function getRecentFoods() {
  return JSON.parse(localStorage.getItem("plateful_recent_foods") || "[]");
}

export function saveRecentFood(food) {
  if (!food?._id) return;
  const recent = getRecentFoods().filter((item) => item._id !== food._id);
  recent.unshift({
    _id: food._id,
    title: food.title,
    price: Number(food.price),
    imageURL: food.imageURL || "",
    description: food.description || "",
    category: food.category || "",
    restaurantTitle: food.Resturants?.title || food.restaurantTitle || ""
  });
  localStorage.setItem("plateful_recent_foods", JSON.stringify(recent.slice(0, 8)));
}

export function addCartItem(food) {
  const cart = getCart();
  const existing = cart.find((item) => item._id === food._id);
  if (existing) existing.quantity += 1;
  else {
    cart.push({
      _id: food._id,
      title: food.title,
      price: Number(food.price),
      quantity: 1,
      imageURL: food.imageURL || ""
    });
  }
  setCart(cart);
}

export function updateCartItem(foodId, delta) {
  const cart = getCart()
    .map((item) => item._id === foodId ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0);
  setCart(cart);
}

export function removeCartItem(foodId) {
  setCart(getCart().filter((item) => item._id !== foodId));
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
