import { useState } from "react";
import BookCard from "../books/BookCard.jsx";

const CATEGORIES = ["BIOGRAPHY", "FANTASY", "HISTORY", "LAB TITLE"];

/**
 * Later this `booksData` will come from API / Admin Panel
 */
const booksData = {
  BIOGRAPHY: [
    {
      id: 1,
      title: "Assouline – New York Chic",
      image: "/src/images/book1.jpg",
      category: "Other",
      price: 10500,
      oldPrice: 15000,
      discount: "-30%",
      rating: 4.5,
    },
    {
      id: 2,
      title: "James Bond Style",
      image: "/src/images/book2.jpg",
      category: "Other",
      price: 12000,
      oldPrice: 18000,
      discount: "-33%",
      rating: 4,
    },
  ],

  FANTASY: [
    {
      id: 4,
      title: "Rework",
      image: "/src/images/book1.jpg",
      category: "Business",
      price: 13000,
      oldPrice: 15500,
      discount: "-16%",
      rating: 4.8,
    },
    {
      id: 5,
      title: "Life Stories",
      image: "/src/images/book2.jpg",
      category: "Biography",
      price: 8000,
      oldPrice: 10000,
      discount: "-20%",
      rating: 4,
    },
  ],

  HISTORY: [
    {
      id: 3,
      title: "Miami Beach",
      image: "/src/images/book3.jpg",
      category: "Other",
      price: 9000,
      oldPrice: 14000,
      discount: "-36%",
      rating: 4.2,
    },
  ],
  "LAB TITLE": [
    {
      id: 6,
      title: "The Journey",
      image: "/src/images/book3.jpg",
      category: "Biography",
      price: 9500,
      oldPrice: 12000,
      discount: "-21%",
      rating: 4.1,
    },
  ],
};

const SectionFive = () => {
  const [activeCategory, setActiveCategory] = useState("BIOGRAPHY");

  return (
    <section className="bg-white pt-0 py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <p className="text-sm italic text-[#B8964E] mb-2">
            Discover Great Authors
          </p>

          <h2 className="text-4xl font-['Playfair_Display'] text-[#2E2E2E] mb-4">
            Featured Releases
          </h2>

          <p className="text-sm text-[#6B6B6B] max-w-xl mx-auto">
            Discover 1000’s of New Authors in Hundreds of Categories Fiction and
            Non-Fiction
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex justify-center gap-10 mb-16 text-sm tracking-widest">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                pb-2 transition cursor-pointer
                ${
                  activeCategory === category
                    ? "text-[#B8964E] border-b-2 border-[#B8964E]"
                    : "text-[#6B6B6B] hover:text-[#2E2E2E]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ================= BOOK GRID ================= */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-[repeat(3,minmax(0,320px))]
            justify-center
            gap-16
          "
        >
          {booksData[activeCategory]?.slice(0, 6).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {booksData[activeCategory]?.length === 0 && (
          <p className="text-center text-sm text-[#6B6B6B] mt-10">
            No books available in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionFive;
