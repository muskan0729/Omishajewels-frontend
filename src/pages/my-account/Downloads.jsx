import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function Downloads() {
  return (
    <div className="w-full">
      {/* EMPTY STATE NOTICE */}
      <div className="flex items-center gap-3 bg-[#E4B95B] text-white px-6 py-4 rounded-sm max-w-3xl">
        <FiAlertCircle className="text-xl shrink-0" />

        <p className="text-sm font-medium">
          No downloads available yet.
        </p>

        <Link
          to="/shop"
          className="ml-auto text-sm font-semibold underline hover:opacity-90 transition"
        >
          BROWSE PRODUCTS
        </Link>
      </div>
    </div>
  );
}
