import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    tag: "WORLD BESTSELLERS",
    title: "ART OF WAR",
    description:
      "The Art of War showing a warrior in black holding a sword, symbolizing strategy, discipline, and the art of conflict.",
    image: "/assets/images/book1.jpg",
    bg: "/assets/images/slider1.png",
  },
  {
    id: 2,
    tag: "EDITOR'S PICK",
    title: "PSYCHO-CYBERNETICS",
    description:
      "Psycho-Cybernetics highlighting personal growth, self-image improvement, and the power of the subconscious mind.",
    image: "/assets/images/book2.jpg",
    bg: "/assets/images/slider2.png",
  },
  {
    id: 3,
    tag: "WORLD BESTSELLERS",
    title: "THE BOOK THIEF",
    description:
      "Timeless lessons on wealth, greed, and happiness explained through powerful real-life stories.",
    image: "/assets/images/book3.jpg",
    bg: "/assets/images/slider3.jpg",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  // 🔁 AUTO SLIDE
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full h-[90vh] bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${slide.bg})` }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT – BOOK IMAGE */}
        <div className="flex justify-center">
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="
              w-[280px] md:w-[340px]
              shadow-2xl
              transition-all duration-700
              hover:scale-105
              animate-[fadeUp_0.7s_ease-out]
              cursor-pointer
            "
          />
        </div>

        {/* RIGHT – TEXT */}
        <div
          key={slide.title}
          className="text-white animate-[fadeRight_0.7s_ease-out]"
        >
          <p className="text-sm tracking-widest mb-4 opacity-90">
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
                to="/shop"
                className="px-8 py-3 bg-[#B8964E] text-white text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-[#a68442] hover:-translate-y-0.2 hover:shadow-[0_3px_3px_rgba(184,150,78,0.35)]"
            >
                SHOP NOW
            </Link>

            {/* SECONDARY BUTTON */}
            <Link
                to={`/books/${slide.id}`}
                className="px-8 py-3 border border-[#B8964E] text-[#B8964E] text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-[#B8964E] hover:text-white hover:-translate-y-0.2 hover:shadow-[0_3px_3px_rgba(184,150,78,0.25)]"
            >
                VIEW MORE
            </Link>
            </div>
        </div>

      </div>

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition ${
              current === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
