import React from "react";
import { usePost } from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";

const AuthButton = ({ openLogin }) => {
  const navigate = useNavigate();
  const { execute, loading } = usePost("logout");

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await execute(); // token auto-sent
    } catch (err) {
      console.warn("Logout API failed, clearing token anyway");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {isLoggedIn ? "Logout" : "Login"}
      </h2>

      {isLoggedIn ? (
        <>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>

          <p className="text-gray-500 mt-4">
            You will be logged out from your account
          </p>
        </>
      ) : (
        <>
          <button
            onClick={openLogin}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Login
          </button>

          <p className="text-gray-500 mt-4">
            Please login to access your account
          </p>
        </>
      )}
    </div>
  );
};

export default AuthButton;
