    import React, { useState } from "react";
    import {
    FaFacebookF,
    FaTwitter,
    FaPinterest,
    FaLinkedin,
    } from "react-icons/fa";

    const QuickViewModal = ({ book, onClose, onAddToCart }) => {
    const [qty, setQty] = useState(1);
    

    const IMG_URL = import.meta.env.VITE_IMG_URL;

    const imageName = book.image?.split("/").pop();

    if (!book) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
        {/* Modal Box */}
        <div className="bg-white w-full max-w-5xl rounded-sm shadow-lg relative overflow-hidden">
            {/* Close Button */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
            ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* LEFT IMAGE */}
            <div className="flex justify-center items-center bg-white">
                <img
                src={`${IMG_URL}${imageName}`}
                alt={book.title}
                className="w-[300px] h-[400px] object-contain"
                />
            </div>

            {/* RIGHT CONTENT */}
            <div>
                <h2 className="text-2xl font-serif text-gray-800 mb-3">
                {book.title}
                </h2>

                {/* PRICE */}
                <div className="flex items-center gap-3 mb-6">
                {book.oldPrice && (
                    <span className="text-gray-400 line-through text-lg">
                    ₹{Number(book.oldPrice).toLocaleString()}
                    </span>
                )}

                <span className="text-[#B5854D] font-semibold text-xl">
                    ₹{Number(book.price).toLocaleString()}
                </span>
                </div>

                {/* QTY + CART */}
                <div className="flex items-center gap-4 mb-6">

                <button
                    onClick={() => onAddToCart(book, qty)}
                    className="bg-[#B5854D] hover:bg-[#9d6f3c] text-white font-semibold px-10 py-3 rounded-full text-sm uppercase"
                >
                    Add to cart
                </button>
                </div>

                <hr className="my-6" />

                {/* CATEGORY */}
                <p className="text-sm text-gray-700 mb-5">
                <strong>Category:</strong>{" "}
                <span className="text-gray-500">{book.category}</span>
                </p>

                {/* SHARE */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                <strong>Share:</strong>

                <div className="flex items-center gap-4 text-gray-500">
                <a
                    href="https://www.facebook.com/sharer/sharer.php?u=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:text-blue-800"
                >
                    <FaFacebookF /> </a>
                    <a
        href="https://x.com/share?url=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/"
        target="_blank"
        rel="noopener noreferrer"
        className=" hover:text-blue-800"
    ><FaTwitter /></a>
                    {/* <a
        href="https://www.facebook.com/sharer/sharer.php?u=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
    ><FaInstagram /></a> */}
                    <a
        href="https://www.pinterest.com/pin/create/button/?url=https://omishajewels.com/index.php/product/a-a-little-history-of-economics-little-history-of-economics-little-histories/&media=https://omishajewels.com/wp-content/uploads/2025/11/712NMyLHxmL._SY466_.jpg&description=A+A+Little+History+of+Economics+Little+History+of+Economics+%28Little+Histories%29"
        target="_blank"
        rel="noopener noreferrer"
        className=" hover:text-blue-800"
    >
    <FaPinterest /></a>
                    <a
        href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Fmini%3Dtrue%26url%3Dhttps%3A%2F%2Fomishajewels.com%2Findex.php%2Fproduct%2Fa-a-little-history-of-economics-little-history-of-economics-little-histories%2F"
        target="_blank"
        rel="noopener noreferrer"
        className=" hover:text-blue-800"
    >
    <FaLinkedin /></a>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default QuickViewModal;
