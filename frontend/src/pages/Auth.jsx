import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuth } from "../lib/api";
import { showToast } from "../lib/utils";

function Auth() {
  const [view, setView] = useState("login"); // 'login' | 'register' | 'reset'
  const navigate = useNavigate();

  const submitLogin = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(Object.fromEntries(form.entries())) });
      setAuth({ token: data.token, user: data.user });
      window.dispatchEvent(new Event("plateful:auth"));
      navigate("/");
    } catch (error) {
      showToast(error.message);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    form.address = [form.address];
    try {
      await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
      showToast("Account created. Please login.");
      setView("login");
    } catch (error) {
      showToast(error.message);
    }
  };

  const submitResetPassword = async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await api("/user/resetpassword", { method: "POST", body: JSON.stringify(form) });
      showToast("Password updated successfully");
      setView("login");
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <>
      <section className="section stack-lg" style={{ textAlign: "center", maxWidth: "800px", margin: "var(--space-3xl) auto var(--space-xl)" }}>
        <div className="eyebrow" style={{ justifyContent: "center" }}>Authentication</div>
        <h1>{view === "login" ? "Welcome Back" : view === "register" ? "Join the Elite" : "Security Recovery"}</h1>
        <p className="muted">
          {view === "login" ? "Access your personalized gourmet dashboard and track your orders in real-time." : 
           view === "register" ? "Create your profile to explore the finest kitchens and enjoy premium delivery." :
           "Verify your identity to establish a new secure access key for your account."}
        </p>
      </section>

      <section className="section" style={{ display: "flex", justifyContent: "center" }}>
        <article className="card" style={{ maxWidth: "540px", width: "100%" }}>
          <div className="card-body">
            {view === "login" && (
              <>
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Sign In</div>
                  <h2>Identity Access</h2>
                </div>
                <form className="stack-form" onSubmit={submitLogin}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" placeholder="e.g. alex@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Security Password</label>
                    <input name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Access Account</button>
                  
                  <div style={{ marginTop: "var(--space-md)", textAlign: "center" }} className="stack">
                    <p className="text-sm muted">Don't have an account yet?</p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button type="button" className="btn-text-only" onClick={() => setView("register")}>Create Profile</button>
                      <span className="muted">•</span>
                      <button type="button" className="btn-text-only" onClick={() => setView("reset")}>Forgot Password?</button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {view === "register" && (
              <>
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Registration</div>
                  <h2>Create Profile</h2>
                </div>
                <form className="stack-form" onSubmit={submitRegister}>
                  <div className="form-group">
                    <label className="form-label">Full Identity Name</label>
                    <input name="Username" placeholder="e.g. Alex Rivera" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input name="email" type="email" placeholder="alex@choice.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input name="phone" placeholder="+1 (555) 000" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Destination</label>
                    <input name="address" placeholder="123 Gourmet St, Suite 100" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Security Answer</label>
                      <input name="answer" placeholder="Your secret key" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input name="password" type="password" placeholder="••••••••" required />
                    </div>
                  </div>
                  <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Establish Membership</button>
                  
                  <div style={{ marginTop: "var(--space-md)", textAlign: "center" }} className="stack">
                    <p className="text-sm muted">Already a member?</p>
                    <button type="button" className="btn-text-only" onClick={() => setView("login")}>Back to Login</button>
                  </div>
                </form>
              </>
            )}

            {view === "reset" && (
              <>
                <div className="form-header">
                  <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Recovery</div>
                  <h2>Reset Credentials</h2>
                </div>
                <form className="stack-form" onSubmit={submitResetPassword}>
                  <div className="form-group">
                    <label className="form-label">Registered Email</label>
                    <input name="email" type="email" placeholder="alex@example.com" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Security Answer</label>
                      <input name="answer" placeholder="Verification key" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input name="newPassword" type="password" placeholder="••••••••" required />
                    </div>
                  </div>
                  <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Update Security Key</button>
                  
                  <div style={{ marginTop: "var(--space-md)", textAlign: "center" }} className="stack">
                    <button type="button" className="btn-text-only" onClick={() => setView("login")}>Back to Login</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </article>
      </section>
    </>
  );
}

export default Auth;
