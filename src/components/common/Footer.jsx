import { useEffect, useState } from "react";

export default function Footer() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 🔁 Replace with your real API later
    fetch("/api/footer-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {
        // fallback demo data
        setProducts([
          {
            id: 1,
            name: "OLLYNAG Twisted Series Set of 4 Books",
            image: "/images/book1.jpg",
            oldPrice: "₹14,670.00",
            price: "₹9,900.00",
          },
          {
            id: 2,
            name: "Internet Marketing: Integrating Online and Offline Strategies",
            image: "/images/book2.jpg",
            oldPrice: "₹8,999.00",
            price: "₹5,500.00",
          },
        ]);
      });
  }, []);

  return (
    <footer className="bg-white text-gray-700 border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* COMPANY INFO */}
        <div>
          <img
            src="\src\images\logo.png"
            alt="Omisha Jewels"
            className="mb-4 w-24"
          />
          <h4 className="font-semibold mb-3">
            OMISHA JEWELS OPC PVT LTD
          </h4>

          <p className="text-sm leading-6">
            27 PRESTIGE TOWER INDIRA COMPLEX<br />
            NAVLAKHA, INDORE<br />
            Madhya Pradesh, India
          </p>

          <p className="mt-3 text-sm">
            Phone: +91 9300098007
          </p>

          <p className="text-sm">
            omishajewels.opc@gmail.com
          </p>
        </div>

        {/* COMPANY INFO LINKS */}
        <div>
          <h4 className="font-semibold mb-4">COMPANY INFO</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/shop" className="hover:underline">Shop</a></li>
            <li><a href="/about" className="hover:underline">About us</a></li>
            <li><a href="/contact" className="hover:underline">Contact us</a></li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h4 className="font-semibold mb-4">USEFUL LINKS</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/shipping-policy" className="hover:underline">Shipping Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="/refund-policy" className="hover:underline">Refund and Cancellation Policy</a></li>
            <li><a href="/return-policy" className="hover:underline">Return Policy</a></li>
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
