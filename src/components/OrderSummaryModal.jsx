import { FiX } from "react-icons/fi";

const OrderSummaryModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Function to fix the image path
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/80x80?text=No+Image';
    
    // Replace 'storage' with 'public' in the URL
    const correctedUrl = imageUrl.replace('/storage/', '/public/');
    //console.log("Original URL:", imageUrl);
    //console.log("Corrected URL:", correctedUrl);
    return correctedUrl;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Number</p>
                <p className="font-medium">{order.order_no}</p>
              </div>
              <div>
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "completed" 
                    ? "bg-green-100 text-green-700"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold mb-4">Items</h3>
              <div className="space-y-4">
                {order.ebooks?.map((ebook, index) => (
                  <div key={index} className="flex gap-4 border-b pb-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={getCorrectImageUrl(ebook.image)}
                        alt={ebook.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          //console.log("Image failed to load even after correction:", e.target.src);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{ebook.title}</h4>
                      <p className="text-sm text-gray-500">
                        ₹{ebook.price} x {ebook.quantity}
                      </p>
                      <p className="text-sm font-medium text-[#B8964E]">
                        Total: ₹{ebook.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-[#B8964E]">
                  ₹{order.bill_amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;