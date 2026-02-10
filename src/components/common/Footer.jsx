import { NavLink } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useGet } from "../../hooks/useGet";

export default function Footer() {
  // Fetch products using custom hook
  const { data, loading, error } = useGet("products");

  // API response shape:
  // { success: true, data: { current_page: 1, data: [...] } }
  const products = data?.data?.data?.slice(0, 3) || [];

  /* ACTIVE LINK STYLE */
  const activeLink = "font-semibold text-base text-black";
  const normalLink = "text-sm text-gray-600 hover:text-black";

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* COMPANY INFO */}
        <div>
          <img
            src="/src/images/logo.png"
            alt="Omisha Jewels"
            className="w-32 mb-4"
          />

          <h4 className="font-semibold mb-4">
            OMISHA JEWELS OPC PVT LTD
          </h4>

          <div className="flex gap-3 text-sm text-gray-600 mb-3">
            <MapPin size={18} className="mt-1" />
            <p>
              27 PRESTIGE TOWER INDIRA COMPLEX<br />
              NAVLAKHA, INDORE<br />
              Madhya Pradesh, India
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <Phone size={16} />
            <span>+91 9300098007</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} />
            <span>omishajewels.opc@gmail.com</span>
          </div>
        </div>

        {/* COMPANY INFO LINKS */}
        <div>
          <h4 className="font-semibold mb-4">COMPANY INFO</h4>
          <ul className="space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/about", label: "About us" },
              { to: "/contact", label: "Contact us" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h4 className="font-semibold mb-4">USEFUL LINKS</h4>
          <ul className="space-y-2">
            {[
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/shipping-policy", label: "Shipping Policy" },
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/refund-policy", label: "Refund and Cancellation Policy" },
              { to: "/return-policy", label: "Return Policy" },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* PRODUCTS */}
        <div>
          <h4 className="font-semibold mb-4">PRODUCTS</h4>

          {loading && (
            <p className="text-sm text-gray-400">Loading...</p>
          )}

          {!loading && products.length === 0 && (
            <p className="text-sm text-gray-400">
              No products found
            </p>
          )}

          <div className="space-y-5">
            {products.map((product) => (
              <NavLink
                key={product.id}
                to={`/product/${product.slug}`}
                className="flex gap-3 hover:opacity-80"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-20 object-cover border"
                />

                <div>
                  {/* BOOK NAME */}
                  <p className="text-sm font-medium leading-5 line-clamp-2">
                    {product.title}
                  </p>

                  {/* PRICE */}
                  <p className="text-sm mt-1 text-orange-600 font-semibold">
                    ₹{product.price}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        ©2023 omishajewels.com ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
