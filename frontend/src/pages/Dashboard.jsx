import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { showToast } from "../lib/utils";

function Dashboard() {
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState("restaurants"); // restaurants | foods | orders

  const navigate = useNavigate();
  const auth = getAuth();
  const isVendor = auth?.user?.userType === "vendor";
  const isAdmin = auth?.user?.userType === "admin";

  const loadData = async () => {
    try {
      const [resData, catData, foodData, orderData] = await Promise.all([
        api(isAdmin ? "/resturant/getallresturants" : "/resturant/myresturants"),
        api("/category/getallcategories"),
        api("/food/getallfoods"),
        api(isAdmin ? "/food/orders/all" : "/food/orders/vendor")
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
    if (!auth?.token || (!isVendor && !isAdmin)) {
      navigate("/auth");
      return;
    }
    loadData();
  }, [navigate]);

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    const payload = {
      ...form,
      delivery: form.delivery === "true",
      pickup: form.pickup === "true",
      isOpen: form.isOpen === "true",
      coords: { address: form.address, lat: 0, lng: 0, title: form.title }
    };
    delete payload.address;

    try {
      if (editingRestaurant?._id) {
        await api(`/resturant/resturant/${editingRestaurant._id}`, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Restaurant updated");
        setEditingRestaurant(null);
      } else {
        await api("/resturant/createresturant", { method: "POST", body: JSON.stringify(payload) });
        showToast("Restaurant created");
      }
      event.currentTarget.reset();
      loadData();
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
      category: categories.find(c => c._id === form.categoryId)?.title || "",
      foodtags: ""
    };
    delete payload.categoryId;

    try {
      if (editingFood?._id) {
        await api(`/food/updatefood/${editingFood._id}`, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Food updated");
        setEditingFood(null);
      } else {
        await api("/food/createfood", { method: "POST", body: JSON.stringify(payload) });
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
      await api(`/food/orderStatus/${orderId}`, { method: "POST", body: JSON.stringify({ status }) });
      showToast("Order status updated");
      loadData();
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteItem = async (path, message) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api(path, { method: "DELETE" });
      showToast(message);
      loadData();
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="dashboard-page">
      <section className="section stack-lg">
        <div className="eyebrow">Management</div>
        <h1>{isAdmin ? "Admin Console" : "Vendor Dashboard"}</h1>
        <p className="muted">Oversee your culinary operations and order fulfillment.</p>
      </section>

      <div className="tab-nav" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn-text-only ${activeTab === 'restaurants' ? 'active-tab' : ''}`} onClick={() => setActiveTab('restaurants')} style={{ padding: '10px 0', borderBottom: activeTab === 'restaurants' ? '2px solid var(--color-primary)' : 'none' }}>Kitchens</button>
        <button className={`btn-text-only ${activeTab === 'foods' ? 'active-tab' : ''}`} onClick={() => setActiveTab('foods')} style={{ padding: '10px 0', borderBottom: activeTab === 'foods' ? '2px solid var(--color-primary)' : 'none' }}>Menu Items</button>
        <button className={`btn-text-only ${activeTab === 'orders' ? 'active-tab' : ''}`} onClick={() => setActiveTab('orders')} style={{ padding: '10px 0', borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : 'none' }}>Orders</button>
      </div>

      {activeTab === 'restaurants' && (
        <section className="section grid-1-2">
          <article className="card">
            <div className="card-body">
              <div className="form-header">
                <h2>{editingRestaurant ? "Edit Kitchen" : "Register Kitchen"}</h2>
              </div>
              <form key={editingRestaurant?._id || "new-res"} className="stack-form" onSubmit={handleRestaurantSubmit}>
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
                    <label className="form-label">Status</label>
                    <select className="select" name="isOpen" defaultValue={String(editingRestaurant?.isOpen ?? true)}>
                      <option value="true">Open</option><option value="false">Closed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Logo/Cover URL</label>
                    <input name="imageURL" placeholder="https://..." defaultValue={editingRestaurant?.imageURL || ""} />
                  </div>
                </div>
                <button className="btn primary-btn btn-lg" type="submit">{editingRestaurant ? "Update Kitchen" : "Create Kitchen"}</button>
                {editingRestaurant && <button className="btn ghost-btn btn-lg" type="button" onClick={() => setEditingRestaurant(null)}>Cancel</button>}
              </form>
            </div>
          </article>
          <div className="stack">
            {myRestaurants.map(r => (
              <article className="card" key={r._id}>
                <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{r.title}</h3>
                    <p className="muted text-sm">{r.coords?.address}</p>
                    <span className={`pill ${r.isOpen ? 'success-pill' : 'error-pill'}`}>{r.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                  <div className="stack" style={{ flexDirection: 'row', gap: '10px' }}>
                    <button className="btn ghost-btn btn-sm" onClick={() => setEditingRestaurant(r)}>Edit</button>
                    <button className="btn ghost-btn btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => deleteItem(`/resturant/resturant/${r._id}`, "Deleted")}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'foods' && (
        <section className="section grid-1-2">
          <article className="card">
            <div className="card-body">
              <div className="form-header">
                <h2>{editingFood ? "Edit Dish" : "Add New Dish"}</h2>
              </div>
              <form key={editingFood?._id || "new-food"} className="stack-form" onSubmit={handleFoodSubmit}>
                <div className="form-group">
                  <label className="form-label">Dish Title</label>
                  <input name="title" placeholder="e.g. Truffle Pasta" required defaultValue={editingFood?.title || ""} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (Rs)</label>
                    <input name="price" type="number" placeholder="0.00" required defaultValue={editingFood?.price || ""} />
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
                    {myRestaurants.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" placeholder="Describe the ingredients..." required defaultValue={editingFood?.description || ""} />
                </div>
                <button className="btn primary-btn btn-lg" type="submit">{editingFood ? "Update Dish" : "Create Dish"}</button>
                {editingFood && <button className="btn ghost-btn btn-lg" type="button" onClick={() => setEditingFood(null)}>Cancel</button>}
              </form>
            </div>
          </article>
          <div className="stack">
            {foods.filter(f => myRestaurants.some(r => r._id === (f.Resturants?._id || f.Resturants))).map(f => (
              <article className="card" key={f._id}>
                <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {f.imageURL && <img src={f.imageURL} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />}
                    <div>
                      <h3>{f.title}</h3>
                      <p className="muted text-sm">Rs {f.price} • {f.category}</p>
                    </div>
                  </div>
                  <div className="stack" style={{ flexDirection: 'row', gap: '10px' }}>
                    <button className="btn ghost-btn btn-sm" onClick={() => setEditingFood(f)}>Edit</button>
                    <button className="btn ghost-btn btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => deleteItem(`/food/deletefood/${f._id}`, "Deleted")}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="section stack">
          {orders.length === 0 ? (
            <div className="card card-body text-center muted">No orders found for your kitchens.</div>
          ) : (
            orders.map(order => (
              <article className="card" key={order._id}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                    <div>
                      <div className="eyebrow">Order #{order._id.slice(-6).toUpperCase()}</div>
                      <h3>Buyer: {order.buyer?.Username}</h3>
                      <p className="muted text-sm">{order.buyer?.phoneNumber} • {order.deliveryAddress}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="font-medium">Total: Rs {order.payment}</div>
                      <select 
                        className="select" 
                        style={{ marginTop: '5px' }} 
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
                  <div className="stack-sm">
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--color-border-faint)', paddingTop: '5px' }}>
                        <span>{item.quantity}x {item.title}</span>
                        <span>Rs {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px' }} className="muted">
                    Restaurant: {order.resturant?.title || 'N/A'}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default Dashboard;
