import React, { useEffect, useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { showToast } from "../lib/utils";

const Icons = {
  Restaurant: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6.5 4 4 0 0 1 13 6.5 4 4 0 0 1 14.41 13.87"/><path d="M9 22V12"/><path d="M15 22V12"/><path d="M8 12h8"/><rect width="20" height="5" x="2" y="17" rx="2"/></svg>
  ),
  Food: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x2="10" y1="1" y2="4"/><line x2="14" y1="1" y2="4"/></svg>
  ),
  Order: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
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
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

function Dashboard() {
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // orders | foods | kitchens
  const [editingFood, setEditingFood] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";

  const loadData = async () => {
    try {
      const [resData, catData, foodData, orderData] = await Promise.all([
        api("/resturant/myresturants"),
        api("/category/getallcategories"),
        api("/food/getallfoods"),
        api("/food/orders/vendor"),
      ]);
      setMyRestaurants(resData.resturants || []);
      setCategories(catData.categories || []);
      setFoods(foodData.foods || []);
      setOrders(orderData.orders || []);
    } catch (error) {
      showToast("Error loading dashboard data");
    }
  };

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [navigate]);

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = Object.fromEntries(formData.entries());
    const payload = {
      ...form,
      isOpen: form.isOpen === "true",
      coords: { address: form.address, lat: 0, lng: 0, title: form.title },
    };
    delete payload.address;

    try {
      if (editingRestaurant?._id) {
        await api(`/resturant/resturant/${editingRestaurant._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast("Kitchen details updated");
        setEditingRestaurant(null);
        loadData();
      }
    } catch (error) {
      showToast(error.message);
    }
  };

  const handleFoodSubmit = async (event) => {
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
        showToast("Food updated");
        setEditingFood(null);
      } else {
        await api("/food/createfood", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast("Food created");
      }
      event.currentTarget.reset();
      loadData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api(`/food/orderStatus/${orderId}`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      showToast(`Order marked as ${status}`);
      loadData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteItem = async (path, message) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api(path, { method: "DELETE" });
      showToast(message);
      loadData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const filteredFoods = useMemo(() => {
    return foods.filter(f => 
      myRestaurants.some(r => r._id === (f.Resturants?._id || f.Resturants))
    );
  }, [foods, myRestaurants]);

  if (!auth?.token) return <Navigate to="/auth" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="shell" style={{ paddingBottom: "var(--space-3xl)" }}>
      <section className="section stack-lg" style={{ marginTop: "var(--space-xl)" }}>
        <div className="eyebrow">Vendor Portal</div>
        <div className="between">
          <div>
            <h1>Kitchen Dashboard</h1>
            <p className="muted">Manage your daily operations, menu, and incoming orders.</p>
          </div>
          <div className="mini-stats">
             <div className="admin-summary-card" style={{ padding: "12px 20px" }}>
                <span className="muted text-xs">Active Orders</span>
                <strong>{orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length}</strong>
             </div>
          </div>
        </div>
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
        {[
          { id: "orders", label: "Live Orders", icon: <Icons.Order /> },
          { id: "foods", label: "Menu Items", icon: <Icons.Food /> },
          { id: "kitchens", label: "Kitchen Settings", icon: <Icons.Restaurant /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-text-only ${activeTab === tab.id ? "active-tab" : ""}`}
            style={{ 
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingBottom: "12px",
              borderBottom: activeTab === tab.id ? "2px solid var(--color-accent)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--color-accent)" : "var(--color-text-muted)",
              fontWeight: 700,
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <section className="stack-lg">
          <div className="between">
            <h2>Incoming Orders</h2>
            <button className="btn ghost-btn btn-sm-rounded" onClick={loadData}>Refresh List</button>
          </div>
          
          <div className="stack" style={{ gap: "16px" }}>
            {orders.length === 0 ? (
              <div className="empty">No orders currently active.</div>
            ) : (
              orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                <article className="card" key={order._id} style={{ borderLeft: `4px solid ${order.status === "Pending" ? "var(--color-warning)" : "var(--color-success)"}` }}>
                  <div className="card-body">
                    <div className="between" style={{ alignItems: "flex-start" }}>
                      <div className="stack" style={{ gap: "4px" }}>
                        <div className="eyebrow" style={{ fontSize: "10px" }}>#{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt || Date.now()).toLocaleTimeString()}</div>
                        <h3 style={{ fontSize: "1.1rem" }}>{order.buyer?.Username || "Customer"}</h3>
                        <p className="muted text-sm">{order.deliveryAddress}</p>
                      </div>
                      <div className="stack" style={{ alignItems: "flex-end", gap: "8px" }}>
                        <div className="food-price-tag">₹{order.payment}</div>
                        <select 
                          className="select" 
                          style={{ fontSize: "12px", padding: "6px 12px", height: "auto" }}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="On the way">On the way</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="admin-form-block" style={{ marginTop: "16px", background: "rgba(0,0,0,0.02)" }}>
                      <div className="stack-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="between" style={{ fontSize: "14px", padding: "4px 0" }}>
                            <span style={{ fontWeight: 500 }}>{item.quantity}x {item.title}</span>
                            <span className="muted">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="between" style={{ marginTop: "12px" }}>
                      <span className="tag-outline" style={{ fontSize: "9px" }}>Kitchen: {order.resturant?.title}</span>
                      {order.status === "Pending" && (
                         <button className="btn primary-btn btn-sm-rounded" onClick={() => updateOrderStatus(order._id, "Preparing")}>
                           Accept Order
                         </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "foods" && (
        <div className="admin-grid">
          <aside className="stack-lg">
            <article className="card">
              <div className="card-body">
                <div className="form-header">
                  <div className="eyebrow"><Icons.Food /> Menu Management</div>
                  <h2>{editingFood ? "Edit Dish" : "New Dish"}</h2>
                </div>
                <form key={editingFood?._id || "new-food"} className="stack-form" onSubmit={handleFoodSubmit}>
                  <div className="form-group">
                    <label className="form-label">Dish Title</label>
                    <input name="title" placeholder="e.g. Garlic Naan" required defaultValue={editingFood?.title || ""} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (₹)</label>
                      <input name="price" type="number" placeholder="0" required defaultValue={editingFood?.price || ""} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select name="categoryId" required defaultValue={categories.find((c) => c.title === editingFood?.category)?._id || ""}>
                        <option value="" disabled>Select</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign to Kitchen</label>
                    <select name="Resturants" required defaultValue={editingFood?.Resturants?._id || editingFood?.Resturants || ""}>
                      <option value="" disabled>Select</option>
                      {myRestaurants.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" placeholder="Short description..." required defaultValue={editingFood?.description || ""} rows="3" />
                  </div>
                  <div className="stack" style={{ gap: "10px" }}>
                    <button className="btn primary-btn" type="submit">
                      {editingFood ? "Save Changes" : "Add to Menu"}
                    </button>
                    {editingFood && (
                      <button className="btn ghost-btn" type="button" onClick={() => setEditingFood(null)}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </article>
          </aside>
          
          <main className="stack">
             <div className="card">
               <div className="card-body">
                 <div className="form-header" style={{ border: 0 }}>
                    <div className="eyebrow">Your Menu</div>
                    <h2>All Dishes</h2>
                 </div>
                 <div className="admin-list">
                    {filteredFoods.length === 0 ? (
                      <div className="empty">No items in your menu yet.</div>
                    ) : (
                      filteredFoods.map((f) => (
                        <div className="admin-row" key={f._id} style={{ padding: "12px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", marginBottom: "8px" }}>
                           <div className="stack" style={{ gap: "4px" }}>
                              <span style={{ fontWeight: 700 }}>{f.title}</span>
                              <span className="muted text-xs">₹{f.price} • {f.category}</span>
                           </div>
                           <div className="admin-row-actions">
                              <button className="btn ghost-btn btn-sm-rounded" onClick={() => { setEditingFood(f); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Icons.Edit /></button>
                              <button className="btn ghost-btn btn-sm-rounded" style={{ color: "var(--color-error)" }} onClick={() => deleteItem(`/food/deletefood/${f._id}`, "Deleted")}><Icons.Trash /></button>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
               </div>
             </div>
          </main>
        </div>
      )}

      {activeTab === "kitchens" && (
        <section className="stack-lg">
          <div className="between">
            <h2>Kitchen Settings</h2>
            <p className="muted text-sm">Update your business profile and availability.</p>
          </div>
          
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "24px" }}>
            {myRestaurants.map((r) => (
              <article className="card" key={r._id}>
                <div className="card-body stack-lg">
                  <div className="between">
                    <div className="stack" style={{ gap: "4px" }}>
                      <h3>{r.title}</h3>
                      <p className="muted text-sm">{r.coords?.address}</p>
                    </div>
                    <span className={`pill ${r.isOpen ? "success-pill" : "error-pill"}`} style={{ background: r.isOpen ? "var(--color-success)" : "var(--color-error)", color: "white" }}>
                      {r.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  
                  <form className="stack-form" onSubmit={handleRestaurantSubmit}>
                    <input type="hidden" name="id" value={r._id} />
                    <div className="form-group">
                      <label className="form-label">Display Title</label>
                      <input name="title" defaultValue={r.title} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input name="address" defaultValue={r.coords?.address} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                         <label className="form-label">Operational Status</label>
                         <select name="isOpen" defaultValue={String(r.isOpen)}>
                            <option value="true">Open for Orders</option>
                            <option value="false">Closed (Busy/Holiday)</option>
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Banner Image URL</label>
                         <input name="imageURL" defaultValue={r.imageURL} />
                      </div>
                    </div>
                    <button className="btn primary-btn" type="submit">Update Kitchen Profile</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
