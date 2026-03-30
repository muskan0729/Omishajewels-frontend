import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { usePost } from "../hooks/usePost";
import { useDelete } from "../hooks/useDelete";

// Constants
const POLLING_CONFIG = {
  MINIMUM_WAIT: 5000,
  INTERVAL: 5000,
  MAX_ATTEMPTS: 24,
  TIMEOUT_SECONDS: 120
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  TIMEOUT: "timeout"
};

const PaymentModal = ({ isOpen, status, message, orderId, onClose }) => {
  if (!isOpen) return null;

  const isSuccess = status === "success";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
              <span className={`${isSuccess ? 'text-green-600' : 'text-red-600'} text-4xl`}>
                {isSuccess ? "✓" : "✗"}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h2>

          <p className="text-gray-600 mb-4">{message}</p>

          {isSuccess && orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isSuccess 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSuccess ? "View My Orders" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderComplete = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(POLLING_CONFIG.TIMEOUT_SECONDS);
  
  const pollingCountRef = useRef(0);
  const timerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const pollingTimeoutRef = useRef(null);
  const isMounted = useRef(true);

  const { executeDelete: clearCart } = useDelete("cart/clear");
  const { loading: paymentLoading, error: paymentError, execute: checkPaymentStatus } = usePost("check-status");
  const checkPaymentStatusRef = useRef(checkPaymentStatus);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Clear cart function
  const clearUserCart = useCallback(async () => {
    if (paymentStatus !== PAYMENT_STATUS.COMPLETED || cartCleared) return;
    try {
      await clearCart();
      setCartCleared(true);
    } catch (error) {
      // Silent fail
    }
  }, [paymentStatus, cartCleared, clearCart]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    navigate(modalStatus === "success" ? "/my-account/orders" : "/checkout");
  }, [modalStatus, navigate]);

  // Handle go back
  const handleGoBack = useCallback(() => {
    [pollingTimeoutRef, pollingIntervalRef, timerRef].forEach(ref => {
      if (ref.current) clearInterval(ref.current);
      if (ref.current?.clearTimeout) ref.current.clearTimeout();
    });
    
    navigate("/checkout");
  }, [navigate]);

  // Load order data
  useEffect(() => {
    const storedData = sessionStorage.getItem("orderData");
    
    if (storedData) {
      setOrderData(JSON.parse(storedData));
      setIsLoading(false);
    } else {
      setTimeout(() => navigate("/checkout"), 100);
    }
    
    return () => { isMounted.current = false; };
  }, [navigate]);

  // Update checkPaymentStatus ref
  useEffect(() => {
    checkPaymentStatusRef.current = checkPaymentStatus;
  }, [checkPaymentStatus]);

  // Timer effect
  useEffect(() => {
    if (paymentStatus !== PAYMENT_STATUS.PENDING || !orderData) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (paymentStatus === PAYMENT_STATUS.PENDING) {
            setPaymentStatus(PAYMENT_STATUS.TIMEOUT);
            setModalStatus("failed");
            setModalMessage("Payment time expired. Please try again.");
            setShowModal(true);
            
            [pollingIntervalRef, pollingTimeoutRef].forEach(ref => {
              if (ref.current) clearInterval(ref.current);
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paymentStatus, orderData]);

  // Navigation prevention
  useEffect(() => {
    if (paymentStatus !== PAYMENT_STATUS.PENDING) return;

    const preventNavigation = (e) => {
      e.preventDefault();
      alert("⚠️ Please complete the payment before navigating away.");
      return false;
    };

    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      const button = e.target.closest('button');
      
      if (button?.getAttribute('data-cancel') === 'true') return;
      
      if (link?.href && link.href !== '#' && !link.href.startsWith('#')) {
        e.preventDefault();
        e.stopPropagation();
        alert("⚠️ Please complete the payment before navigating to other pages.");
        return false;
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Payment is in progress. Are you sure you want to leave?';
      return e.returnValue;
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', preventNavigation);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      window.removeEventListener('popstate', preventNavigation);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleLinkClick, true);
      window.history.replaceState(null, '', window.location.pathname);
    };
  }, [paymentStatus]);

  // Payment verification
  useEffect(() => {
    if (!orderData?.orderId || !orderData?.qrData?.ap_transactionid || 
        paymentStatus !== PAYMENT_STATUS.PENDING) return;

    let isActive = true;

    const verifyPayment = async () => {
      if (!isActive || paymentStatus !== PAYMENT_STATUS.PENDING) return;

      if (pollingCountRef.current >= POLLING_CONFIG.MAX_ATTEMPTS) {
        setPaymentStatus(PAYMENT_STATUS.TIMEOUT);
        setModalStatus("failed");
        setModalMessage("Payment time expired. Please try again.");
        setShowModal(true);
        
        [timerRef, pollingIntervalRef, pollingTimeoutRef].forEach(ref => {
          if (ref.current) clearInterval(ref.current);
        });
        return;
      }

      try {
        const { ap_transactionid, rrn = '' } = orderData.qrData;
        
        const response = await checkPaymentStatusRef.current({
          ap_transactionid,
          order_no: orderData.orderId,
          rrn,
          _t: Date.now()
        });

        if (!response) {
          pollingCountRef.current++;
          return;
        }

        // Check order status from backend
        if (response.order_status === "completed") {
          setPaymentStatus(PAYMENT_STATUS.COMPLETED);
          await clearUserCart();
          clearIntervals();
          setModalStatus("success");
          setModalMessage("Your payment has been processed successfully.");
          setShowModal(true);
          return;
        }
        
        if (response.order_status === "failed") {
          setPaymentStatus(PAYMENT_STATUS.FAILED);
          clearIntervals();
          setModalStatus("failed");
          setModalMessage("Payment failed. Please try again.");
          setShowModal(true);
          return;
        }

        // Check Airpay response
        const airpayResponse = response?.response;
        if (airpayResponse?.status_code === "200" && airpayResponse?.status === "success") {
          const txnStatus = airpayResponse.data?.transaction_payment_status;
          
          if (txnStatus === "SUCCESS") {
            setPaymentStatus(PAYMENT_STATUS.COMPLETED);
            await clearUserCart();
            clearIntervals();
            setModalStatus("success");
            setModalMessage("Your payment has been processed successfully.");
            setShowModal(true);
          } else if (txnStatus === "FAILED") {
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            clearIntervals();
            setModalStatus("failed");
            setModalMessage("Payment failed. Please try again.");
            setShowModal(true);
          } else {
            pollingCountRef.current++;
          }
        } else if (airpayResponse?.status_code !== "108") {
          pollingCountRef.current++;
        } else {
          pollingCountRef.current++;
        }

      } catch (error) {
        pollingCountRef.current++;
      }
    };

    const clearIntervals = () => {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };

    pollingCountRef.current = 0;
    
    pollingTimeoutRef.current = setTimeout(() => {
      if (!isActive) return;
      verifyPayment();
      
      pollingIntervalRef.current = setInterval(() => {
        if (!isActive) return;
        verifyPayment();
      }, POLLING_CONFIG.INTERVAL);
    }, POLLING_CONFIG.MINIMUM_WAIT);

    return () => {
      isActive = false;
      clearIntervals();
    };
  }, [orderData?.orderId, orderData?.qrData?.ap_transactionid, paymentStatus, clearUserCart]);

  // Clear cart on completion
  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.COMPLETED && !cartCleared) {
      clearUserCart();
    }
  }, [paymentStatus, cartCleared, clearUserCart]);

  // Memoized components
  const StatusIcon = useMemo(() => {
    if (paymentStatus === PAYMENT_STATUS.COMPLETED) {
      return { bg: "bg-green-100", icon: "✓", color: "text-green-600" };
    }
    if (paymentStatus === PAYMENT_STATUS.FAILED || paymentStatus === PAYMENT_STATUS.TIMEOUT) {
      return { bg: "bg-red-100", icon: "✗", color: "text-red-600" };
    }
    return { bg: "bg-yellow-100", icon: null, color: "" };
  }, [paymentStatus]);

  const StatusSpinner = useMemo(() => {
    if (paymentStatus !== PAYMENT_STATUS.PENDING) return null;
    return <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />;
  }, [paymentStatus]);

  const OrderSummary = useMemo(() => {
    if (paymentStatus !== PAYMENT_STATUS.COMPLETED || !orderData) return null;
    
    const { cartItems = [], subtotal = 0, email = '', phone = '', billingAddress = '' } = orderData;
    const IMG_URL = import.meta.env.VITE_IMG_URL;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#4b2c2c] rounded"></span>
          Order Summary
        </h2>

        {cartItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-100 pb-4 mb-4 gap-4">
            <div className="flex items-center gap-4 w-full">
              <div className="relative">
                <img
                  src={`${IMG_URL}/${item.img}`}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg border border-gray-200 object-cover"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
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
    );
  }, [paymentStatus, orderData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4b2c2c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const { qrData, subtotal, orderId: currentOrderId } = orderData;
  const isPending = paymentStatus === PAYMENT_STATUS.PENDING;
  const isCompleted = paymentStatus === PAYMENT_STATUS.COMPLETED;
  const isFailed = paymentStatus === PAYMENT_STATUS.FAILED || paymentStatus === PAYMENT_STATUS.TIMEOUT;

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

            {isPending && (
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
              {isCompleted ? (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-3xl">✓</span>
                </div>
              ) : isFailed ? (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-3xl">✗</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  {StatusSpinner}
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isCompleted
                ? "Payment Successful!"
                : isFailed
                ? "Payment Failed"
                : "Complete Your Payment"}
            </h1>

            {currentOrderId && isPending && (
              <p className="text-sm text-gray-500 mt-2">
                Order ID: <span className="font-mono">{currentOrderId}</span>
              </p>
            )}

            {paymentLoading && isPending && (
              <p className="text-sm text-blue-500 mt-2">
                Checking payment status {pollingCountRef.current > 0 ? `(attempt ${pollingCountRef.current}/${POLLING_CONFIG.MAX_ATTEMPTS})` : ""}...
              </p>
            )}

            {paymentError && isPending && (
              <p className="text-sm text-red-500 mt-2">Error checking payment</p>
            )}

            {isPending && qrData?.qrcode_string && (
              <div className="mt-8 flex flex-col items-center">
                <p className="text-3xl font-bold text-[#4b2c2c] mb-4">
                  ₹{subtotal?.toLocaleString()}
                </p>

                <div className="mb-4 text-gray-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
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

                <p className="text-xs text-amber-600 mt-4">
                  ⚠️ Navigation is disabled while payment is in progress
                </p>
              </div>
            )}
          </div>

          {OrderSummary}
        </div>
      </div>
    </>
  );
};

export default OrderComplete;