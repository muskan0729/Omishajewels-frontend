import { useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    tag: "WORLD BESTSELLERS",
    title: "ZERO TO ONE",
    description:
      "Zero to One is a groundbreaking guide for entrepreneurs and innovators seeking to create unique, game-changing businesses.",
    image: "/src/images/book1.jpg",
    bg: "/src/images/slider-bg.jpg",
  },
];

const HeroSlider = () => {
  const [current] = useState(0);
  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[85vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${slide.bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT – BOOK IMAGE */}
        <div className="flex justify-center">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-[280px] md:w-[340px] shadow-2xl"
          />
        </div>

        {/* RIGHT – TEXT */}
        <div className="text-white">
          <p className="text-sm tracking-widest mb-4">
            {slide.tag}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {slide.title}
          </h1>

          <p className="text-sm md:text-base text-white/90 max-w-lg">
            {slide.description}
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/books"
              className="px-8 py-3 bg-yellow-400 text-black text-sm rounded-full hover:bg-yellow-500 transition"
            >
              SHOP NOW
            </Link>

            <Link
              to="/books/1"
              className="px-8 py-3 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
            >
              VIEW MORE
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;
