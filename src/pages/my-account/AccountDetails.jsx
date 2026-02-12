import { useState } from "react";
import { usePost } from "../../hooks/usePost";

const getPasswordStrength = (password) => {
  if (!password) return null;

  if (password.length >= 8) {
    return { label: "Strong password", color: "bg-[#4E9A51]" };
  }

  return {
    label: "Weak - Please enter a stronger password.",
    color: "bg-[#E2B55F]",
  };
};

const AccountDetails = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = getPasswordStrength(password);

  const { execute, loading, error } = usePost("change-password");

  const handleSubmit = async () => {
    // Basic validation
    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await execute({
        current_password: currentPassword,
        new_password: password,
        new_password_confirmation: confirmPassword,
      });


      alert("Password changed successfully");

      // Reset fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl">
      <fieldset className="border border-gray-200 p-6 rounded-md">
        <legend className="px-2 text-lg font-medium">Password change</legend>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            Current password
          </label>
          <input
            type="password"
            className="account-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            New password
          </label>
          <input
            type="password"
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {strength && (
          <div
            className={`${strength.color} text-white text-sm px-4 py-2 rounded mb-4`}
          >
            {strength.label}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            className="account-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error.message || "Something went wrong"}
          </p>
        )}
      </fieldset>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 bg-[#B98A54] text-white px-8 py-3 rounded-full text-sm hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "SAVE CHANGES"}
      </button>
    </div>
  );
};

export default AccountDetails;
