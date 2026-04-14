import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { usePost } from "../hooks/usePost";
import { useDelete } from "../hooks/useDelete";

// ================= CONFIG =================
const POLLING_CONFIG = {
  INTERVAL: 5000,
  MAX_ATTEMPTS: 24,
  TIMEOUT_SECONDS: 120,
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  TIMEOUT: "timeout",
};

// ================= MODAL =================
const PaymentModal = ({ isOpen, status, message, orderId, onClose }) => {
  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}>
            <span className={`text-4xl ${isSuccess ? "text-green-600" : "text-red-600"}`}>
              {isSuccess ? "✓" : "✗"}
            </span>
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
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSuccess ? "View Orders" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= ORDER SUMMARY =================
const OrderSummary = ({ orderData }) => {
  const { cartItems = [], subtotal = 0, email = '', phone = '', billingAddress = {} } = orderData;
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  return (
    <div className="mt-8 bg-white rounded-2xl shadow p-6 text-left">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 border-b pb-4">
            <div className="relative">
              <img
                src={`${IMG_URL}/${item.img}`}
                alt={item.name}
                className="w-16 h-16 rounded object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
              />
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.newPrice?.toLocaleString()} each</p>
            </div>
            <p className="font-semibold">₹{item.total?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-[#4b2c2c]">₹{subtotal?.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="font-semibold">Contact</p>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-600">{phone}</p>
        </div>
        {billingAddress && Object.keys(billingAddress).length > 0 && (
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-semibold">Billing Address</p>
            <p className="text-gray-600 text-sm">
              {typeof billingAddress === 'string' ? billingAddress : 
                `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}
                ${billingAddress.address ? `, ${billingAddress.address}` : ''}
                ${billingAddress.city ? `, ${billingAddress.city}` : ''}
                ${billingAddress.state ? `, ${billingAddress.state}` : ''}
                ${billingAddress.pincode ? ` - ${billingAddress.pincode}` : ''}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= MAIN =================
const OrderComplete = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [timeRemaining, setTimeRemaining] = useState(POLLING_CONFIG.TIMEOUT_SECONDS);
  const [pollingAttempt, setPollingAttempt] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const pollingCount = useRef(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const isChecking = useRef(false);

  const { executeDelete: clearCart } = useDelete("cart/clear");
  const { loading: paymentLoading, error: paymentError, execute: checkPaymentStatus } = usePost("check-status");
  const checkRef = useRef(checkPaymentStatus);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Load order data
  useEffect(() => {
    const data = sessionStorage.getItem("orderData");
    if (!data) {
      navigate("/checkout");
      return;
    }
    setOrderData(JSON.parse(data));
  }, [navigate]);

  useEffect(() => {
    checkRef.current = checkPaymentStatus;
  }, [checkPaymentStatus]);

  const clearAll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleGoBack = useCallback(() => {
    clearAll();
    sessionStorage.removeItem('orderData');
    navigate('/checkout');
  }, [clearAll, navigate]);

  // Navigation prevention
  useEffect(() => {
    if (paymentStatus !== PAYMENT_STATUS.PENDING) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Payment in progress!";
    };

    const handleAllClicks = (e) => {
      if (e.target.closest('[data-cancel="true"]')) return;
      
      const link = e.target.closest('a');
      const button = e.target.closest('button');
      const isNavIcon = e.target.closest('.wishlist-icon') || 
                       e.target.closest('.cart-icon') || 
                       e.target.closest('.search-icon');
      
      if ((link && link.href) || button || isNavIcon) {
        e.preventDefault();
        e.stopPropagation();
        alert("⚠️ Please complete the payment before navigating away!");
      }
    };

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      alert("⚠️ Please complete the payment before navigating back!");
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleAllClicks, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleAllClicks, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [paymentStatus]);

  // Timer
  useEffect(() => {
    if (paymentStatus !== PAYMENT_STATUS.PENDING) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearAll();
          setPaymentStatus(PAYMENT_STATUS.TIMEOUT);
          setModalStatus("failed");
          setModalMessage("Payment timeout. Please try again.");
          setShowModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentStatus, clearAll]);

  // Payment verification
  const verifyPayment = useCallback(async () => {
    if (!orderData || paymentStatus !== PAYMENT_STATUS.PENDING) return;
    if (isChecking.current) return;

    isChecking.current = true;

    try {
      if (pollingCount.current >= POLLING_CONFIG.MAX_ATTEMPTS) {
        clearAll();
        setPaymentStatus(PAYMENT_STATUS.TIMEOUT);
        setModalStatus("failed");
        setModalMessage("Payment expired. Please try again.");
        setShowModal(true);
        return;
      }

      const res = await checkRef.current({
        ap_transactionid: orderData.qrData.ap_transactionid,
        order_no: orderData.orderId,
        rrn: orderData.qrData.rrn || "",
        _t: Date.now(),
      });

      setPollingAttempt(pollingCount.current + 1);

      if (!res) {
        pollingCount.current++;
        return;
      }

      if (res.order_status === "completed") {
        clearAll();
        setPaymentStatus(PAYMENT_STATUS.COMPLETED);
        await clearCart();
        setModalStatus("success");
        setModalMessage("Payment successful!");
        setShowModal(true);
        return;
      }

      if (res.order_status === "failed") {
        clearAll();
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setModalStatus("failed");
        setModalMessage("Payment failed. Please try again.");
        setShowModal(true);
        return;
      }

      const d = res?.response?.data;
      const code = d?.transaction_status;
      const text = (d?.transaction_payment_status || "").toLowerCase();

      if (code === 211 || text.includes("process")) {
        pollingCount.current++;
        return;
      }

      if (code === 200 || text === "success") {
        clearAll();
        setPaymentStatus(PAYMENT_STATUS.COMPLETED);
        await clearCart();
        setModalStatus("success");
        setModalMessage("Payment successful!");
        setShowModal(true);
        return;
      }

      if (code === 400 || code === 501 || text === "failed") {
        clearAll();
        setPaymentStatus(PAYMENT_STATUS.FAILED);
        setModalStatus("failed");
        setModalMessage("Payment failed. Please try again.");
        setShowModal(true);
        return;
      }

      pollingCount.current++;

    } catch (error) {
      pollingCount.current++;
    } finally {
      isChecking.current = false;
    }
  }, [orderData, paymentStatus, clearAll, clearCart]);

  // Polling
  useEffect(() => {
    if (!orderData || paymentStatus !== PAYMENT_STATUS.PENDING) return;

    pollingCount.current = 0;
    setPollingAttempt(0);

    verifyPayment();
    intervalRef.current = setInterval(verifyPayment, POLLING_CONFIG.INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderData, paymentStatus, verifyPayment]);

  if (!orderData) return null;

  const isPending = paymentStatus === PAYMENT_STATUS.PENDING;
  const isCompleted = paymentStatus === PAYMENT_STATUS.COMPLETED;
  const isFailed = paymentStatus === PAYMENT_STATUS.FAILED || paymentStatus === PAYMENT_STATUS.TIMEOUT;

  return (
    <>
      <PaymentModal
        isOpen={showModal}
        status={modalStatus}
        message={modalMessage}
        orderId={orderData.orderId}
        onClose={() =>
          navigate(modalStatus === "success" ? "/my-account/orders" : "/checkout")
        }
      />

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-6 text-center">

            {isPending && (
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-4">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Time Left: {formatTime(timeRemaining)}</span>
              </div>
            )}

            <div className="flex justify-center mb-4">
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
                  <div className="w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isCompleted ? "Payment Successful!" : isFailed ? "Payment Failed" : "Complete Your Payment"}
            </h1>

            {orderData.orderId && isPending && (
              <p className="text-sm text-gray-500 mb-4">
                Order ID: <span className="font-mono">{orderData.orderId}</span>
              </p>
            )}

            {paymentLoading && isPending && (
              <p className="text-sm text-blue-600 mt-2">
                Checking payment status {pollingAttempt > 0 && `(Attempt ${pollingAttempt}/${POLLING_CONFIG.MAX_ATTEMPTS})`}...
              </p>
            )}

            {isPending && orderData.qrData?.qrcode_string && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-2xl font-bold text-[#4b2c2c] mb-4">
                  ₹{orderData.subtotal?.toLocaleString()}
                </p>

                <div className="mb-3 text-gray-600 text-sm flex items-center gap-1">
                  <span className="animate-pulse">●</span>
                  <span>Waiting for payment confirmation...</span>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <QRCodeCanvas value={orderData.qrData.qrcode_string} size={220} level="H" includeMargin={true} fgColor="#4b2c2c" bgColor="#ffffff" />
                </div>

                <button data-cancel="true" onClick={handleGoBack} className="mt-6 text-sm text-gray-500 hover:text-gray-700 underline transition">
                  ← Cancel and return to checkout
                </button>

                <div className="mt-4 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded">
                  ⚠️ Navigation is disabled while payment is in progress
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-6">
                <p className="text-green-600 text-lg font-semibold">🎉 Your order has been confirmed!</p>
                <button onClick={() => navigate("/my-account/orders")} className="mt-4 bg-[#4b2c2c] text-white px-6 py-2 rounded-lg hover:bg-[#3b2222] transition">
                  View My Orders
                </button>
              </div>
            )}

            {isFailed && (
              <div className="mt-6">
                <p className="text-red-600 mb-4">
                  {paymentStatus === PAYMENT_STATUS.TIMEOUT ? "⏰ Payment timeout. Please try again." : "❌ Payment failed. Please try again."}
                </p>
                <button onClick={() => navigate("/checkout")} className="bg-[#4b2c2c] text-white px-6 py-2 rounded-lg hover:bg-[#3b2222] transition">
                  Try Again
                </button>
              </div>
            )}
          </div>

          {isCompleted && orderData && <OrderSummary orderData={orderData} />}
        </div>
      </div>
    </>
  );
};

export default OrderComplete;