import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { usePost } from "../hooks/usePost";
import { useDelete } from "../hooks/useDelete";

const PaymentModal = ({ isOpen, status, message, orderId, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {status === "success" ? (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-4xl">✓</span>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-4xl">✗</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {status === "success" ? "Payment Successful!" : "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-4">{message}</p>

          {status === "success" && orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              status === "success" 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {status === "success" ? "View My Orders" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderComplete = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  
  // Use ref instead of state for polling count
  const pollingCountRef = useRef(0);
  const [cartCleared, setCartCleared] = useState(false);
  const [userLeftPage, setUserLeftPage] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(120);
  const timerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const pollingTimeoutRef = useRef(null);
  
  const isMounted = useRef(true);

  const { executeDelete: clearCart } = useDelete("cart/clear");
  const { loading: paymentLoading, error: paymentError, execute: checkPaymentStatus } = usePost("check-status");

  // Stabilize checkPaymentStatus with ref
  const checkPaymentStatusRef = useRef(checkPaymentStatus);
  useEffect(() => {
    checkPaymentStatusRef.current = checkPaymentStatus;
  }, [checkPaymentStatus]);

  // ================ NAVIGATION PREVENTION WITH ALERTS ONLY ================
  useEffect(() => {
    if (paymentStatus === "pending") {
      console.log("🚫 Navigation prevention activated");
      
      // 1. Block browser back/forward navigation
      const handlePopState = (event) => {
        event.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
        alert("⚠️ Please complete the payment or wait for timeout before navigating away.");
      };

      // Push initial state to prevent back navigation
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);

      // 2. Prevent beforeunload to show warning when trying to close tab
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'Payment is in progress. Are you sure you want to leave?';
        return 'Payment is in progress. Are you sure you want to leave?';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      // 3. Intercept ALL link clicks (header, footer, any navigation)
      const handleLinkClick = (e) => {
        // Find if clicked element is a link or inside a link
        const link = e.target.closest('a');
        const button = e.target.closest('button');
        
        // Check if it's the cancel button (allow it)
        if (button?.getAttribute('data-cancel') === 'true') {
          return; // Allow cancel button
        }
        
        // Block all other navigation links
        if (link) {
          const href = link.getAttribute('href');
          // Allow only empty links or anchor links
          if (href && href !== '#' && !href.startsWith('#')) {
            e.preventDefault();
            e.stopPropagation();
            alert("⚠️ Please complete the payment before navigating to other pages.");
            return false;
          }
        }
        
        // Block any button that might cause navigation (except cancel)
        if (button && button.getAttribute('data-cancel') !== 'true') {
          // Check if button might be a navigation button
          if (button.onclick || button.form || button.type === 'submit') {
            e.preventDefault();
            e.stopPropagation();
            alert("⚠️ Please complete the payment before performing this action.");
            return false;
          }
        }
      };

      // Add event listeners with capture phase to catch all clicks
      document.addEventListener('click', handleLinkClick, true);
      
      // Also intercept keyboard navigation (Ctrl+Click, etc.)
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Click') {
          e.preventDefault();
          alert("⚠️ Please complete the payment before opening links in new tab.");
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        console.log("🚫 Navigation prevention deactivated");
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('click', handleLinkClick, true);
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore original history state
        window.history.replaceState(null, '', window.location.pathname);
      };
    }
  }, [paymentStatus]);

  // Load order data
  useEffect(() => {
    const storedData = sessionStorage.getItem("orderData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setOrderData(parsedData);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        navigate("/checkout");
      }, 100);
    }
    
    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  // 2-minute timer
  useEffect(() => {
    if (paymentStatus !== "pending" || !orderData) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (paymentStatus === "pending") {
            setPaymentStatus("timeout");
            setModalStatus("failed");
            setModalMessage("Payment time expired. Please try again.");
            setShowModal(true);
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            if (pollingTimeoutRef.current) {
              clearTimeout(pollingTimeoutRef.current);
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentStatus, orderData]);

  // Clear cart function
  const clearUserCart = async () => {
    if (paymentStatus !== "completed" || cartCleared) return;
    
    try {
      await clearCart();
      setCartCleared(true);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Handle go back - mark cancel button with data attribute
  const handleGoBack = () => {
    if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setUserLeftPage(true);
    navigate("/checkout");
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    navigate(modalStatus === "success" ? "/my-account/orders" : "/checkout");
  };

  // ================ MAIN PAYMENT VERIFICATION - FIXED ================
  useEffect(() => {
    // Initial checks
    if (!orderData?.orderId || !orderData?.qrData?.ap_transactionid) return;
    if (paymentStatus !== "pending") return;
    if (userLeftPage) return;

    const MINIMUM_WAIT = 5000; // 5 seconds
    const POLLING_INTERVAL = 5000; // 5 seconds
    const MAX_ATTEMPTS = 24; // 2 minutes total

    let isActive = true;

    const verifyPayment = async () => {
      if (!isActive) return;
      if (paymentStatus !== "pending" || userLeftPage) return;

      // Check max attempts using ref
      if (pollingCountRef.current >= MAX_ATTEMPTS) {
        if (paymentStatus === "pending") {
          setPaymentStatus("timeout");
          setModalStatus("failed");
          setModalMessage("Payment time expired. Please try again.");
          setShowModal(true);
          
          if (timerRef.current) clearInterval(timerRef.current);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
        return;
      }

      try {
        const transactionId = orderData.qrData.ap_transactionid;
        const rrn = orderData.qrData.rrn || '';
        
        //console.log(`📞 Check-status API call attempt ${pollingCountRef.current + 1}/${MAX_ATTEMPTS}`);
        
        const response = await checkPaymentStatusRef.current({
          ap_transactionid: transactionId,
          order_no: orderData.orderId,
          rrn: rrn,
          _t: Date.now() // Prevent caching
        });

        if (response?.status === "error") {
          console.log("API error, continuing polling");
          pollingCountRef.current += 1;
          return;
        }

        const airpayResponse = response?.response;
        if (!airpayResponse) {
          console.log("Invalid response, continuing polling");
          pollingCountRef.current += 1;
          return;
        }

        // Handle 108 - keep polling (normal before payment)
        if (airpayResponse.status_code === "108") {
          console.log("108 received - transaction pending, continuing polling");
          pollingCountRef.current += 1;
          return;
        }

        // Check order status from backend
        if (response.order_status) {
          if (response.order_status === "completed") {
            console.log("✅ Payment completed!");
            setPaymentStatus("completed");
            await clearUserCart();
            
            if (timerRef.current) clearInterval(timerRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            
            setModalStatus("success");
            setModalMessage("Your payment has been processed successfully.");
            setShowModal(true);
            return;
            
          } else if (response.order_status === "failed") {
            console.log("❌ Payment failed!");
            setPaymentStatus("failed");
            
            if (timerRef.current) clearInterval(timerRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            
            setModalStatus("failed");
            setModalMessage("Payment failed. Please try again.");
            setShowModal(true);
            return;
          }
        }

        // Check airpay response
        if (airpayResponse.status_code === "200" && airpayResponse.status === "success") {
          const paymentData = airpayResponse.data || {};
          const txnStatus = paymentData.transaction_payment_status;
          
          if (txnStatus === "SUCCESS") {
            console.log("✅ Payment completed!");
            setPaymentStatus("completed");
            await clearUserCart();
            
            if (timerRef.current) clearInterval(timerRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            
            setModalStatus("success");
            setModalMessage("Your payment has been processed successfully.");
            setShowModal(true);
            
          } else if (txnStatus === "FAILED") {
            console.log("❌ Payment failed!");
            setPaymentStatus("failed");
            
            if (timerRef.current) clearInterval(timerRef.current);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            
            setModalStatus("failed");
            setModalMessage("Payment failed. Please try again.");
            setShowModal(true);
          } else {
            console.log("Payment pending, continuing polling");
            pollingCountRef.current += 1;
          }
        } else {
          console.log("Unexpected response, continuing polling");
          pollingCountRef.current += 1;
        }

      } catch (error) {
        console.error("Error in verifyPayment:", error);
        pollingCountRef.current += 1;
      }
    };

    // Clear existing timers
    if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    // Reset polling count
    pollingCountRef.current = 0;

    // Set up polling
    pollingTimeoutRef.current = setTimeout(() => {
      if (!isActive) return;
      verifyPayment();
      
      pollingIntervalRef.current = setInterval(() => {
        if (!isActive) return;
        verifyPayment();
      }, POLLING_INTERVAL);
    }, MINIMUM_WAIT);

    // Cleanup
    return () => {
      isActive = false;
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };

  }, [orderData?.orderId, orderData?.qrData?.ap_transactionid, paymentStatus, userLeftPage]); // Removed clearUserCart from deps

  // Clear cart if already successful
  useEffect(() => {
    if (paymentStatus === "completed" && !cartCleared) {
      clearUserCart();
    }
  }, [paymentStatus, cartCleared]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4b2c2c] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const { qrData, cartItems, subtotal, email, phone, billingAddress, orderId: currentOrderId } = orderData;

  return (
    <>
      <PaymentModal
        isOpen={showModal}
        status={modalStatus}
        message={modalMessage}
        orderId={currentOrderId}
        onClose={handleModalClose}
      />

      <div className="w-full bg-gray-50 py-12 min-h-screen">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">

            {paymentStatus === "pending" && (
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Time remaining: {formatTime(timeRemaining)}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center mb-5">
              {paymentStatus === "completed" ? (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-3xl">✓</span>
                </div>
              ) : paymentStatus === "failed" || paymentStatus === "timeout" ? (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-3xl">✗</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {paymentStatus === "completed"
                ? "Payment Successful!"
                : paymentStatus === "failed" || paymentStatus === "timeout"
                ? "Payment Failed"
                : "Complete Your Payment"}
            </h1>

            {currentOrderId && paymentStatus === "pending" && (
              <p className="text-sm text-gray-500 mt-2">
                Order ID: <span className="font-mono">{currentOrderId}</span>
              </p>
            )}

            {paymentLoading && paymentStatus === "pending" && (
              <p className="text-sm text-blue-500 mt-2">
                Checking payment status {pollingCountRef.current > 0 ? `(attempt ${pollingCountRef.current}/24)` : ""}...
              </p>
            )}

            {paymentError && paymentStatus === "pending" && (
              <p className="text-sm text-red-500 mt-2">
                Error checking payment
              </p>
            )}

            {paymentStatus === "pending" && qrData?.qrcode_string && (
              <div className="mt-8 flex flex-col items-center">
                <p className="text-3xl font-bold text-[#4b2c2c] mb-4">
                  ₹{subtotal?.toLocaleString()}
                </p>

                <div className="mb-4 text-gray-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  <span>Waiting for payment confirmation...</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <QRCodeCanvas
                    value={qrData.qrcode_string}
                    size={220}
                    level="H"
                    includeMargin={true}
                    fgColor="#4b2c2c"
                    bgColor="#ffffff"
                  />
                </div>

                <div className="mt-6">
                  <button
                    data-cancel="true"
                    onClick={handleGoBack}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    ← Cancel and return to checkout
                  </button>
                </div>

                {paymentStatus === "pending" && (
                  <p className="text-xs text-amber-600 mt-4">
                    ⚠️ Navigation is disabled while payment is in progress
                  </p>
                )}
              </div>
            )}
          </div>

          {paymentStatus === "completed" && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#4b2c2c] rounded"></span>
                Order Summary
              </h2>

              {cartItems?.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="relative">
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}/${item.img}`}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg border border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                      <span className="absolute -top-2 -right-2 bg-[#4b2c2c] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.newPrice?.toLocaleString()} each</p>
                    </div>
                    <p className="font-semibold text-[#4b2c2c] whitespace-nowrap">₹{item.total?.toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#4b2c2c]">₹{subtotal?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Contact</h3>
                  <p className="text-gray-600">{email}</p>
                  <p className="text-gray-600">{phone}</p>
                </div>
                
                {billingAddress && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Billing Address</h3>
                    <p className="text-gray-600">
                      {typeof billingAddress === 'string' ? billingAddress : 
                        `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}
                        ${billingAddress.address ? `, ${billingAddress.address}` : ''}
                        ${billingAddress.city ? `, ${billingAddress.city}` : ''}
                        ${billingAddress.state ? `, ${billingAddress.state}` : ''}
                        ${billingAddress.pinCode ? ` - ${billingAddress.pinCode}` : ''}
                        ${billingAddress.country ? `, ${billingAddress.country}` : ''}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderComplete;