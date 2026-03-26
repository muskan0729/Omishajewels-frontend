import i1 from "../../assets/images/insta/insta1.jpg";
import i2 from  "../../assets/images/insta/insta2.jpg";
import i3 from "../../assets/images/insta/insta3.jpg";
import i4 from"../../assets/images/insta/insta4.jpg";
import i5 from"../../assets/images/insta/insta5.jpg";
import i6 from"../../assets/images/insta/insta6.jpg";
import i7 from"../../assets/images/insta/insta7.jpg";
import i8 from"../../assets/images/insta/insta8.jpg";
import i9 from"../../assets/images/insta/insta9.jpg";
import i10 from"../../assets/images/insta/insta10.jpg";


const instagramImages = [
  i1,i2,i3,i4,i5,i6,i7,i8,i9,i10
];

const SectionEight = () => {
  return (
    <section className="bg-[#FEFCF9] py-0">
      <div className="max-w-6xl mx-auto px-6">
        {/* MAIN WRAPPER */}
        <div className="relative rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] overflow-hidden p-6">
          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {instagramImages.map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl bg-[#F5F3EF]"
              >
                <img
                  src={img}
                  alt={`Instagram ${index}`}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-700 ease-out
                    hover:scale-[1.05]
                  "
                />
              </div>
            ))}
          </div>

          {/* CENTER OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="
                bg-white/95
                backdrop-blur-sm
                px-18 py-9
                rounded-2xl
                text-center
                border border-[#E9E4DA]
                shadow-[0_18px_45px_rgba(0,0,0,0.15)]
                "
            >
              {/* LABEL */}
              <p
                className="
                    text-xs
                    tracking-[0.35em]
                    text-[#B8964E]
                    mb-3
                    font-medium
                "
              >
                INSTAGRAM
              </p>

              {/* HANDLE */}
              <h3
                className="
                    text-xl
                    font-['Playfair_Display']
                    font-semibold
                    text-[#2E2E2E]
                    leading-tight
                "
              >
                @Omisha_jewels
              </h3>

              {/* SUB TEXT */}
              <p className="text-xs text-[#8A8A8A] mt-1 tracking-wide">
                Pvt. Ltd. · BOOKS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionEight;
