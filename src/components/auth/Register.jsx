import React from "react";

const Register = ({ switchToLogin }) => {
  return (
    <>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <button className="w-full bg-black text-white py-2.5 rounded">
          Register
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

