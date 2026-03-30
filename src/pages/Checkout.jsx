import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";
import { usePost } from "../hooks/usePost";
import Loader from "../components/Loader";
import { useCart } from "./../context/CartContext";

// Constants
const PAYMENT_METHODS = {
  ONLINE: "CASH"
};

const FIELD_CONFIG = {
  EMAIL: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" },
  PHONE: { regex: /^\d{10}$/, message: "Please enter a valid 10-digit phone number" }
};

const Checkout = () => {
  const navigate = useNavigate();
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const { 
    cartItems, 
    cartSubtotal, 
    cartData,
    isLoading: cartLoading, 
    refreshCart 
  } = useCart();

  const { data: orderResponse, loading: orderLoading, error: orderError, execute: placeOrder } = usePost("checkout/place-order");
  const { data: qrData, loading: qrLoading, error: qrError, execute: generateQR } = usePost("generate-qr");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null);

  const isProcessing = orderLoading || qrLoading;

  // Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // Get cart ID from cartData
  useEffect(() => {
    if (cartData?.id) setCartId(cartData.id);
  }, [cartData]);

  // Map cart items to checkout format
  useEffect(() => {
    if (!cartItems?.length) return;

    const getImageName = (imageUrl) => imageUrl?.split('/').pop() || '';
    
    const formattedItems = cartItems.map(item => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || item.qty || 1);
      
      return {
        id: item.id,
        cart_item_id: item.id,
        ebook_id: item.ebookId || item.id,
        qty: quantity,
        name: item.name || item.title || "Product",
        oldPrice: Number(item.oldPrice || item.old_price || 0),
        newPrice: price,
        total: price * quantity,
        desc: item.description || "",
        img: getImageName(item.image)
      };
    });

    setOrderItems(formattedItems);
    setSubtotal(cartSubtotal);
  }, [cartItems, cartSubtotal]);

  // Refresh cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate email
    if (!FIELD_CONFIG.EMAIL.regex.test(formData.email)) {
      alert(FIELD_CONFIG.EMAIL.message);
      return false;
    }

    // Validate phone
    if (!FIELD_CONFIG.PHONE.regex.test(formData.phone)) {
      alert(FIELD_CONFIG.PHONE.message);
      return false;
    }

    return true;
  }, [formData]);

  // Handle order placement
  const handlePlaceOrder = useCallback(async () => {
    if (!validateForm()) return;
    
    if (!userId) {
      alert("User information not found. Please login again.");
      navigate("/login");
      return;
    }

    if (!orderItems.length) {
      alert("Your cart is empty. Please add items to checkout.");
      return;
    }

    if (!cartId) {
      alert("Cart not found. Please refresh the page.");
      return;
    }

    try {
      const orderPayload = {
        user_id: userId,
        cart_id: cartId,
        phone_number: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        pincode: formData.pincode,
        payment_method: PAYMENT_METHODS.ONLINE
      };

      const orderResult = await placeOrder(orderPayload);

      if (orderResult?.status === true) {
        const orderNo = orderResult.order?.order_no || orderResult.order_no;
        
        if (orderNo) {
          const qrPayload = {
            orderid: orderNo,
            amount: subtotal,
            buyer_email: formData.email,
            buyer_phone: formData.phone
          };
          
          const qrResult = await generateQR(qrPayload);

          if (qrResult?.response?.status === "success") {
            const orderData = {
              orderId: orderNo,
              orderDbId: orderResult.order?.id || orderResult.id,
              qrData: qrResult.response.data,
              cartItems: orderItems,
              subtotal,
              email: formData.email,
              phone: formData.phone,
              billingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                country: formData.country
              }
            };

            sessionStorage.setItem("orderData", JSON.stringify(orderData));
            navigate('/order');
          } else {
            alert(qrResult?.message || "Failed to generate QR. Please try again.");
          }
        } else {
          alert("Order placed but no order number received.");
          navigate('/my-account/orders');
        }
      } else {
        const errorMessages = orderResult?.errors 
          ? Object.values(orderResult.errors).flat().join('\n')
          : orderResult?.message || "Failed to place order";
        alert(errorMessages);
      }
    } catch (err) {
      const errorMessages = err?.errors 
        ? Object.values(err.errors).flat().join('\n')
        : err?.message || "Something went wrong while processing your order";
      alert(errorMessages);
    }
  }, [validateForm, userId, orderItems, cartId, formData, placeOrder, subtotal, generateQR, navigate]);

  // Memoized order summary
  const OrderSummary = useMemo(() => {
    if (!orderItems.length) {
      return <p className="text-gray-500 text-sm">Your cart is empty</p>;
    }

    return (
      <div className="space-y-4">
        {orderItems.map(item => (
          <div key={item.id} className="flex gap-4">
            <div className="relative">
              <img
                src={`${IMG_URL}/${item.img}`}
                alt={item.name}
                className="w-14 h-14 rounded border object-cover"
                loading="lazy"
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
                <h3 className="text-sm font-semibold line-clamp-2">{item.name}</h3>
                <p className="text-sm font-semibold text-[#4b2c2c] whitespace-nowrap">
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
            </div>
          </div>
        ))}
      </div>
    );
  }, [orderItems, IMG_URL]);

  // Memoized totals
  const Totals = useMemo(() => (
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
  ), [subtotal]);

  if (cartLoading) return <Loader />;

  return (
    <>
      <Cartprocess />

      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT SIDE FORM */}
            <div className="lg:col-span-2 space-y-6">
              <p className="text-sm text-gray-700 mb-8">
                Terms & Conditions – Omisha Jewels{" "}
                <span className="text-gray-400">↗</span>
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold mb-2">Contact information</h2>
                <p className="text-sm text-gray-600 mb-5">
                  We'll use this email to send order updates.
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Billing Address */}
              <div className="space-y-2 mt-6">
                <h2 className="text-2xl font-semibold mb-2">Billing address</h2>

                <input
                  type="text"
                  name="country"
                  placeholder="Country *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-2 transition"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  className="w-full border px-4 py-3 rounded outline-none focus:border-black mt-2 transition"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="PIN Code *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone *"
                    className="w-full border px-4 py-3 rounded outline-none focus:border-black transition"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                  <span className="font-semibold text-gray-700">Pay Online (UPI/Card/NetBanking)</span>
                </div>
                
                {(orderError || qrError) && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm">
                    {orderError && `Order failed: ${typeof orderError === 'object' ? JSON.stringify(orderError) : orderError}`}
                    {qrError && `QR generation failed: ${typeof qrError === 'object' ? JSON.stringify(qrError) : qrError}`}
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-5">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !orderItems.length || !cartId}
                    className={`bg-[#4b2c2c] hover:bg-[#3b2222] text-white font-semibold px-10 py-3 rounded w-full md:w-auto transition ${
                      isProcessing || !orderItems.length || !cartId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "PLACE ORDER"
                    )}
                  </button>
                </div>
                
                {!cartId && orderItems.length > 0 && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    ⚠️ Cart ID not found. Please refresh the page.
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE SUMMARY */}
            <div className="border rounded-lg p-6 h-fit space-y-4">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              {OrderSummary}
              {Totals}
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