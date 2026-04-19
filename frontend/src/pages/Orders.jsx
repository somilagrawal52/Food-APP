import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { currency, fallbackImage } from "../lib/format";
import { showToast } from "../lib/utils";

function Orders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";

  const loadOrders = () => {
    const endpoint = isAdmin ? "/food/orders/all" : "/food/orders/my";
    api(endpoint).then((data) => setOrders(data.orders || []));
  };

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    loadOrders();
  }, [navigate]);

  const updateOrderStatus = async (id, status) => {
    try {
      await api(`/food/orderStatus/${id}`, { method: "POST", body: JSON.stringify({ status }) });
      showToast("Order status updated");
      loadOrders();
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">{isAdmin ? "Management" : "History"}</div>
        <h1>{isAdmin ? "Global Order Flow" : "Your Culinary Journey"}</h1>
        <div className="between">
          <p className="muted">{isAdmin ? "Monitor and update real-time fulfillment across the platform." : "Tracking your recent gourmet experiences and real-time status."}</p>
          {isAdmin && <button className="btn ghost-btn" onClick={loadOrders}>Refresh Orders</button>}
        </div>
      </section>
      <section className="section">
        {!orders ? (
          <div className="empty">Preparing history...</div>
        ) : orders.length ? (
          <div className="list stack-xl">
            {orders.map((order) => (
              <article className="card" key={order._id}>
                <div className="card-body stack-md">
                  <div className="between">
                    <div className="stack">
                      <div className="between" style={{ gap: 'var(--space-xs)' }}>
                        <span className="tag">Order #{order._id.slice(-6).toUpperCase()}</span>
                        {isAdmin && <span className="pill dark-pill" style={{ textTransform: 'capitalize' }}>{order.buyer?.Username || "User"}</span>}
                      </div>
                      <h3 style={{ margin: 0 }}>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                    </div>
                    {isAdmin ? (
                      <select 
                        className="select" 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{ width: 'auto', padding: 'var(--space-2xs) var(--space-sm)' }}
                      >
                        <option>Pending</option>
                        <option>Preparing</option>
                        <option>On the way</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    ) : (
                      <span className={`tag ${order.status === 'Delivered' ? '' : 'warn'}`}>{order.status}</span>
                    )}
                  </div>
                  
                  <div className="list stack-xs">
                    {order.items.map((item, idx) => (
                      <div className="cart-item" key={`${order._id}-${idx}`} style={{ borderBottom: 'none', padding: 'var(--space-2xs) 0' }}>
                        <img src={item.imageURL || fallbackImage(item.title)} alt={item.title} style={{ width: '60px', height: '60px' }} />
                        <div className="between" style={{ flex: 1 }}>
                          <div className="stack" style={{ gap: '2px' }}>
                            <strong style={{ fontSize: 'var(--text-base)' }}>{item.title}</strong>
                            <span className="muted">Quantity: {item.quantity}</span>
                          </div>
                          <strong className="price">{currency(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isAdmin && order.deliveryAddress && (
                    <div style={{ padding: 'var(--space-2xs) var(--space-sm)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="eyebrow" style={{ fontSize: '10px' }}>Delivery Destination</span>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>{order.deliveryAddress}</p>
                    </div>
                  )}

                  <div className="between" style={{ paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border)' }}>
                    <span className="muted font-medium">Order Total Payable</span>
                    <strong style={{ fontSize: 'var(--text-xl)', color: 'var(--color-accent)' }}>{currency(order.payment)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>{isAdmin ? "No orders found" : "Your history is clean"}</h3>
            <p>{isAdmin ? "Orders will appear here once customers start placing them." : "Begin your journey by exploring our curated menus."}</p>
            {!isAdmin && <Link className="btn primary-btn" style={{ marginTop: 'var(--space-md)' }} to="/menu">Browse Menu</Link>}
          </div>
        )}
      </section>
    </>
  );
}

export default Orders;
