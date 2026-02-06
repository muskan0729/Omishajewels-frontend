import { useState } from "react";

const getPasswordStrength = (password) => {
  if (!password) return null;

  if (password.length >= 8) {
    return { label: "Strong", color: "bg-[#4E9A51]" };
  }

  return {
    label: "Weak - Please enter a stronger password.",
    color: "bg-[#E2B55F]",
  };
};


const AccountDetails = () => {
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);

  return (
    <div className="max-w-3xl">
      {/* BASIC DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm mb-1">
            First name <span className="text-red-500">*</span>
          </label>
          <input className="account-input" />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Last name <span className="text-red-500">*</span>
          </label>
          <input className="account-input" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-1">
          Display name <span className="text-red-500">*</span>
        </label>
        <input className="account-input" defaultValue="admin" />
        <p className="text-xs text-gray-500 mt-1">
          This will be how your name will be displayed in the account section and in reviews
        </p>
      </div>

      <div className="mb-10">
        <label className="block text-sm mb-1">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="account-input"
          defaultValue="deepak810772@gmail.com"
        />
      </div>

      {/* PASSWORD CHANGE */}
      <fieldset className="border border-gray-200 p-6 rounded-md">
        <legend className="px-2 text-lg font-medium">Password change</legend>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            Current password (leave blank to leave unchanged)
          </label>
          <input type="password" className="account-input" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">
            New password (leave blank to leave unchanged)
          </label>
          <input
            type="password"
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {strength && (
          <div className={`${strength.color} text-white text-sm px-4 py-2 rounded mb-4`}>
            {strength.label}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Confirm new password</label>
          <input type="password" className="account-input" />
        </div>
      </fieldset>

      <button className="mt-6 bg-[#B98A54] text-white px-8 py-3 rounded-full text-sm hover:opacity-90 transition">
        SAVE CHANGES
      </button>
    </div>
  );
};

export default AccountDetails;
