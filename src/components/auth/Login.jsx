import React from "react";



const Login = ({ switchToRegister }) => {
  return (
    <>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium">Username or email</label>
          <input className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <button className="w-full bg-black text-white py-2.5 rounded">
          Log in
        </button>
      </form>

      <div className="my-6 h-px bg-gray-200" />

      <div className="text-center">
        <button
          onClick={switchToRegister}
          className="text-sm font-medium hover:underline"
        >
          Create an Account
        </button>
      </div>
    </>
  );
};

export default Login;

