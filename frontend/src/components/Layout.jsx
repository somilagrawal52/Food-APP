import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../lib/api";
import { cartCount, getFavorites } from "../lib/store";

export function Layout({ children }) {
  const [auth, setAuthState] = useState(getAuth());
  const [favoriteCount, setFavoriteCount] = useState(getFavorites().length);
  const [currentCartCount, setCurrentCartCount] = useState(cartCount());
  const navigate = useNavigate();

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/orders", label: "Orders" },
    { href: "/profile", label: "Profile" }
  ];

  if (auth?.user?.userType === "vendor" || auth?.user?.userType === "admin") {
    links.splice(4, 0, { href: "/dashboard", label: "Dashboard" });
  }

  if (auth?.user?.userType !== "admin") {
    links.push({ href: "/cart", label: "Cart" });
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

  const isAdmin = auth?.user?.userType === "admin";

  return (
    <div className="layout">
      <header className="topbar">
        <div className="shell">
          <Link className="brand" to="/">
            <span className="brand-mark">P</span>
            <div className="brand-copy">
              <strong>Plateful</strong>
              <small>Fresh picks</small>
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
            {!isAdmin && (
              <Link className="btn ghost-btn nav-utility" to="/menu">
                Saved <span className="pill dark-pill">{favoriteCount}</span>
              </Link>
            )}
            {auth?.token ? (
              <button className="btn ghost-btn nav-utility" type="button" onClick={logout}>Logout</button>
            ) : (
              <Link className="btn ghost-btn nav-utility" to="/auth">Login</Link>
            )}
            {!isAdmin && (
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

      <footer className="footer">
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
              <p className="muted">Redefining home dining with the finest local kitchens and a commitment to artisanal quality.</p>
            </div>
            <div className="footer-links">
              <h4>Discovery</h4>
              <ul>
                <li><Link to="/menu">Full Menu</Link></li>
                <li><Link to="/restaurants">Kitchens</Link></li>
                <li><Link to="/menu?category=Dessert">Sweets</Link></li>
                <li><Link to="/menu?category=Healthy">Healthy</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Artisans</Link></li>
                <li><Link to="/">Careers</Link></li>
                <li><Link to="/">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Terms of Service</Link></li>
                <li><Link to="/">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Plateful Technologies. All rights reserved.</p>
            <div className="stack" style={{ flexDirection: "row", gap: "20px" }}>
              <span>Instagram</span>
              <span>Twitter</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>

      <div id="toast" className="toast hidden"></div>
    </div>
  );
}
