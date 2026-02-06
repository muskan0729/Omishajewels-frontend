export default function ShippingPolicy() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-16 text-center">
        <h1 className="text-4xl font-semibold mb-3">
          Shipping Policy
        </h1>
        <p className="max-w-3xl mx-auto text-gray-600">
          Information about delivery of digital products at Omisha Jewels
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8 leading-7">

        {/* INTRO */}
        <p>
          At <strong>Omisha Jewels Pvt. Ltd.</strong>, we ensure that your digital
          purchases, such as eBooks, are delivered instantly and securely.
          Please read the following shipping guidelines carefully.
        </p>

        {/* 1 */}
        <Section title="1. Delivery Method">
          <p>
            All eBooks and digital products are delivered electronically.
          </p>
          <p>
            After successful purchase, you will receive download instructions
            via email or through your registered account on our website.
          </p>
          <p>
            There is no physical shipment for digital products.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Order Processing">
          <p>
            Orders are processed instantly after payment confirmation.
          </p>
          <p>
            In rare cases of payment verification issues, order processing may
            take up to 24 hours.
          </p>
          <p>
            You will receive an order confirmation email containing your
            download link.
          </p>
        </Section>

        {/* 3 */}
        <Section title="3. Download Instructions">
          <p>
            Download links are provided in your order confirmation email.
          </p>
          <p>
            Download links may be time-sensitive or have limited download
            attempts depending on the product.
          </p>
          <p>
            Please ensure that you download and save your eBook immediately
            after purchase.
          </p>
        </Section>

        {/* 4 */}
        <Section title="4. Payment Verification">
          <p>
            Payments must be successfully completed before digital delivery
            is initiated.
          </p>
          <p>
            Failed or incomplete payments will not generate a download link.
          </p>
        </Section>

        {/* 5 */}
        <Section title="5. Refund & Cancellation">
          <p>
            All digital products, including eBooks, are non-refundable and
            non-cancellable.
          </p>
          <p>
            Please carefully review the product description before completing
            your purchase.
          </p>
        </Section>

        {/* 6 */}
        <Section title="6. Support & Issues">
          <p>
            If you experience any issues accessing or downloading your eBook,
            please contact our support team immediately with your order
            details.
          </p>

          <p className="mt-3">
            <strong>Email:</strong> omishajewels.opc@gmail.com
            <br />
            <strong>Phone:</strong> +91 93000 98007
          </p>

          <p>
            We aim to respond to all inquiries within <strong>24–48 hours</strong>.
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
