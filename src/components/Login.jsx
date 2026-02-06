import React from "react";

const Login = ({ open, setOpen }) => {
  return (
    <>
      {/* Overlay with fade + blur */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        bg-black/40 backdrop-blur-sm`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[380px] bg-white shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold tracking-wide text-gray-900">
            Sign in
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <form className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username or email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2
                focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2
                focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded bg-black py-2.5 text-white
              font-medium tracking-wide hover:bg-gray-800 transition"
            >
              Log in
            </button>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-black" />
                Remember me
              </label>

              <a
                href="#"
                className="text-gray-700 hover:text-black underline-offset-2 hover:underline"
              >
                Lost password?
              </a>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 h-px bg-gray-200"></div>

          {/* Create Account */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">No account yet?</p>
            <a
              href="#"
              className="text-sm font-medium text-black hover:underline"
            >
              Create an Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
