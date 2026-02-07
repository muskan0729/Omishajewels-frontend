import { Link } from "react-router-dom";

const SectionSix = () => {
  return (
    <section className="bg-[#FEFCF9] pt-0 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* MAIN CONTAINER */}
        <div className="rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden">

          {/* GRID WITH FIXED SPACING */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px] p-[18px]">

            {/* LEFT IMAGE (FIXED SIZE, IMAGE ADJUSTS) */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F5F3EF] flex items-center justify-center">
              <img
                src="/src/images/partner1.png"
                alt="Typewriter"
                className="
                  w-full h-full
                  object-contain
                  transition-transform
                  duration-700
                  ease-out
                  hover:scale-[1.03]
                "
              />
            </div>

            {/* CENTER CONTENT */}
            <div className="relative bg-[#14161B] text-white rounded-2xl p-12 flex flex-col justify-center">

              {/* TAG */}
              <p className="text-xs tracking-[0.35em] text-[#B8964E] mb-6">
                BECOME OUR PARTNER
              </p>

              {/* TITLE */}
              <h2 className="text-4xl font-['Playfair_Display'] leading-tight mb-6">
                <span className="text-[#B8964E]">Self-Publishing</span>
                <br />
                And Book Printing
              </h2>

              {/* DESCRIPTION */}
              <p className="text-sm text-white/80 leading-relaxed max-w-md mb-10">
                Publish your book in both eBook and paperback formats to reach
                a wider audience and gain more visibility with our trusted
                global publishing network.
              </p>

              {/* BUTTONS */}
              <div className="flex gap-4">
                <Link
                  to="/about"
                  className="
                    px-7 py-3
                    rounded-full
                    bg-[#B8964E]
                    text-black
                    text-sm tracking-wide
                    hover:bg-[#a68442]
                    transition
                  "
                >
                  VIEW MORE
                </Link>

                <Link
                  to="/shop"
                  className="
                    px-7 py-3
                    rounded-full
                    border border-white/40
                    text-white
                    text-sm tracking-wide
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  SHOP NOW
                </Link>
              </div>

              {/* DECORATIVE QUOTE */}
              <span className="absolute right-10 bottom-10 text-[160px] text-white/5 font-serif select-none">
                ”
              </span>
            </div>

            {/* RIGHT STACKED IMAGES (FIXED SIZE, IMAGE ADJUSTS) */}
            <div className="grid grid-rows-2 gap-[18px]">

              <div className="rounded-2xl overflow-hidden bg-[#F5F3EF] flex items-center justify-center">
                <img
                  src="/src/images/partner2.jpg"
                  alt="Nature"
                  className="
                    w-full h-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    hover:scale-[1.04]
                  "
                />
              </div>

              <div className="rounded-2xl overflow-hidden bg-[#F5F3EF] flex items-center justify-center">
                <img
                  src="/src/images/partner3.jpg"
                  alt="Forest"
                  className="
                    w-full h-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    hover:scale-[1.04]
                  "
                />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SectionSix;
