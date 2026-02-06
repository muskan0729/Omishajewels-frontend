import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/footer-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {
        setProducts([
          {
            id: 1,
            name: "ReWork: Change the Way You Work Forever",
            image: "/images/book1.jpg",
            oldPrice: "₹7,000.00",
            price: "₹5,900.00",
          },
          {
            id: 2,
            name: "The Power of Your Subconscious Mind",
            image: "/images/book2.jpg",
            oldPrice: "₹7,000.00",
            price: "₹3,400.00",
          },
        ]);
      });
  }, []);

  /* ACTIVE LINK STYLE */
  const activeLink =
    "font-semibold text-base text-black";
  const normalLink =
    "text-sm text-gray-600 hover:text-black";

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* COMPANY INFO */}
        <div>
          {/* LOGO (INCREASED SIZE) */}
          <img
            src="\src\images\logo.png"
            alt="Omisha Jewels"
            className="w-32 mb-4"
          />

          <h4 className="font-semibold mb-4">
            OMISHA JEWELS OPC PVT LTD
          </h4>

          {/* ADDRESS */}
          <div className="flex gap-3 text-sm text-gray-600 mb-3">
            <MapPin size={18} className="mt-1" />
            <p>
              27 PRESTIGE TOWER INDIRA COMPLEX<br />
              NAVLAKHA, INDORE<br />
              Madhya Pradesh, India
            </p>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <Phone size={16} />
            <span>+91 9300098007</span>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} />
            <span>omishajewels.opc@gmail.com</span>
          </div>
        </div>

        {/* COMPANY INFO LINKS */}
        <div>
          <h4 className="font-semibold mb-4">COMPANY INFO</h4>
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                About us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Contact us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h4 className="font-semibold mb-4">USEFUL LINKS</h4>
          <ul className="space-y-2">
            <li>
              <NavLink to="/privacy-policy" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Privacy Policy
              </NavLink>
            </li>
            <li>
              <NavLink to="/shipping-policy" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Shipping Policy
              </NavLink>
            </li>
            <li>
              <NavLink to="/terms" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Terms & Conditions
              </NavLink>
            </li>
            <li>
              <NavLink to="/refund-policy" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Refund and Cancellation Policy
              </NavLink>
            </li>
            <li>
              <NavLink to="/return-policy" className={({ isActive }) =>
                isActive ? activeLink : normalLink
              }>
                Return Policy
              </NavLink>
            </li>
          </ul>
        </div>

        {/* PRODUCTS (DYNAMIC ONLY) */}
        <div>
          <h4 className="font-semibold mb-4">PRODUCTS</h4>

          <div className="space-y-5">
            {products.map((product) => (
              <div key={product.id} className="flex gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-20 object-cover border"
                />
                <div>
                  <p className="text-sm leading-5">
                    {product.name}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="line-through text-gray-400 mr-2">
                      {product.oldPrice}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      {product.price}
                    </span>
                  </p>
                </div>
              </div>
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

