import { Link } from "react-router-dom";
import heroImg from "../images/hero-books.jpg";
import BookCard from "../components/books/BookCard";
import { popularBooks } from "../data/books";

const Home = () => {
  return (
    <>
      {/* ================= FIXED HERO ================= */}
      <section
        className="
          relative
          h-[90vh]
          w-full
          bg-center
          bg-cover
          bg-no-repeat
          bg-fixed
          flex
          items-center
          justify-center
        "
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-[#5C4A3A]/45"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-center px-6 text-white max-w-4xl">
          <p className="text-xs tracking-[0.35em] uppercase mb-6 opacity-90">
            Casual & Everyday
          </p>

          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl leading-tight">
            Where Every Book Finds Its <br />
            <span className="italic">Reader</span>
          </h1>

          <p className="mt-6 text-sm md:text-base opacity-90">
            Stay ahead with the books everyone is reading right now.
          </p>

          <Link
            to="/books"
            className="
              inline-block mt-10
              px-12 py-3
              rounded-full
              bg-[#D6B24A]
              text-white
              text-sm tracking-widest
              hover:bg-[#c4a23f]
              transition
            "
          >
            EXPLORE
          </Link>
        </div>
      </section>

        {/* ================= MOST POPULAR ================= */}
        <section className="bg-[#FEFCF9] py-28">
        <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-['Playfair_Display'] text-[#2E2E2E] mb-14">
            Most Popular
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {popularBooks.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
            </div>

        </div>
        </section>
    </>
  );
};

export default Home;
