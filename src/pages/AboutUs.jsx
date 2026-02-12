export default function AboutUs() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO SECTION */}
      <section className="bg-[#f6f1ed] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-semibold mb-4">
            About Omisha Jewels
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Your trusted destination for premium digital eBooks and curated
            knowledge resources.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* TEXT */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            About Our Online Store
          </h2>

          <p className="mb-4 leading-7">
            At <strong>Omisha Jewels</strong>, you can conveniently order your
            favorite products and eBooks directly from our online store anytime,
            anywhere. Simply browse the items you need, choose the quantity, and
            place your order with just a few clicks.
          </p>

          <p className="mb-4 leading-7">
            You’ll receive instant access to your purchased digital items. For
            all digital products, we ensure a seamless and secure delivery
            process directly to your email address. No waiting in lines — just
            fast, efficient digital service from the comfort of your home.
          </p>

          <p className="mb-4 leading-7">
            At Omisha Jewels, you can also view or download all your previous
            bills and conveniently reorder products you have purchased earlier.
            Regardless of how you shop with Omisha Jewels OPC Pvt Ltd, we are
            committed to offering high-quality, genuine digital products at
            attractive prices.
          </p>
        </div>

        {/* IMAGE */}
        <div>
          <img
            src="\assets\images\about-store.jpg"
            alt="About Omisha Jewels"
            className="rounded-lg shadow-md w-full"
          />
        </div>
      </section>

      {/* EBOOK SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div>
            <img
              src="\assets\images\ebooks.png"
              alt="Omisha Jewels eBooks"
              className="rounded-lg shadow-md w-full"
            />
          </div>

          {/* TEXT */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Now Introducing eBooks at Omisha Jewels
            </h2>

            <p className="mb-4 leading-7">
              We’re excited to introduce a growing collection of
              <strong> digital-only eBooks</strong>. Explore topics like
              wellness, spirituality, gemstones, personal growth, and more.
            </p>

            <p className="mb-4 leading-7">
              Our eBooks are available for instant download — meaning no physical
              delivery and no waiting. You get immediate access on your phone,
              tablet, or computer.
            </p>

            <p className="leading-7">
              Whether you’re seeking inspiration or knowledge, start your
              reading journey today with Omisha Jewels’ digital library.
            </p>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded">
            <h3 className="font-semibold text-lg mb-2">
              Important Notice
            </h3>
            <p className="leading-7">
              Omisha Jewels provides <strong>only digital eBooks</strong>.
              Physical products are not delivered. All purchases are fulfilled
              digitally via email or instant download.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
