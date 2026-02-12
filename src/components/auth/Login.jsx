import React, { useState } from "react";
import { usePost } from "../../hooks/usePost";
import { syncGuestData } from "../../utils/syncGuestData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const Login = ({ switchToRegister, onSuccess }) => {
  const { execute, loading } = usePost("login");
  const { execute: cartSyncExecute } = usePost("cart/add");
  const { execute: wishlistSyncExecute } = usePost("wishlist");
  const navigate=useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setErrorMessage(null); // clear error when typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await execute(form);
      console.log(res);
      if (!res?.access_token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", res.access_token.split("|")[1]);
      localStorage.setItem("role", res?.role);

      if(res?.role=="admin")
        navigate("/admin");
      // localStorage.setItem("role", res?.role);
      // localStorage.setItem("role", res?.role);
      // console.log(res?.role.split("|")[1]);
      
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
      }
     await syncGuestData(cartSyncExecute, wishlistSyncExecute);
      toast.success("Login Successful 🎉");
      setIsLoggedIn(true);
      onSuccess?.(res);

    } catch (err) {
      console.error("Login failed:", err);

      // Smart error extraction
      if (err?.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err?.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUser(null);
     toast.info("Logged out successfully 👋");
     window.location.href = "/";
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {isLoggedIn ? (
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* ERROR BOX */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 
                              text-sm p-3 rounded text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded 
                         hover:bg-gray-900 transition 
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={switchToRegister}
              className="text-sm font-medium text-black hover:underline"
            >
              Create an Account
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
