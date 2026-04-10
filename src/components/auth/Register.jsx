import React, { useState } from "react";
import { usePost } from "../../hooks/usePost";
import { toast } from "sonner";

const Register = ({ switchToLogin, onSuccess }) => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const { loading, execute } = usePost("register");

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });

    // remove error while typing
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    let errors = {};

    if (!formdata.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formdata.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!formdata.password.trim()) {
      errors.password = "Password is required";
    } else if (formdata.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formdata.password_confirmation.trim()) {
      errors.password_confirmation = "Confirm password is required";
    } else if (formdata.password !== formdata.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }

    return errors;
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      const res = await execute(formdata);

      // ❌ if backend failed
      if (!res || !res.access_token) {
        throw new Error(res?.message || "Registration failed");
      }

      /* ================= STORE TOKEN ================= */
      localStorage.setItem("token", res.access_token);

      /* ================= STORE USER (🔥 FIX) ================= */
      const userData = {
        id: res.user_id ?? null,
        name: res.name ?? formdata.name,
        email: res.email ?? formdata.email,
        role: res.role || "user",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Registered successfully 🎉");

      /* ================= CLOSE / SWITCH ================= */
      onSuccess?.(res);

      if (!onSuccess) {
        switchToLogin();
      }

    } catch (err) {
      console.error("Register error:", err);

      // Laravel validation errors
      if (err?.errors) {
        setFormErrors(err.errors);
      }

      toast.error(
        err?.message ||
        err?.error ||
        "Registration failed (try new email)"
      );
    }
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleRegister}>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            className={`mt-1 w-full border px-3 py-2 rounded outline-none ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            }`}
            name="name"
            value={formdata.name}
            onChange={handleChange}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className={`mt-1 w-full border px-3 py-2 rounded outline-none ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            name="email"
            value={formdata.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className={`mt-1 w-full border px-3 py-2 rounded outline-none ${
              formErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            name="password"
            value={formdata.password}
            onChange={handleChange}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className={`mt-1 w-full border px-3 py-2 rounded outline-none ${
              formErrors.password_confirmation
                ? "border-red-500"
                : "border-gray-300"
            }`}
            name="password_confirmation"
            value={formdata.password_confirmation}
            onChange={handleChange}
          />
          {formErrors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.password_confirmation}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-black text-white py-2.5 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="my-6 h-px bg-gray-200" />

      <div className="text-center">
        <button
          onClick={switchToLogin}
          className="text-sm font-medium hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </>
  );
};

export default Register;
