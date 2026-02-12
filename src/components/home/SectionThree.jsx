const sections = [
  {
    id: 1,
    tag: "WRITING",
    title: "Self-Publishing And Book Printing",
    description:
      "Publish your book in both eBook and paperback formats to reach a wider audience and gain more visibility.",
    image: "/assets/images/section1.jpg",
  },
  {
    id: 2,
    tag: "COLLECTING",
    title: "New, Rare And Out-of-Print Books",
    description:
      "Discover thousands of new authors in hundreds of categories including Fiction and Non-Fiction.",
    image: "/assets/images/section2.jpg",
  },
  {
    id: 3,
    tag: "COMMUNITY",
    title: "Where Books And People Meet",
    description:
      "Millions of books and other items are listed for sale by trusted sellers from around the world.",
    image: "/assets/images/section3.jpg",
  },
];

const SectionThree = () => {
  return (
    <section className="bg-white pt-0 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-14"> */}
        <div className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(0,320px))] justify-center gap-8">
          {sections.map((item) => (
            <div
              key={item.id}
              className="
                group
                relative
                h-[430px]
                rounded-2xl
                overflow-hidden
                shadow-[0_15px_40px_rgba(0,0,0,0.15)]
                cursor-pointer
              "
            >
              {/* BACKGROUND IMAGE (ONLY THIS ANIMATES) */}
              <img
                src={item.image}
                alt={item.title}
                className="
                  absolute inset-0
                  w-full h-full
                  object-cover
                  transition-transform duration-700 ease-out
                  group-hover:scale-110
                "
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/30"></div>

              {/* CONTENT BOX */}
              <div className="relative z-10 h-full flex items-center justify-center px-6">
                <div
                  className="
                    bg-white/80
                    backdrop-blur-sm
                    rounded-xl
                    p-8
                    text-center
                    max-w-[240px]
                  "
                >
                  {/* TAG */}
                  <p className="text-xs tracking-widest text-[#B8964E] mb-3 font-semibold">
                    {item.tag}
                  </p>

                  {/* TITLE */}
                  <h3
                    className="
                      text-xl
                      font-bold
                      text-[#2E2E2E]
                      mb-4
                      font-['Playfair_Display']
                      leading-snug
                    "
                  >
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SectionThree;
