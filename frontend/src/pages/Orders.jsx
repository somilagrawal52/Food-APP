import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { currency, fallbackImage } from "../lib/format";
import { showToast } from "../lib/utils";

function Orders() {
  const [orders, setOrders] = useState(null);
  const [activeTab, setActiveTab] = useState("default"); // 'my' | 'incoming'
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";
  const isVendor = auth?.user?.userType === "vendor";

  // Determine actual endpoint based on role and activeTab
  const getEndpoint = () => {
    if (isAdmin) return "/food/orders/all";
    if (isVendor) {
      return activeTab === "my" ? "/food/orders/my" : "/food/orders/vendor";
    }
    return "/food/orders/my";
  };

  const loadOrders = () => {
    const endpoint = getEndpoint();
    api(endpoint)
      .then((data) => setOrders(data.orders || []))
      .catch((err) => {
        showToast(err.message, "error");
        setOrders([]);
      });
  };

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    loadOrders();
  }, [navigate, activeTab]);

  const canEditStatus = isAdmin || (isVendor && activeTab !== "my");

  const updateOrderStatus = async (id, status) => {
    try {
      await api(`/food/orderStatus/${id}`, { method: "POST", body: JSON.stringify({ status }) });
      showToast("Order status updated successfully", "success");
      loadOrders();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const pageTitle = isAdmin
    ? "Global Order Flow"
    : isVendor
    ? activeTab === "my"
      ? "My Personal Orders"
      : "Incoming Kitchen Orders"
    : "Your Order History";

  const pageSubtitle = isAdmin
    ? "Monitor and manage real-time fulfillment across the platform."
    : isVendor
    ? activeTab === "my"
      ? "Orders you placed as a customer."
      : "Fulfill orders received by your restaurants in real-time."
    : "Track your gourmet experiences and order statuses in real-time.";

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">{isAdmin ? "Admin Management" : isVendor ? "Kitchen Operations" : "Order History"}</div>
        <div className="between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div className="stack" style={{ gap: "6px" }}>
            <h1>{pageTitle}</h1>
            <p className="muted">{pageSubtitle}</p>
          </div>
          <button className="btn ghost-btn" onClick={loadOrders}>
            Refresh
          </button>
        </div>

        {/* Vendor Tab Switcher */}
        {isVendor && (
          <div className="filter-chip-wrap" style={{ marginTop: "var(--space-xs)" }}>
            <button
              className={`btn ${activeTab !== "my" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setActiveTab("incoming")}
            >
              Incoming Orders
            </button>
            <button
              className={`btn ${activeTab === "my" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setActiveTab("my")}
            >
              My Placed Orders
            </button>
          </div>
        )}

        {/* Status Filter Chips */}
        <div className="filter-chip-wrap" style={{ gap: "8px", marginTop: "var(--space-2xs)" }}>
          {["all", "Pending", "Preparing", "On the way", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              className={`btn ${statusFilter === st ? "primary-btn" : "ghost-btn"}`}
              style={{ fontSize: "var(--text-xs)", padding: "6px 14px" }}
              onClick={() => setStatusFilter(st)}
            >
              {st === "all" ? "All Statuses" : st}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        {!orders ? (
          <div className="empty">Loading orders...</div>
        ) : filteredOrders.length ? (
          <div className="list stack-xl">
            {filteredOrders.map((order) => (
              <article className="card" key={order._id}>
                <div className="card-body stack-md">
                  <div className="between" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <div className="stack" style={{ gap: "4px" }}>
                      <div className="between" style={{ gap: "var(--space-xs)" }}>
                        <span className="tag">Order #{order._id.slice(-6).toUpperCase()}</span>
                        {canEditStatus && (
                          <span className="pill dark-pill" style={{ textTransform: "capitalize" }}>
                            Customer: {order.buyer?.Username || "Guest"}
                          </span>
                        )}
                        {order.resturant?.title && (
                          <span className="tag-outline" style={{ fontSize: "11px" }}>
                            {order.resturant.title}
                          </span>
                        )}
                      </div>
                      <h3 style={{ margin: 0, fontSize: "var(--text-base)" }}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </h3>
                    </div>

                    {canEditStatus ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="text-xs muted">Update:</span>
                        <select
                          className="select"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          style={{
                            width: "auto",
                            padding: "6px 12px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--color-bg-base)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <option>Pending</option>
                          <option>Preparing</option>
                          <option>On the way</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    ) : (
                      <span
                        className={`tag ${
                          order.status === "Delivered"
                            ? ""
                            : order.status === "Cancelled"
                            ? "danger"
                            : "warn"
                        }`}
                        style={{
                          background:
                            order.status === "Delivered"
                              ? "rgba(16, 185, 129, 0.15)"
                              : order.status === "Cancelled"
                              ? "rgba(244, 63, 94, 0.15)"
                              : "rgba(245, 158, 11, 0.15)",
                          color:
                            order.status === "Delivered"
                              ? "#10b981"
                              : order.status === "Cancelled"
                              ? "#f43f5e"
                              : "#f59e0b",
                        }}
                      >
                        {order.status}
                      </span>
                    )}
                  </div>

                  <div className="list stack-xs">
                    {order.items.map((item, idx) => (
                      <div
                        className="cart-item"
                        key={`${order._id}-${idx}`}
                        style={{ borderBottom: "none", padding: "var(--space-2xs) 0" }}
                      >
                        <img
                          src={item.imageURL || fallbackImage(item.title)}
                          alt={item.title}
                          style={{ width: "56px", height: "56px", borderRadius: "var(--radius-sm)" }}
                        />
                        <div className="between" style={{ flex: 1 }}>
                          <div className="stack" style={{ gap: "2px" }}>
                            <strong style={{ fontSize: "var(--text-base)" }}>{item.title}</strong>
                            <span className="muted text-sm">Qty: {item.quantity}</span>
                          </div>
                          <strong className="price">{currency(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.deliveryAddress && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <span className="eyebrow" style={{ fontSize: "10px", margin: 0 }}>
                        Delivery Destination
                      </span>
                      <p className="muted" style={{ fontSize: "var(--text-sm)", margin: "2px 0 0" }}>
                        {order.deliveryAddress}
                        {order.buyer?.phoneNumber && (
                          <span style={{ marginLeft: "12px", opacity: 0.8 }}>
                            | Phone: {order.buyer.phoneNumber}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  <div
                    className="between"
                    style={{ paddingTop: "var(--space-sm)", borderTop: "1px solid var(--color-border)" }}
                  >
                    <span className="muted font-medium">Total Amount</span>
                    <strong style={{ fontSize: "var(--text-xl)", color: "var(--color-accent)" }}>
                      {currency(order.payment)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No orders found</h3>
            <p>
              {statusFilter !== "all"
                ? `No orders matching status "${statusFilter}".`
                : "No orders to display in this view."}
            </p>
            {!isAdmin && !isVendor && (
              <Link className="btn primary-btn" style={{ marginTop: "var(--space-md)" }} to="/menu">
                Browse Menu
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Orders;
