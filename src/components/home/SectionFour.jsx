import { Link } from "react-router-dom";

const SectionFour = () => {
  return (
    <section className="bg-white pt-0 py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            relative
            rounded-[32px]
            overflow-hidden
            shadow-[0_25px_60px_rgba(0,0,0,0.18)]
          "
        >
          {/* BACKGROUND IMAGE */}
          <img
            src="/src/images/section4.png"
            alt="Books Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/35"></div>

          {/* CONTENT */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 p-12 md:p-20 items-center">
            {/* LEFT IMAGE */}
            <div className="flex justify-center group">
              <img
                src="/src/images/section41.png"
                alt="Reading Moment"
                className="
                rounded-2xl
                shadow-2xl
                w-full
                max-w-md
                object-cover
                transition-all
                duration-700
                ease-out
                group-hover:-translate-y-1
                "
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="text-white relative">
              {/* QUOTE ICON */}
              <div className="absolute -top-10 -right-6 text-white/20 text-[140px] font-serif leading-none">
                ”
              </div>

              <blockquote
                className="
                  text-2xl md:text-3xl
                  font-['Playfair_Display']
                  leading-relaxed
                  mb-6
                "
              >
                “It is during our darkest moments that we must focus to see the
                light.”
              </blockquote>

              <p className="text-[#E6D3A3] italic mb-6">
                — Omisha Jewels, “Learning from History”
              </p>

              <p className="text-sm md:text-base text-white/90 max-w-xl leading-relaxed mb-10">
                Omisha Jewels has always been and continues to be your one-stop
                shop for all your general (organic) product needs, now with the
                added convenience of shopping from home at the click of a
                button.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="
                    px-8 py-3
                    rounded-full
                    bg-[#B8964E]
                    text-white
                    text-sm
                    tracking-wide
                    hover:bg-[#a68442]
                    transition
                  "
                >
                  VIEW MORE
                </Link>

                <Link
                  to="/shop"
                  className="
                    px-8 py-3
                    rounded-full
                    border border-white
                    text-white
                    text-sm
                    tracking-wide
                    hover:bg-white
                    hover:text-[#2E2E2E]
                    transition
                  "
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFour;
