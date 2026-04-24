import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuth, getAuth, setAuth } from "../lib/api";
import { showToast } from "../lib/utils";

function Profile() {
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    api("/user/getuser").then((data) => setUser(data.user));
  }, [auth?.token, navigate]);

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

  return (
    <>
      <section className="section stack-lg">
        <div className="eyebrow">Settings</div>
        <h1>Account Settings</h1>
        <p className="muted">Manage your contact details, delivery address, and password.</p>
      </section>

      <section className="section auth-grid">
        <article className="card">
          <div className="card-body">
            <div className="form-header">
              <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Profile</div>
              <h2>Personal Information</h2>
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
                <label className="form-label">Delivery Address</label>
                <input name="address" placeholder="Enter delivery address" defaultValue={Array.isArray(user?.address) ? user.address[0] : user?.address || ""} />
              </div>
              <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Save Changes</button>
            </form>
          </div>
        </article>

        <article className="card">
          <div className="card-body">
            <div className="form-header">
              <div className="eyebrow" style={{ color: "var(--color-text-muted)" }}>Security</div>
              <h2>Password</h2>
            </div>
            <form className="stack-form" onSubmit={updatePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="password-wrapper">
                  <input name="oldPassword" type={showPassword ? "text" : "password"} placeholder="Enter current password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="password-wrapper">
                  <input name="newPassword" type={showPassword ? "text" : "password"} placeholder="Enter new password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <button className="btn primary-btn btn-lg" style={{ marginTop: "var(--space-xs)" }} type="submit">Update Password</button>
            </form>

            <div className="card-actions stack" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)", marginTop: "var(--space-md)" }}>
              <p className="muted text-xs">Deleting the account removes access and stored profile data.</p>
              <button className="btn ghost-btn" style={{ borderColor: "var(--color-error)", color: "var(--color-error)" }} type="button" onClick={deleteProfile}>Delete Account</button>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

export default Profile;
