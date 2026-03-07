import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import Loader from "../components/Loader";

const Checkout = () => {
  const navigate = useNavigate();
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  // 🔹 Hooks at the top level
  const { data, loading, error } = useGet("cart");

  // ✅ Add placeOrder hook
  const {
    data: orderResponse,
    loading: orderLoading,
    error: orderError,
    execute: placeOrder,
  } = usePost("checkout/place-order");

  const {
    data: qrData,
    loading: qrLoading,
    error: qrError,
    execute: generateQR,
  } = usePost("generate-qr");

  // 🔹 Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // 🔹 Cart & totals state
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null); // Get this from cart data

  // 🔹 Map cart API → checkout UI - Get userId from cart data
  useEffect(() => {
    //console.log("Raw cart data:", data);

    if (data) {
      // Check if data has items
      if (data.items && data.items.length > 0) {
        // Log the entire data object to see all fields
        //console.log("Cart data full object:", JSON.stringify(data, null, 2));

        // Set cart ID
        if (data.id) {
          //console.log("Cart ID found:", data.id);
          setCartId(data.id);
        }

        // ✅ Set userId from cart data
        if (data.user_id) {
          //console.log("User ID found in cart:", data.user_id);
          setUserId(data.user_id);
        }

        const formattedItems = data.items.map((item) => {
          // Calculate total properly since API returns "0.00"
          const price = Number(item.price || 0);
          const quantity = Number(item.quantity || 1);
          const itemTotal = price * quantity;

          return {
            id: item.id,
            cart_item_id: item.id,
            ebook_id: item.ebook?.id,
            qty: quantity,
            name: item.ebook?.title || "Product",
            oldPrice: Number(item.ebook?.price || 0),
            newPrice: price,
            //total: 10,
            total: itemTotal, // Used instead of hardcoded 10
            desc: item.ebook?.description || "",
            img: item.ebook?.image?.split("/").pop() || "",
          };
        });

        setOrderItems(formattedItems);
        setSubtotal(Number(data.subtotal || 0));
      } else {
        //console.log("No items in cart or unexpected structure:", data);
        setOrderItems([]);
        setSubtotal(0);
        setCartId(null);
        setUserId(null);
      }
    }
  }, [data]);

  // 🔹 Loading & error state for cart
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load checkout: {error}
      </div>
    );

  // 🔹 Validate form
  const validateForm = () => {
    if (!email || !phone || !firstName || !lastName || !address || !city || !state || !pincode) {
      alert("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  // 🔹 Handle order placement & QR generation
  // 🔹 Handle order placement & QR generation
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // ✅ Check if we have userId from cart
    if (!userId) {
      console.error("User ID not found in cart data:", data);
      alert("User information not found. Please login again.");
      navigate("/login");
      return;
    }

    //console.log("Current userId from cart:", userId);
    //console.log("Current cartId:", cartId);
    //console.log("Current data:", data);
    //console.log("Current orderItems BEFORE storing:", orderItems); // DEBUG

    if (!cartId) {
      console.error("Cart ID is missing. Current cart data:", data);

      // Try to get cart ID from data one more time
      if (data?.id) {
        setCartId(data.id);
        //console.log("Recovered cart ID:", data.id);
      } else {
        alert("Cart not found. Please refresh the page or add items to cart.");
        return;
      }
    }

    try {
      console.log("Placing order with:", {
        user_id: userId,
        cart_id: cartId || data?.id,
        phone_number: phone,
        address: `${address}, ${city}, ${state} - ${pincode}`,
        pincode: pincode,
        payment_method: "CASH",
      });

      // STEP 1: Place order first
      const orderResult = await placeOrder({
        user_id: userId,
        cart_id: cartId || data?.id,
        phone_number: phone,
        address: `${address}, ${city}, ${state} - ${pincode}`,
        pincode: pincode,
        payment_method: "CASH",
      });

      console.log("Order placed:", orderResult);

      if (orderResult?.status === true) {
        // STEP 2: Generate QR with the order number from database
        const orderNo = orderResult.order.order_no;

        const qrResult = await generateQR({
          orderid: orderNo,
          //amount: 10, // Keep hardcoded for testing
          amount: subtotal, // Used instead of hardcoded 10
          buyer_email: email,
          buyer_phone: phone,
        });

        //console.log("QR Generated:", qrResult);

        if (qrResult?.response?.status === "success") {
          // Debug: Log what Airpay returned
          //console.log("Airpay QR response data:", qrResult.response.data);
          //console.log("ap_transactionid:", qrResult.response.data.ap_transactionid);

          // STEP 3: Format cart items properly for storage
          const formattedCartItems = orderItems.map(item => ({
            id: item.id,
            cart_item_id: item.cart_item_id,
            ebook_id: item.ebook_id,
            qty: item.qty,
            name: item.name,
            oldPrice: item.oldPrice,
            newPrice: item.newPrice,
            total: item.total, // Keep as 10 for testing
            desc: item.desc,
            img: item.img
          }));

          // STEP 4: Store complete order data
          const orderData = {
            orderId: orderNo,
            orderDbId: orderResult.order.id,
            qrData: qrResult.response.data,
            cartItems: formattedCartItems, // Use formatted items
            subtotal: subtotal, // Hardcoded for testing
            email,
            phone,
            billingAddress: {
              firstName,
              lastName,
              address,
              city,
              state,
              pincode,
              country,
            },
          };

          //console.log("✅ Storing order data with cart items:", formattedCartItems);
          //console.log("✅ Cart items count:", formattedCartItems.length);

          // Clear any existing order data first
          sessionStorage.removeItem("orderData");

          // Store new order data
          sessionStorage.setItem("orderData", JSON.stringify(orderData));

          // Verify storage
          const stored = sessionStorage.getItem("orderData");
          const parsed = JSON.parse(stored);
          //console.log("✅ Verified stored cart items:", parsed.cartItems);
          //console.log("✅ Verified stored cart items count:", parsed.cartItems.length);

          navigate('/order');
        } else {
          alert("Failed to generate QR. Please try again.");
        }
      } else {
        alert(orderResult?.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Failed to process order:", err);
      alert("Something went wrong while processing your order");
    }
  };
  // Combined loading state
  const isProcessing = orderLoading || qrLoading;

  return (
    <>
      <Cartprocess currentStep={2} />

      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT SIDE FORM */}
            <div className="lg:col-span-2 space-y-6">
              {/* Terms */}
              <p className="text-sm text-gray-700 mb-8">
                Terms & Conditions – Omisha Jewels{" "}
                <span className="text-gray-400">↗</span>
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold mb-2">
                  Contact information
                </h2>
                <p className="text-sm text-gray-600 mb-5">
                  We'll use this email to send order updates.
                </p>
                <input
                  type="email"
                  placeholder="Email address *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              {/* Billing Address */}
              <div className="space-y-2 mt-6">
                <h2 className="text-2xl font-semibold mb-2">Billing address</h2>

                <input
                  type="text"
                  placeholder="Country *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-2"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="First name *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Address *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="City *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="PIN Code *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Payment options</h2>
                <div className="border rounded p-4 mb-4 flex items-center gap-3 bg-gray-50">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-gray-700">Pay Online</span>

                </div>
                {/* Error displays */}
                {orderError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm">
                    Order failed: {orderError}
                  </div>
                )}

                {qrError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm">
                    QR generation failed: {qrError}
                  </div>
                )}



                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-5">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`bg-[#4b2c2c] hover:bg-[#3b2222] text-white font-semibold px-10 py-3 rounded w-full md:w-auto ${isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      "PLACE ORDER"
                    )}
                  </button>
                </div>

                {/* QR Display - Optional: Show after generation */}
                {qrData && qrData.qr_image && (
                  <div className="mt-6 text-center">
                    <h3 className="font-semibold mb-2">Scan to Pay</h3>
                    <img
                      src={qrData.qr_image}
                      alt="Payment QR"
                      className="mx-auto w-64 h-64"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="border rounded-lg p-6 h-fit space-y-4">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>

              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <img
                          src={`${IMG_URL}/${item.img}`}
                          alt="product"
                          className="w-14 h-14 rounded border object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <span className="absolute -top-2 -right-2 bg-gray-200 text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full">
                          {item.qty}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <h3 className="text-sm font-semibold">{item.name}</h3>
                          <p className="text-sm font-semibold text-[#4b2c2c]">
                            ₹{item.total.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex gap-3 mt-1">
                          <p className="text-xs line-through text-gray-400">
                            ₹{item.oldPrice.toLocaleString()}
                          </p>
                          <p className="text-xs font-semibold text-[#4b2c2c]">
                            ₹{item.newPrice.toLocaleString()}
                          </p>
                        </div>

                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <p>Subtotal</p>
                  <p className="font-semibold">₹{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>Shipping</p>
                  <p className="text-green-600">Free</p>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
                <p>Total</p>
                <p className="text-[#4b2c2c]">₹{subtotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;