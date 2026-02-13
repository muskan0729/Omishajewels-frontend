import { NavLink } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useGet } from "../../hooks/useGet";

export default function Footer() {
  const { data, loading } = useGet("products");
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const products = data?.data?.data?.slice(0, 3) || [];

  const companyLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  const policyLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/shipping-policy", label: "Shipping Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/refund-policy", label: "Refund Policy" },
    { to: "/return-policy", label: "Return Policy" },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-200 mt-24">
      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* BRAND INFO */}
        <div className="space-y-6">


          <p className="text-sm text-neutral-400 leading-relaxed">
            Discover timeless elegance with handcrafted jewellery designed
            to celebrate your most precious moments.
          </p>

          {/* CONTACT INFO */}
          <div className="space-y-4 text-sm text-neutral-400">
            <div className="flex gap-3">
              <MapPin size={18} className="text-amber-400 mt-1" />
              <span>
                27 Prestige Tower, Indira Complex<br />
                Navlakha, Indore<br />
                Madhya Pradesh, India
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-amber-400" />
              <span>+91 9300098007</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-amber-400" />
              <span>omishajewels.opc@gmail.com</span>
            </div>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 pt-4">
            {[Facebook, Instagram, Twitter].map((Icon, index) => (
              <div
                key={index}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-amber-400 hover:text-black transition duration-300 cursor-pointer"
              >
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h4 className="text-sm uppercase tracking-widest text-amber-400 mb-6">
            Company
          </h4>

          <ul className="space-y-3 text-sm">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-neutral-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* POLICIES */}
        <div>
          <h4 className="text-sm uppercase tracking-widest text-amber-400 mb-6">
            Policies
          </h4>

          <ul className="space-y-3 text-sm">
            {policyLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="text-neutral-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* FEATURED PRODUCTS */}
        <div>
          <h4 className="text-sm uppercase tracking-widest text-amber-400 mb-6">
            Featured Products
          </h4>

          {loading && (
            <p className="text-sm text-neutral-500">Loading...</p>
          )}

          {!loading && products.length === 0 && (
            <p className="text-sm text-neutral-500">
              No products available
            </p>
          )}

          <div className="space-y-5">
            {products.map((product) => {
              const imageName = product.image?.split("/").pop();
              const imageSrc = imageName
                ? `${IMG_URL}${imageName}`
                : "/no-image.png";

              return (
                <NavLink
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="flex gap-4 group"
                >
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="w-16 h-20 object-cover rounded-md border border-neutral-800 group-hover:border-amber-400 transition"
                  />

                  <div>
                    <p className="text-sm text-neutral-300 group-hover:text-white transition line-clamp-2">
                      {product.title}
                    </p>

                    <p className="text-sm mt-1 text-amber-400 font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>



      {/* BOTTOM BAR */}
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Omisha Jewels. All Rights Reserved.
      </div>
    </footer>
  );
}
