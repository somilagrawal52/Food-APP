import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { showToast } from "../lib/utils";

const Icons = {
  Restaurant: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6.5 4 4 0 0 1 13 6.5 4 4 0 0 1 14.41 13.87"/><path d="M9 22V12"/><path d="M15 22V12"/><path d="M8 12h8"/><rect width="20" height="5" x="2" y="17" rx="2"/></svg>
  ),
  Category: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
  ),
  Food: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x2="10" y1="1" y2="4"/><line x2="14" y1="1" y2="4"/></svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  )
};

function AdminPanel() {
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";
  const [activeTab, setActiveTab] = useState("restaurants");
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const loadAdminData = async () => {
    try {
      const [foodData, categoryData, restaurantData] = await Promise.all([
        api("/food/getallfoods"),
        api("/category/getallcategories"),
        api("/resturant/getallresturants"),
      ]);
      setFoods(foodData.foods || []);
      setCategories(categoryData.categories || []);
      setRestaurants(restaurantData.resturants || []);
    } catch (error) {
      showToast("Error loading data: " + error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const filteredItems = useMemo(() => {
    const list = activeTab === "restaurants" ? restaurants : 
                 activeTab === "categories" ? categories : foods;
    if (!searchTerm) return list;
    return list.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, restaurants, categories, foods, searchTerm]);

  if (!auth?.token) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const createCategory = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (editingCategory?._id) {
        await api(`/category/category/${editingCategory._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Category updated successfully");
        setEditingCategory(null);
      } else {
        await api("/category/createcategory", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Category created successfully");
      }
      event.currentTarget.reset();
      loadAdminData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const createRestaurant = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      delivery: form.delivery === "true",
      pickup: form.pickup === "true",
      isOpen: form.isOpen === "true",
      rating: editingRestaurant?.rating || 0,
      coords: { address: form.address, lat: 0, lng: 0, title: form.title },
    };
    delete payload.address;
    try {
      if (editingRestaurant?._id) {
        await api(`/resturant/resturant/${editingRestaurant._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Restaurant updated successfully");
        setEditingRestaurant(null);
      } else {
        await api("/resturant/createresturant", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Restaurant created successfully");
      }
      event.currentTarget.reset();
      loadAdminData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const createFood = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      price: Number(form.price),
      Resturants: form.Resturants,
      category: categories.find((c) => c._id === form.categoryId)?.title || "",
      foodtags: "",
    };
    delete payload.categoryId;
    try {
      if (editingFood?._id) {
        await api(`/food/updatefood/${editingFood._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Food updated successfully");
        setEditingFood(null);
      } else {
        await api("/food/createfood", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Food created successfully");
      }
      event.currentTarget.reset();
      loadAdminData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteItem = async (path, message) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    try {
      await api(path, { method: "DELETE" });
      showToast(message);
      loadAdminData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const editCategory = async (id) => {
    const data = await api(`/category/category/${id}`);
    setEditingCategory(data.Category || null);
    setActiveTab("categories");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editFood = async (id) => {
    const data = await api(`/food/food/${id}`);
    setEditingFood(data.food || null);
    setActiveTab("foods");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editRestaurant = async (id) => {
    const data = await api(`/resturant/resturant/${id}`);
    setEditingRestaurant(data.resturant || null);
    setActiveTab("restaurants");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="shell" style={{ paddingBottom: "var(--space-3xl)" }}>
      <section className="section stack-lg" style={{ marginTop: "var(--space-xl)" }}>
        <div className="eyebrow">Administration</div>
        <div className="between">
          <div>
            <h1>Control Panel</h1>
            <p className="muted">Manage your ecosystem entities and operations.</p>
          </div>
          <button 
            className="btn primary-btn" 
            onClick={() => {
              setEditingCategory(null);
              setEditingFood(null);
              setEditingRestaurant(null);
              showToast("Form cleared for new entry");
            }}
          >
            <Icons.Plus /> New Entry
          </button>
        </div>
      </section>

      <section className="admin-summary-grid" style={{ marginTop: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
        <article className="admin-summary-card">
          <div className="between">
            <span className="muted">Restaurants</span>
            <div style={{ color: "var(--color-accent)" }}><Icons.Restaurant /></div>
          </div>
          <strong>{restaurants.length}</strong>
        </article>
        <article className="admin-summary-card">
          <div className="between">
            <span className="muted">Categories</span>
            <div style={{ color: "var(--color-accent)" }}><Icons.Category /></div>
          </div>
          <strong>{categories.length}</strong>
        </article>
        <article className="admin-summary-card">
          <div className="between">
            <span className="muted">Dishes</span>
            <div style={{ color: "var(--color-accent)" }}><Icons.Food /></div>
          </div>
          <strong>{foods.length}</strong>
        </article>
      </section>

      <div className="tab-nav" style={{ 
        display: "flex", 
        gap: "32px", 
        borderBottom: "1px solid var(--color-border)", 
        marginBottom: "var(--space-xl)",
        position: "sticky",
        top: "80px",
        background: "var(--color-bg-base)",
        zIndex: 10,
        padding: "10px 0"
      }}>
        {["restaurants", "categories", "foods"].map(tab => (
          <button
            key={tab}
            className={`btn-text-only ${activeTab === tab ? "active-tab" : ""}`}
            style={{ 
              textTransform: "capitalize",
              paddingBottom: "12px",
              borderBottom: activeTab === tab ? "2px solid var(--color-accent)" : "2px solid transparent",
              color: activeTab === tab ? "var(--color-accent)" : "var(--color-text-muted)",
              fontWeight: 700,
              fontSize: "15px"
            }}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm("");
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-grid">
        {/* Left Column: Form */}
        <aside className="stack-lg">
          {activeTab === "restaurants" && (
            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow"><Icons.Restaurant /> Restaurant Management</div>
                  <h2>{editingRestaurant ? "Update Details" : "Add Restaurant"}</h2>
                </div>
                <form key={editingRestaurant?._id || "new-res"} className="stack-form" onSubmit={createRestaurant}>
                  {!editingRestaurant && (
                    <div className="admin-form-block stack">
                      <div className="eyebrow" style={{ fontSize: "10px" }}>Owner Credentials</div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input name="ownerEmail" type="email" placeholder="owner@kitchen.com" required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input name="ownerName" placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Contact</label>
                          <input name="ownerPhone" placeholder="+91..." required />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="admin-form-block stack">
                    <div className="eyebrow" style={{ fontSize: "10px" }}>Store Information</div>
                    <div className="form-group">
                      <label className="form-label">Restaurant Title</label>
                      <input name="title" defaultValue={editingRestaurant?.title || ""} placeholder="The Pizza Hub" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input name="address" defaultValue={editingRestaurant?.coords?.address || ""} placeholder="Downtown 5th Ave" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select name="isOpen" defaultValue={String(editingRestaurant?.isOpen ?? true)}>
                          <option value="true">Active / Open</option>
                          <option value="false">Inactive / Closed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cover Image URL</label>
                        <input name="imageURL" defaultValue={editingRestaurant?.imageURL || ""} placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                  
                  <div className="stack" style={{ gap: "10px" }}>
                    <button className="btn primary-btn" type="submit">
                      {editingRestaurant ? "Save Changes" : "Confirm & Create"}
                    </button>
                    {editingRestaurant && (
                      <button className="btn ghost-btn" type="button" onClick={() => setEditingRestaurant(null)}>
                        Cancel Editing
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </article>
          )}

          {activeTab === "categories" && (
            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow"><Icons.Category /> Taxonomy</div>
                  <h2>{editingCategory ? "Edit Category" : "New Category"}</h2>
                </div>
                <form key={editingCategory?._id || "new-cat"} className="stack-form" onSubmit={createCategory}>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input name="title" defaultValue={editingCategory?.title || ""} placeholder="Desserts" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Visual Asset URL</label>
                    <input name="imageURL" defaultValue={editingCategory?.imageURL || ""} placeholder="https://..." required />
                  </div>
                  <div className="stack" style={{ gap: "10px" }}>
                    <button className="btn primary-btn" type="submit">
                      {editingCategory ? "Update Taxonomy" : "Create Category"}
                    </button>
                    {editingCategory && (
                      <button className="btn ghost-btn" type="button" onClick={() => setEditingCategory(null)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </article>
          )}

          {activeTab === "foods" && (
            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow"><Icons.Food /> Menu Engineering</div>
                  <h2>{editingFood ? "Refine Item" : "New Menu Item"}</h2>
                </div>
                <form key={editingFood?._id || "new-food"} className="stack-form" onSubmit={createFood}>
                  <div className="form-group">
                    <label className="form-label">Dish Name</label>
                    <input name="title" defaultValue={editingFood?.title || ""} placeholder="Spicy Ramen" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (INR)</label>
                      <input name="price" type="number" defaultValue={editingFood?.price || ""} placeholder="499" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select name="categoryId" defaultValue={categories.find((c) => c.title === editingFood?.category)?._id || ""} required>
                        <option value="" disabled>Select Category</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Link to Restaurant</label>
                    <select name="Resturants" defaultValue={editingFood?.Resturants?._id || editingFood?.Resturants || ""} required>
                      <option value="" disabled>Select Kitchen</option>
                      {restaurants.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" defaultValue={editingFood?.description || ""} placeholder="Crafted with authentic spices..." rows="3" required />
                  </div>
                  <div className="stack" style={{ gap: "10px" }}>
                    <button className="btn primary-btn" type="submit">
                      {editingFood ? "Save Item" : "Publish to Menu"}
                    </button>
                    {editingFood && (
                      <button className="btn ghost-btn" type="button" onClick={() => setEditingFood(null)}>
                        Discard
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </article>
          )}
        </aside>

        {/* Right Column: List */}
        <main className="stack-lg">
          <div className="card">
            <div className="card-body">
              <div className="between" style={{ marginBottom: "var(--space-md)" }}>
                <div className="form-header" style={{ border: 0, padding: 0, margin: 0 }}>
                  <div className="eyebrow">Database</div>
                  <h2 style={{ fontSize: "1.2rem" }}>Registered {activeTab}</h2>
                </div>
                <div className="search-wrapper" style={{ position: "relative", minWidth: "240px" }}>
                  <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}>
                    <Icons.Search />
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`} 
                    style={{ paddingLeft: "40px", height: "42px", fontSize: "14px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-list">
                {filteredItems.length === 0 ? (
                  <div className="empty" style={{ padding: "40px" }}>
                    <p>No {activeTab} found matching your search.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div className="admin-row" key={item._id} style={{ 
                      padding: "16px", 
                      background: "rgba(255,255,255,0.4)", 
                      borderRadius: "var(--radius-md)",
                      marginBottom: "8px",
                      border: "1px solid var(--color-border)"
                    }}>
                      <div className="stack" style={{ gap: "4px" }}>
                        <span style={{ fontWeight: 700, fontSize: "15px" }}>{item.title}</span>
                        <div className="muted" style={{ fontSize: "12px", display: "flex", gap: "12px" }}>
                          {activeTab === "restaurants" && <span>{item.coords?.address}</span>}
                          {activeTab === "foods" && <span>₹{item.price} • {item.category}</span>}
                          {activeTab === "categories" && <span>ID: {item._id.slice(-6)}</span>}
                        </div>
                      </div>
                      <div className="admin-row-actions">
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => {
                          if (activeTab === "restaurants") editRestaurant(item._id);
                          if (activeTab === "categories") editCategory(item._id);
                          if (activeTab === "foods") editFood(item._id);
                        }}>
                          <Icons.Edit /> Edit
                        </button>
                        <button 
                          className="btn ghost-btn btn-sm-rounded" 
                          style={{ color: "var(--color-error)", borderColor: "rgba(239, 68, 68, 0.2)" }}
                          onClick={() => {
                            const path = activeTab === "restaurants" ? `/resturant/resturant/${item._id}` :
                                         activeTab === "categories" ? `/category/category/${item._id}` :
                                         `/food/deletefood/${item._id}`;
                            const msg = `${activeTab.slice(0, -1)} deleted`;
                            deleteItem(path, msg);
                          }}
                        >
                          <Icons.Trash /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
