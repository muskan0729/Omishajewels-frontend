import React, { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";
import { useDelete } from "../hooks/useDelete";
import { Link } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";

const ViewCart = () => {
  const { data, loading, error } = useGet("cart");
 const { executeDelete } = useDelete();
const [removingId, setRemovingId] = useState(null);


  const [cartItems, setCartItems] = useState([]);

  // 🔹 Map API → UI format
  useEffect(() => {
    if (data?.items?.length > 0) {
      const formattedItems = data.items.map((item) => ({
        id: item.id,
        name: item.ebook.title,
        description: item.ebook.description,
        oldPrice: Number(item.ebook.price),
        newPrice: Number(item.price),
        qty: Number(item.quantity),
      }));

      setCartItems(formattedItems);
    } else {
      setCartItems([]);
    }
  }, [data]);

  // 🔹 Increase quantity
  // const increaseQty = (id) => {
  //   setCartItems((prev) =>
  //     prev.map((item) =>
  //       item.id === id ? { ...item, qty: item.qty + 1 } : item
  //     )
  //   );
  // };

  // 🔹 Decrease quantity
  // const decreaseQty = (id) => {
  //   setCartItems((prev) =>
  //     prev.map((item) =>
  //       item.id === id && item.qty > 1
  //         ? { ...item, qty: item.qty - 1 }
  //         : item
  //     )
  //   );
  // };

  // 🔹 Remove single item
const removeItem = async (itemId) => {
  try {
    setRemovingId(itemId);

    await executeDelete(`cart/item/${itemId}`);

    setCartItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  } catch (err) {
    console.error("Failed to remove item", err);
  } finally {
    setRemovingId(null);
  }
};



  // 🔹 Calculate subtotal
  const estimatedTotal = cartItems.reduce(
    (total, item) => total + item.newPrice * item.qty,
    0
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Cart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load cart
      </div>
    );
  }

  return (
    <>
      <Cartprocess />

      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 border-t pt-8">
              <div className="flex justify-between border-b pb-3 mb-6">
                <h3 className="text-lg font-semibold">Product</h3>
                <h3 className="text-lg font-semibold">Total</h3>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  Your cart is empty
                </p>
              ) : (
                cartItems.map((item) => {
                  const itemTotal = item.newPrice * item.qty;

                  return (
                    <div key={item.id} className="border-b pb-8 mb-8">
                      <div className="flex justify-between gap-6">

                        {/* Product Info */}
                        <div className="w-[70%]">
                          <h4 className="font-medium text-sm md:text-base">
                            {item.name}
                          </h4>

                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-gray-400 line-through text-sm">
                              ₹{item.oldPrice.toFixed(2)}
                            </p>
                            <p className="text-orange-600 font-semibold text-sm">
                              ₹{item.newPrice.toFixed(2)}
                            </p>
                          </div>

                          <p className="text-gray-600 text-sm mt-4">
                            {item.description}
                          </p>

                          {/* Quantity */}
                          {/* <div className="flex items-center mt-6 border w-fit rounded overflow-hidden">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              disabled={item.qty === 1}
                              className="px-4 py-2 text-lg disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="px-6 py-2 border-l border-r font-semibold">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => increaseQty(item.id)}
                              className="px-4 py-2 text-lg"
                            >
                              +
                            </button>
                          </div> */}

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={removingId === item.id}
                            className="mt-4 text-sm underline text-gray-700 disabled:opacity-50"
                          >
                            {removingId === item.id ? "Removing..." : "Remove item"}
                          </button>


                        </div>

                        {/* Item Total */}
                        <div className="w-[30%] text-right">
                          <p className="text-orange-600 font-semibold">
                            ₹{itemTotal.toFixed(2)}
                          </p>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="border-t pt-8">
              <h3 className="text-sm font-semibold uppercase border-b pb-3">
                Cart totals
              </h3>

              <h4 className="mt-8 text-lg font-semibold">
                Estimated total
              </h4>

              <p className="text-xl font-bold text-orange-600 mt-2">
                ₹{estimatedTotal.toFixed(2)}
              </p>

              <Link to="/checkout">
                <button className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded">
                  Proceed to Checkout
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCart;
