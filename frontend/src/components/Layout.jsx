import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../lib/api";
import { cartCount, getFavorites } from "../lib/store";

export function Layout({ children }) {
  const [auth, setAuthState] = useState(getAuth());
  const [favoriteCount, setFavoriteCount] = useState(getFavorites().length);
  const [currentCartCount, setCurrentCartCount] = useState(cartCount());
  const navigate = useNavigate();
  const isAdmin = auth?.user?.userType === "admin";
  const isVendor = auth?.user?.userType === "vendor";

  let links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/orders", label: "Orders" },
    { href: "/profile", label: "Profile" },
    { href: "/cart", label: "Cart" }
  ];

  if (isAdmin) {
    links = [
      { href: "/admin", label: "Admin Panel" },
      { href: "/orders", label: "Orders" },
      { href: "/profile", label: "Profile" }
    ];
  } else if (isVendor) {
    links = [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/orders", label: "Orders" },
      { href: "/profile", label: "Profile" }
    ];
  }

  useEffect(() => {
    const sync = () => {
      setAuthState(getAuth());
      setFavoriteCount(getFavorites().length);
      setCurrentCartCount(cartCount());
    };

    window.addEventListener("storage", sync);
    window.addEventListener("plateful:storage", sync);
    window.addEventListener("plateful:auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("plateful:storage", sync);
      window.removeEventListener("plateful:auth", sync);
    };
  }, []);

  const logout = () => {
    clearAuth();
    setAuthState(null);
    navigate("/auth");
  };

  return (
    <div className="layout">
      <header className="topbar">
        <div className="shell">
          <Link className="brand" to={isAdmin ? "/admin" : isVendor ? "/dashboard" : "/"}>
            <span className="brand-mark">P</span>
            <div className="brand-copy">
              <strong>Plateful</strong>
              <small>{isAdmin ? "Admin" : isVendor ? "Vendor" : "Fresh picks"}</small>
            </div>
          </Link>
          <nav className="nav">
            {links.map((link) => (
              <NavLink 
                key={link.href} 
                to={link.href} 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="actions">
            {!isAdmin && !isVendor && (
              <Link className="btn ghost-btn nav-utility" to="/menu?saved=1">
                Saved <span className="pill dark-pill">{favoriteCount}</span>
              </Link>
            )}
            {auth?.token ? (
              <button className="btn ghost-btn nav-utility" type="button" onClick={logout}>Logout</button>
            ) : (
              <Link className="btn ghost-btn nav-utility" to="/auth">Login</Link>
            )}
            {!isAdmin && !isVendor && (
              <Link className="btn primary-btn nav-cart-btn" to="/cart">
                Cart <span className="pill">{currentCartCount}</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="shell">
        {children}
      </main>

      {!isAdmin && !isVendor && <footer className="footer">
        <div className="shell">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand">
                <div className="brand-mark">P</div>
                <div className="brand-copy">
                  <strong>Plateful</strong>
                  <small>Culinary Excellence</small>
                </div>
              </div>
              <p className="muted">Simple food ordering for local restaurants.</p>
            </div>
            <div className="footer-links">
              <h4>Browse</h4>
              <ul>
                <li><Link to="/menu">Full Menu</Link></li>
                <li><Link to="/restaurants">Restaurants</Link></li>
                <li><Link to="/orders">Track Orders</Link></li>
                <li><Link to="/cart">Checkout</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Plateful Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>}

      <div id="toast" className="toast hidden"></div>
    </div>
  );
}
