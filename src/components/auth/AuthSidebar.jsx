import Login from "./Login";
import Register from "./Register";
import { useCart } from "./../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const AuthSidebar = ({ open, setOpen, view, setView }) => {
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();

  const handleAuthSuccess = async () => {
    // Refresh cart and wishlist after successful auth
    await refreshCart();
    await refreshWishlist();
    setOpen(false); // Close sidebar
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        bg-black/40 backdrop-blur-sm`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[380px] bg-white shadow-2xl
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {view === "login" ? "Sign in" : "Create Account"}
          </h3>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="p-5">
          {view === "login" ? (
            <Login 
              switchToRegister={() => setView("register")} 
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <Register 
              switchToLogin={() => setView("login")} 
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthSidebar;