import { useState } from "react";
import LatestBookCard from "../books/LatestBookCard.jsx";

const latestBooks = [
  {
    id: 101,
    title: "The Creative Mind",
    image: "/src/images/book3.jpg",
    category: "Business",
    price: 8200,
    oldPrice: 10500,
    discount: "-22%",
    rating: 4.4,
  },
  {
    id: 102,
    title: "History of Time",
    image: "/src/images/book2.jpg",
    category: "History",
    price: 9100,
    oldPrice: 12000,
    discount: "-24%",
    rating: 4.6,
  },
  {
    id: 103,
    title: "Fantasy Realm",
    image: "/src/images/book3.jpg",
    category: "Fantasy",
    price: 7600,
    oldPrice: 9800,
    discount: "-22%",
    rating: 4.2,
  },
  {
    id: 104,
    title: "Modern Biography",
    image: "/src/images/book2.jpg",
    category: "Biography",
    price: 8800,
    oldPrice: 11000,
    discount: "-20%",
    rating: 4.5,
  },
];

const SectionSeven = () => {
  const [paused, setPaused] = useState(false);

  return (
    <section className="bg-[#FEFCF9] pt-0 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-sm italic text-[#B8964E] mb-2">
            Just Arrived
          </p>
          <h2 className="text-4xl font-['Playfair_Display'] text-[#2E2E2E] mb-4">
            Latest Books
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Fresh arrivals curated specially for you
          </p>
        </div>

      </div>

      {/* SLIDER WRAPPER (SIDE SPACE) */}
      <div className="relative w-full overflow-hidden px-12">
        <div
          className="
            flex
            gap-8
            w-max
            animate-marquee
          "
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {[...latestBooks, ...latestBooks].map((book, index) => (
            <div
              key={index}
              className="w-[270px] shrink-0 cursor-pointer"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onClick={() => setPaused(true)}
            >
              <LatestBookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionSeven;
