import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getAuth } from "../lib/api";
import { currency, fallbackImage } from "../lib/format";
import { showToast } from "../lib/utils";
import { addCartItem } from "../lib/store";

const ORDER_STEPS = ["Pending", "Preparing", "On the way", "Delivered"];

function getStepIndex(status) {
  if (status === "Cancelled") return -1;
  const idx = ORDER_STEPS.indexOf(status);
  return idx !== -1 ? idx : 0;
}

export function OrderReceiptModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="receipt-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-header">
          <div className="between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="brand" style={{ marginBottom: "6px" }}>
                <span className="brand-mark" style={{ width: "32px", height: "32px", fontSize: "16px" }}>P</span>
                <strong>Plateful Receipt</strong>
              </div>
              <p className="muted text-xs">Official Proof of Culinary Fulfillment</p>
            </div>
            <button className="btn-close-modal" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="receipt-body stack-sm">
          <div className="receipt-meta-grid">
            <div>
              <span className="text-xs muted">Receipt No.</span>
              <strong>#{order._id.slice(-8).toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-xs muted">Date & Time</span>
              <strong>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div>
              <span className="text-xs muted">Customer</span>
              <strong>{order.buyer?.Username || "Guest Customer"}</strong>
            </div>
            <div>
              <span className="text-xs muted">Kitchen</span>
              <strong>{order.resturant?.title || "Artisan Kitchen"}</strong>
            </div>
          </div>

          <div className="receipt-address-box">
            <span className="text-xs muted">Delivery Address:</span>
            <p className="text-sm font-medium">{order.deliveryAddress || "Standard delivery address"}</p>
          </div>

          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Item</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.title}</td>
                  <td style={{ textAlign: "center" }}>x{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>{currency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-summary-lines">
            <div className="between text-sm">
              <span className="muted">Subtotal</span>
              <span>{currency(order.payment)}</span>
            </div>
            <div className="between text-sm">
              <span className="muted">Delivery & Logistics</span>
              <span>Included</span>
            </div>
            <div className="between text-lg font-bold" style={{ paddingTop: "8px", borderTop: "1px dashed var(--color-border)" }}>
              <span>Total Paid</span>
              <span style={{ color: "var(--color-accent)" }}>{currency(order.payment)}</span>
            </div>
          </div>
        </div>

        <div className="receipt-footer between">
          <button className="btn ghost-btn" onClick={() => window.print()}>
            🖨️ Print Receipt
          </button>
          <button className="btn primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState(null);
  const [activeTab, setActiveTab] = useState("default"); // 'my' | 'incoming'
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const isAdmin = auth?.user?.userType === "admin";
  const isVendor = auth?.user?.userType === "vendor";

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

  const reorderItems = (order) => {
    if (!order?.items?.length) return;
    order.items.forEach((item) => {
      addCartItem({
        _id: item.food?._id || item.food || item._id,
        title: item.title,
        price: item.price,
        imageURL: item.imageURL,
      });
    });
    showToast(`Added ${order.items.length} items from Order #${order._id.slice(-6).toUpperCase()} to cart!`, "success");
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [orders, statusFilter]);

  const pageTitle = isAdmin
    ? "Global Order Fulfillment Stream"
    : isVendor
    ? activeTab === "my"
      ? "My Personal Dining History"
      : "Live Kitchen Order Queue"
    : "Your Culinary Journey & Tracking";

  const pageSubtitle = isAdmin
    ? "Real-time visibility into all active orders, logistics, and dispatch across all culinary partners."
    : isVendor
    ? activeTab === "my"
      ? "Personal dishes ordered from our partner network."
      : "Active orders placed by customers at your culinary establishments."
    : "Live second-by-second updates on your orders and previous gourmet dining receipts.";

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">{isAdmin ? "Admin Console" : isVendor ? "Merchant Operations" : "Order Logistics"}</div>
        <div className="between" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div className="stack" style={{ gap: "6px" }}>
            <h1>{pageTitle}</h1>
            <p className="muted">{pageSubtitle}</p>
          </div>
          <button className="btn ghost-btn" onClick={loadOrders}>
            ↻ Refresh Orders
          </button>
        </div>

        {/* Vendor Tab Switcher */}
        {isVendor && (
          <div className="filter-chip-wrap" style={{ marginTop: "var(--space-xs)" }}>
            <button
              className={`btn ${activeTab !== "my" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setActiveTab("incoming")}
            >
              👨‍🍳 Incoming Kitchen Orders
            </button>
            <button
              className={`btn ${activeTab === "my" ? "primary-btn" : "ghost-btn"}`}
              onClick={() => setActiveTab("my")}
            >
              🛍️ My Personal Orders
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
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        {!orders ? (
          <div className="empty">
            <div className="spinner-indicator"></div>
            <p style={{ marginTop: "12px" }}>Connecting to live dispatch stream...</p>
          </div>
        ) : filteredOrders.length ? (
          <div className="list stack-xl">
            {filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCancelled = order.status === "Cancelled";

              return (
                <article className="card order-card-modern" key={order._id}>
                  <div className="card-body stack-md">
                    {/* Top Meta Bar */}
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

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {canEditStatus ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="text-xs muted font-medium">Update Status:</span>
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
                              fontWeight: 700,
                              fontSize: "var(--text-xs)",
                            }}
                          >
                            {order.status}
                          </span>
                        )}

                        <button
                          type="button"
                          className="btn ghost-btn btn-sm-rounded"
                          onClick={() => setActiveReceiptOrder(order)}
                          title="View Itemized Receipt"
                        >
                          📄 Receipt
                        </button>
                      </div>
                    </div>

                    {/* Visual Progress Stepper (Except for Cancelled) */}
                    {!isCancelled ? (
                      <div className="order-stepper-container">
                        <div className="stepper-track">
                          <div
                            className="stepper-progress-fill"
                            style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="stepper-nodes-row">
                          {ORDER_STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            return (
                              <div
                                key={step}
                                className={`stepper-node ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                              >
                                <div className="stepper-circle">
                                  {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span className="stepper-label">{step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="order-cancelled-banner">
                        <span>⚠️ Order Cancelled • Any charges have been refunded to the original payment method.</span>
                      </div>
                    )}

                    {/* Ordered Items List */}
                    <div className="list stack-xs" style={{ background: "rgba(255,255,255,0.015)", padding: "var(--space-2xs)", borderRadius: "var(--radius-sm)" }}>
                      {order.items.map((item, idx) => (
                        <div
                          className="cart-item"
                          key={`${order._id}-${idx}`}
                          style={{ borderBottom: "none", padding: "var(--space-2xs) 0" }}
                        >
                          <img
                            src={item.imageURL || fallbackImage(item.title)}
                            alt={item.title}
                            style={{ width: "52px", height: "52px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                          />
                          <div className="between" style={{ flex: 1 }}>
                            <div className="stack" style={{ gap: "2px" }}>
                              <strong style={{ fontSize: "var(--text-base)" }}>{item.title}</strong>
                              <span className="muted text-sm">Qty: {item.quantity} × {currency(item.price)}</span>
                            </div>
                            <strong className="price">{currency(item.price * item.quantity)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination Address */}
                    {order.deliveryAddress && (
                      <div
                        style={{
                          padding: "10px 14px",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <span className="eyebrow" style={{ fontSize: "10px", margin: 0 }}>
                          Delivery Destination
                        </span>
                        <p className="muted" style={{ fontSize: "var(--text-sm)", margin: "4px 0 0" }}>
                          📍 {order.deliveryAddress}
                          {order.buyer?.phoneNumber && (
                            <span style={{ marginLeft: "12px", opacity: 0.85 }}>
                              • Contact: {order.buyer.phoneNumber}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Card Bottom: Total & Actions */}
                    <div
                      className="between"
                      style={{ paddingTop: "var(--space-sm)", borderTop: "1px solid var(--color-border)", alignItems: "center" }}
                    >
                      <div className="stack" style={{ gap: "2px" }}>
                        <span className="muted text-xs">Total Amount Paid</span>
                        <strong style={{ fontSize: "var(--text-xl)", color: "var(--color-accent)" }}>
                          {currency(order.payment)}
                        </strong>
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          className="btn ghost-btn btn-sm-rounded"
                          onClick={() => reorderItems(order)}
                        >
                          ↻ Reorder Items
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon-wrap">🍽️</div>
            <h3>No orders found</h3>
            <p>
              {statusFilter !== "all"
                ? `No orders matching status "${statusFilter}". Try choosing "All Orders".`
                : "Your order history is clean. Ready to explore signature culinary creations?"}
            </p>
            {!isAdmin && !isVendor && (
              <Link className="btn primary-btn" style={{ marginTop: "var(--space-md)" }} to="/menu">
                Explore Tasting Menu
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Itemized Receipt Modal */}
      {activeReceiptOrder && (
        <OrderReceiptModal
          order={activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
        />
      )}
    </>
  );
}

export default Orders;
