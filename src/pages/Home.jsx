import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="space-y-24">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#FEFCF9]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}

          <div className="hidden md:block">
            <div className="w-full h-[420px] bg-[#F3F1EC] rounded-xl flex items-center justify-center text-[#B8964E] text-xl">
              Hero Image
            </div>
          </div>          

          {/* RIGHT IMAGE */}
          <div>
            <h1 className="text-4xl md:text-5xl font-light text-[#2E2E2E] leading-tight">
              Discover Books That <br />
              <span className="font-semibold text-[#B8964E]">
                Shape Your Thinking
              </span>
            </h1>

            <p className="mt-6 text-[#6B6B6B] max-w-md">
              Explore a curated collection of books that inspire,
              educate, and elevate your mindset.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                to="/books"
                className="px-8 py-3 bg-[#B8964E] text-white text-sm tracking-wide rounded hover:bg-[#a68442] transition"
              >
                SHOP NOW
              </Link>

              <Link
                to="/about"
                className="px-8 py-3 border border-[#B8964E] text-[#B8964E] text-sm tracking-wide rounded hover:bg-[#B8964E] hover:text-white transition"
              >
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
