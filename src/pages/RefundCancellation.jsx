export default function RefundCancellation() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-16 text-center">
        <h1 className="text-4xl font-semibold mb-3">
          Refund & Cancellation Policy
        </h1>
        <p className="max-w-3xl mx-auto text-gray-600">
          Please read this policy carefully before making a purchase
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8 leading-7">

        {/* INTRO */}
        <p>
          At <strong>Omisha Jewels Pvt. Ltd.</strong>, we value your satisfaction
          and strive to provide high-quality digital products. As our offerings
          include digital-only items such as eBooks, please review this Refund
          and Cancellation Policy carefully before completing your purchase.
        </p>

        {/* 1 */}
        <Section title="1. Refund Policy">
          <p>
            All digital products, including eBooks, are
            <strong> non-refundable</strong>.
          </p>
          <p>
            Once a purchase is completed, the order is instantly delivered to
            your registered email address or user account. Due to the nature of
            digital content, refunds cannot be processed.
          </p>
          <p>
            We strongly recommend reviewing the product description, sample
            previews, and other available details before purchasing.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Cancellation Policy">
          <p>
            Orders cannot be cancelled once payment is successfully completed
            and the download link has been provided.
          </p>
          <p>
            If a payment fails or an order is not processed due to a technical
            issue, no charges will be applied to the customer.
          </p>
        </Section>

        {/* 3 */}
        <Section title="3. Exceptions & Support">
          <p>
            If you experience any technical issues while accessing or
            downloading your purchased eBook, please contact our support team
            immediately.
          </p>
          <p>
            While we are happy to assist in resolving access or delivery issues,
            we are unable to offer refunds for digital products.
          </p>

          <p className="mt-3">
            <strong>Email:</strong> omishajewels.opc@gmail.com
            <br />
            <strong>Phone:</strong> +91 93000 98007
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
