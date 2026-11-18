import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../lib/api";
import { cartCount, getFavorites } from "../lib/store";
import { showToast } from "../lib/utils";

export function Layout({ children }) {
  const [auth, setAuthState] = useState(getAuth());
  const [favoriteCount, setFavoriteCount] = useState(getFavorites().length);
  const [currentCartCount, setCurrentCartCount] = useState(cartCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const isAdmin = auth?.user?.userType === "admin";
  const isVendor = auth?.user?.userType === "vendor";

  let links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/orders", label: "Orders" },
  ];

  if (isAdmin) {
    links = [
      { href: "/admin", label: "Admin Panel" },
      { href: "/orders", label: "Global Orders" },
      { href: "/profile", label: "Settings" },
    ];
  } else if (isVendor) {
    links = [
      { href: "/dashboard", label: "Kitchen Dashboard" },
      { href: "/orders", label: "Orders" },
      { href: "/profile", label: "Profile" },
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
    setMobileMenuOpen(false);
    showToast("Signed out successfully", "info");
    navigate("/auth");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setSubscribed(true);
    showToast("Subscribed! Use code LAUNCH50 for Rs 50 off your first meal.", "success");
    setNewsletterEmail("");
  };

  const userInitial = auth?.user?.Username ? auth.user.Username.charAt(0).toUpperCase() : "U";

  return (
    <div className="layout">
      {/* Top Banner Announcement */}
      <div className="announcement-banner">
        <span>🎉 Grand Launch Offer: Use code <strong style={{ color: "var(--color-accent)", letterSpacing: "0.05em" }}>LAUNCH50</strong> for Rs 50 off • Free delivery on orders over Rs 500</span>
      </div>

      <header className="topbar">
        <div className="shell">
          <Link className="brand" to={isAdmin ? "/admin" : isVendor ? "/dashboard" : "/"} onClick={() => setMobileMenuOpen(false)}>
            <span className="brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x2="10" y1="1" y2="4" />
                <line x2="14" y1="1" y2="4" />
              </svg>
            </span>
            <div className="brand-copy">
              <strong>Plateful</strong>
              <small>{isAdmin ? "Admin Console" : isVendor ? "Vendor Hub" : "Artisanal Kitchens"}</small>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav desktop-nav">
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
              <Link className="btn ghost-btn nav-utility" to="/menu?saved=1" title="Saved Favorites">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="pill dark-pill">{favoriteCount}</span>
              </Link>
            )}

            {!isAdmin && !isVendor && (
              <Link className="btn primary-btn nav-cart-btn" to="/cart">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span>Cart</span>
                <span className="pill">{currentCartCount}</span>
              </Link>
            )}

            {auth?.token ? (
              <div className="user-profile-menu">
                <Link to="/profile" className="user-pill-btn" title="View Profile">
                  <div className="user-avatar-sm">
                    {auth.user?.profileImage ? (
                      <img src={auth.user.profileImage} alt={auth.user.Username} />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>
                  <div className="user-meta-condensed">
                    <span className="user-name-label">{auth.user?.Username?.split(" ")[0]}</span>
                    <span className="role-tag-micro">{auth.user?.userType}</span>
                  </div>
                </Link>
                <button className="btn ghost-btn nav-utility logout-btn-sm" type="button" onClick={logout} title="Sign Out">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link className="btn ghost-btn nav-utility" to="/auth">Sign In</Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="btn ghost-btn mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-panel animate-fade-in">
            <nav className="mobile-nav-links">
              {links.map((link) => (
                <NavLink 
                  key={link.href} 
                  to={link.href} 
                  className={({ isActive }) => isActive ? "mobile-link active" : "mobile-link"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAdmin && !isVendor && (
                <Link to="/cart" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Cart ({currentCartCount} items)
                </Link>
              )}
              {auth?.token ? (
                <>
                  <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                    Profile & Settings ({auth.user?.Username})
                  </Link>
                  <button className="mobile-link logout-link" onClick={logout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="shell">
        {children}
      </main>

      {!isAdmin && !isVendor && (
        <footer className="footer">
          <div className="shell">
            {/* Newsletter Subscription Row */}
            <div className="footer-newsletter-card">
              <div className="newsletter-copy">
                <span className="eyebrow" style={{ color: "var(--color-accent)" }}>The Chef's Circle</span>
                <h3>Join Plateful VIP Tasting Club</h3>
                <p className="muted">Get weekly secret chef specials, priority reservation drops, and exclusive coupon codes.</p>
              </div>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..." 
                  required
                />
                <button type="submit" className="btn primary-btn">
                  {subscribed ? "Joined ✓" : "Subscribe"}
                </button>
              </form>
            </div>

            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand">
                  <div className="brand-mark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    </svg>
                  </div>
                  <div className="brand-copy">
                    <strong>Plateful</strong>
                    <small>Culinary Excellence</small>
                  </div>
                </div>
                <p className="muted" style={{ lineHeight: 1.6, marginTop: "var(--space-xs)" }}>
                  Connecting food connoisseurs with award-winning kitchens. Thermal precision delivery keeping every dish chef-temperature fresh.
                </p>
                <div className="social-links-row">
                  <a href="#twitter" aria-label="Twitter" className="social-icon-btn">𝕏</a>
                  <a href="#instagram" aria-label="Instagram" className="social-icon-btn">📸</a>
                  <a href="#linkedin" aria-label="LinkedIn" className="social-icon-btn">💼</a>
                </div>
              </div>

              <div className="footer-links">
                <h4>Culinary</h4>
                <ul>
                  <li><Link to="/menu">Full Tasting Menu</Link></li>
                  <li><Link to="/restaurants">Partner Restaurants</Link></li>
                  <li><Link to="/menu?category=Pizza">Artisan Pizza</Link></li>
                  <li><Link to="/menu?category=Sushi">Omakase Sushi</Link></li>
                  <li><Link to="/menu?category=Desserts">French Pastries</Link></li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Partner with Us</h4>
                <ul>
                  <li><Link to="/auth">Chef & Kitchen Portal</Link></li>
                  <li><Link to="/auth">Merchant Registration</Link></li>
                  <li><Link to="/auth">Courier Fleet Network</Link></li>
                  <li><Link to="/auth">Corporate Catering</Link></li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Company & Legal</h4>
                <ul>
                  <li><Link to="/orders">Order Tracking</Link></li>
                  <li><a href="#about">About Plateful</a></li>
                  <li><a href="#terms">Terms of Service</a></li>
                  <li><a href="#privacy">Privacy & Security</a></li>
                  <li><a href="#faq">Help & Support</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2026 Plateful Technologies Inc. All rights reserved.</p>
              <div className="payment-badges-row">
                <span className="payment-badge">Apple Pay</span>
                <span className="payment-badge">Google Pay</span>
                <span className="payment-badge">Visa</span>
                <span className="payment-badge">Mastercard</span>
                <span className="payment-badge">UPI</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      <div id="toast" className="toast hidden"></div>
    </div>
  );
}
