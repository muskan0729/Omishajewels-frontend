const features = [
  {
    id: 1,
    title: "Feel the Love",
    description:
      "We asked customers to tell us why they love shopping and we were overwhelmed by their kind words.",
    icon: "❤️",
  },
  {
    id: 2,
    title: "E-Reading",
    description:
      "Millions of books and other items are listed for sale by trusted sellers from around the world.",
    icon: "📘",
  },
  {
    id: 3,
    title: "Textbooks",
    description:
      "Trusted independent sellers offer curated rare books, first editions and collectible signed copies.",
    icon: "📚",
  },
  {
    id: 4,
    title: "Book Fairs",
    description:
      "We’re known for our epic selection of new, used, and rare books along with fine art & collectibles.",
    icon: "⚖️",
  },
];

const FeatureCards = () => {
  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {features.map((item) => (
            <div
              key={item.id}
              className="
                group
                bg-white
                rounded-2xl
                p-10
                text-center
                border border-[#ECE6D8]
                shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_22px_45px_rgba(184,150,78,0.28)]
                cursor-pointer
              "
            >
              {/* ICON */}
              <div className="flex justify-center mb-8">
                <div
                  className="
                    h-18 w-18
                    rounded-full
                    border border-[#B8964E]
                    flex items-center justify-center
                    text-3xl
                    text-[#B8964E]
                    transition-transform
                    duration-300
                    group-hover:rotate-6
                    group-hover:scale-110
                  "
                >
                  {item.icon}
                </div>
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-xl
                  font-bold
                  text-[#2E2E2E]
                  mb-4
                  font-['Playfair_Display']
                  tracking-wide
                "
              >
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-base text-[#6B6B6B] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureCards;
