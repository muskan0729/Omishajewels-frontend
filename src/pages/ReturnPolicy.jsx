export default function ReturnPolicy() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-16 text-center">
        <h1 className="text-4xl font-semibold mb-3">
          Return Policy
        </h1>
        <p className="max-w-3xl mx-auto text-gray-600">
          Important information regarding returns of digital products
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8 leading-7">

        {/* INTRO */}
        <p>
          At <strong>Omisha Jewels Pvt. Ltd.</strong>, we ensure that your digital
          products, such as eBooks, are delivered securely and efficiently.
          Please review the following return policy carefully.
        </p>

        {/* 1 */}
        <Section title="1. Digital Products">
          <p>
            All eBooks and digital products are
            <strong> non-returnable</strong>.
          </p>
          <p>
            Once purchased, digital products cannot be returned, exchanged, or
            replaced.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Access Issues">
          <p>
            If you are unable to access or download your eBook after purchase,
            please contact our support team immediately.
          </p>
          <p>
            Kindly provide your order ID, registered email address, and product
            details to help us assist you efficiently.
          </p>
          <p>
            Our team will make every effort to resolve access-related issues.
            However, replacement or refund is not applicable for digital
            products.
          </p>
        </Section>

        {/* 3 */}
        <Section title="3. Contact Us">
          <p>
            For any issues related to digital products, please reach out to us
            using the contact details below:
          </p>

          <p className="mt-3">
            <strong>Email:</strong> omishajewels.opc@gmail.com
            <br />
            <strong>Phone:</strong> +91 93000 98007
          </p>

          <p>
            We aim to respond to all inquiries within
            <strong> 24–48 hours</strong>.
          </p>
        </Section>

      </section>
    </div>
  );
}

/* ---------- SIMPLE SECTION COMPONENT ---------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
    