import React, { useState } from "react";
import { usePost } from "../../hooks/usePost";
import { syncGuestData } from "../../utils/syncGuestData";

const Login = ({ switchToRegister, onSuccess }) => {
  const { execute, loading, error } = usePost("login");
    const { execute: cartSyncExecute } = usePost("cart/add");
  const { execute: wishlistSyncExecute } = usePost("wishlist");

  // 🔐 Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // 📝 Form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔑 Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await execute(form);

      // Save token
      localStorage.setItem("token", res.access_token);

      // Save user
      if (res.user) {
        console.log(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        
      }
     await syncGuestData(cartSyncExecute, wishlistSyncExecute);
      setIsLoggedIn(true);
      onSuccess?.(res);

    } catch (err) {
      console.error("Login failed",err);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <>
      {isLoggedIn ? (
        /* ✅ LOGGED-IN VIEW */
        <div className="text-center space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white py-2.5 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        /* ❌ LOGGED-OUT VIEW */
        <>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">
                {error.message || error}
              </p>
            )}

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 h-px bg-gray-200" />

          <div className="text-center">
            <button
              type="button"
              onClick={switchToRegister}
              className="text-sm font-medium hover:underline"
            >
              Create an Account
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
