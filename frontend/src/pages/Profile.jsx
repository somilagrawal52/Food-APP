import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth, getAuth, setAuth } from "../lib/api";
import { showToast } from "../lib/utils";

function Profile() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";

  const loadAdminData = async () => {
    if (!isAdmin) return;
    const [foodData, categoryData, restaurantData] = await Promise.all([
      api("/food/getallfoods"),
      api("/category/getallcategories"),
      api("/resturant/getallresturants")
    ]);
    setFoods(foodData.foods || []);
    setCategories(categoryData.categories || []);
    setRestaurants(restaurantData.resturants || []);
  };

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    api("/user/getuser").then((data) => setUser(data.user));
    if (isAdmin) loadAdminData();
  }, [navigate]);

  const updateProfile = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    form.address = form.address ? [form.address] : undefined;
    try {
      await api("/user/updateuser", { method: "PUT", body: JSON.stringify(form) });
      const data = await api("/user/getuser");
      setUser(data.user);
      setAuth({ ...getAuth(), user: data.user });
      showToast("Profile updated");
    } catch (error) {
      showToast(error.message);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api("/user/updatepassword", { method: "POST", body: JSON.stringify(form) });
      event.currentTarget.reset();
      showToast("Password updated");
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteProfile = async () => {
    if (!auth?.user?._id) return;
    try {
      await api(`/user/deleteuser/${auth.user._id}`, { method: "DELETE" });
      clearAuth();
      navigate("/auth");
    } catch (error) {
      showToast(error.message);
    }
  };

  // Admin Actions
  const createCategory = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (editingCategory?._id) {
      await api(`/category/category/${editingCategory._id}`, { method: "PUT", body: JSON.stringify(payload) });
      showToast("Category updated");
      setEditingCategory(null);
    } else {
      await api("/category/createcategory", { method: "POST", body: JSON.stringify(payload) });
      showToast("Category created");
    }
    event.currentTarget.reset();
    loadAdminData();
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
      coords: { address: form.address, lat: 0, lng: 0, title: form.title }
    };
    delete payload.address;
    if (editingRestaurant?._id) {
      await api(`/resturant/resturant/${editingRestaurant._id}`, { method: "PUT", body: JSON.stringify(payload) });
      showToast("Restaurant updated");
      setEditingRestaurant(null);
    } else {
      await api("/resturant/createresturant", { method: "POST", body: JSON.stringify(payload) });
      showToast("Restaurant created");
    }
    event.currentTarget.reset();
    loadAdminData();
  };

  const createFood = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      price: Number(form.price),
      Resturants: form.Resturants,
      category: categories.find(c => c._id === form.categoryId)?.title || "",
      foodtags: ""
    };
    delete payload.categoryId;
    if (editingFood?._id) {
      await api(`/food/updatefood/${editingFood._id}`, { method: "PUT", body: JSON.stringify(payload) });
      showToast("Food updated");
      setEditingFood(null);
    } else {
      await api("/food/createfood", { method: "POST", body: JSON.stringify(payload) });
      showToast("Food created");
    }
    event.currentTarget.reset();
    loadAdminData();
  };

  const deleteItem = async (path, message) => {
    await api(path, { method: "DELETE" });
    showToast(message);
    loadAdminData();
  };

  const editCategory = async (id) => {
    const data = await api(`/category/category/${id}`);
    setEditingCategory(data.Category || null);
  };

  const editFood = async (id) => {
    const data = await api(`/food/food/${id}`);
    setEditingFood(data.food || null);
  };

  const editRestaurant = async (id) => {
    const data = await api(`/resturant/resturant/${id}`);
    setEditingRestaurant(data.resturant || null);
  };

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">Settings</div>
        <h1>Account Management</h1>
        <p className="muted">Maintain your personal information and security preferences.</p>
      </section>
      
      <section className="section auth-grid">
        <article className="card">
          <div className="card-body">
            <div className="form-header">
              <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Identity</div>
              <h2>Profile Information</h2>
            </div>
            <form className="stack-form" onSubmit={updateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="Username" placeholder="Enter full name" defaultValue={user?.Username || ""} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input name="phoneNumber" placeholder="Enter phone number" defaultValue={user?.phoneNumber || ""} />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Delivery Address</label>
                <input name="address" placeholder="Enter delivery address" defaultValue={Array.isArray(user?.address) ? user.address[0] : user?.address || ""} />
              </div>
              <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Update Information</button>
            </form>
          </div>
        </article>
        <article className="card">
          <div className="card-body">
            <div className="form-header">
              <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Security</div>
              <h2>Change Credentials</h2>
            </div>
            <form className="stack-form" onSubmit={updatePassword}>
              <div className="form-group">
                <label className="form-label">Current Security Password</label>
                <div className="password-wrapper">
                  <input name="oldPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-wrapper">
                  <input name="newPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
              <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Update Password</button>
            </form>
            <div className="card-actions stack" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <p className="muted text-xs">Danger Zone: Once deleted, account data cannot be recovered.</p>
              <button className="btn ghost-btn" style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }} type="button" onClick={deleteProfile}>Permanent Account Deletion</button>
            </div>
          </div>
        </article>
      </section>

      {isAdmin && (
        <>
          <section className="section stack-lg" style={{ marginTop: 'var(--space-3xl)' }}>
            <div className="eyebrow">Admin Panel</div>
            <h1>Catalog Management</h1>
            <p className="muted">Configure restaurants, categories, and menu items.</p>
          </section>

          <section className="section admin-grid">
            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Catalog</div>
                  <h2>Category</h2>
                </div>
                <form key={editingCategory?._id || "new-cat"} className="stack-form" onSubmit={createCategory}>
                  <div className="form-group">
                    <label className="form-label">Category Name</label>
                    <input name="title" placeholder="e.g. Italian" required defaultValue={editingCategory?.title || ""} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input name="imageURL" placeholder="https://..." required defaultValue={editingCategory?.imageURL || ""} />
                  </div>
                  <button className="btn primary-btn" type="submit">{editingCategory ? "Update Category" : "Create Category"}</button>
                  {editingCategory && <button className="btn ghost-btn" type="button" onClick={() => setEditingCategory(null)}>Cancel</button>}
                </form>
                <div className="admin-list" style={{ marginTop: "var(--space-md)" }}>
                  {categories.map((c) => (
                    <div className="admin-row" key={c._id}>
                      <span className="font-medium">{c.title}</span>
                      <div className="admin-row-actions">
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => editCategory(c._id)}>Edit</button>
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => deleteItem(`/category/category/${c._id}`, "Deleted")}>Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Kitchen</div>
                  <h2>Restaurant</h2>
                </div>
                <form key={editingRestaurant?._id || "new-res"} className="stack-form" onSubmit={createRestaurant}>
                  <div className="form-group">
                    <label className="form-label">Restaurant Title</label>
                    <input name="title" placeholder="e.g. The Gourmet Hub" required defaultValue={editingRestaurant?.title || ""} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <input name="address" placeholder="123 Street Name" required defaultValue={editingRestaurant?.coords?.address || ""} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Availability</label>
                      <select className="select" name="isOpen" defaultValue={String(editingRestaurant?.isOpen ?? true)}>
                        <option value="true">Open</option><option value="false">Closed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Logo/Cover URL</label>
                      <input name="imageURL" placeholder="https://..." defaultValue={editingRestaurant?.imageURL || ""} />
                    </div>
                  </div>
                  <button className="btn primary-btn" type="submit">{editingRestaurant ? "Update Kitchen" : "Create Kitchen"}</button>
                  {editingRestaurant && <button className="btn ghost-btn" type="button" onClick={() => setEditingRestaurant(null)}>Cancel</button>}
                </form>
                <div className="admin-list" style={{ marginTop: "var(--space-md)" }}>
                  {restaurants.map((r) => (
                    <div className="admin-row" key={r._id}>
                      <span className="font-medium">{r.title}</span>
                      <div className="admin-row-actions">
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => editRestaurant(r._id)}>Edit</button>
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => deleteItem(`/resturant/resturant/${r._id}`, "Deleted")}>Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Menu</div>
                  <h2>Food Item</h2>
                </div>
                <form key={editingFood?._id || "new-food"} className="stack-form" onSubmit={createFood}>
                  <div className="form-group">
                    <label className="form-label">Dish Title</label>
                    <input name="title" placeholder="e.g. Truffle Pasta" required defaultValue={editingFood?.title || ""} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (Rs)</label>
                      <input name="price" placeholder="0.00" required defaultValue={editingFood?.price || ""} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="select" name="categoryId" required defaultValue={categories.find(c => c.title === editingFood?.category)?._id || ""}>
                        <option value="" disabled>Select</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign to Kitchen</label>
                    <select className="select" name="Resturants" required defaultValue={editingFood?.Resturants?._id || editingFood?.Resturants || ""}>
                      <option value="" disabled>Select</option>
                      {restaurants.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" placeholder="Describe the ingredients and taste..." required defaultValue={editingFood?.description || ""} />
                  </div>
                  <button className="btn primary-btn" type="submit">{editingFood ? "Update Dish" : "Create Dish"}</button>
                  {editingFood && <button className="btn ghost-btn" type="button" onClick={() => setEditingFood(null)}>Cancel</button>}
                </form>
                <div className="admin-list" style={{ marginTop: "var(--space-md)" }}>
                  {foods.map((f) => (
                    <div className="admin-row" key={f._id}>
                      <span className="font-medium" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.title}</span>
                      <div className="admin-row-actions">
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => editFood(f._id)}>Edit</button>
                        <button className="btn ghost-btn btn-sm-rounded" onClick={() => deleteItem(`/food/deletefood/${f._id}`, "Deleted")}>Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </>
  );
}

export default Profile;
