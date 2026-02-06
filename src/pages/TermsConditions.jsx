export default function TermsConditions() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-16 text-center">
        <h1 className="text-4xl font-semibold mb-3">
          Terms & Conditions
        </h1>
        <p className="max-w-3xl mx-auto text-gray-600">
          Please read these terms carefully before using our website and services
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8 leading-7">

        {/* INTRO */}
        <p>
          <strong>Omishajewels.com</strong> (“we”, “us”, “our”) is owned by
          Omisha Jewels Pvt. Ltd. By accessing or using any part of
          www.omishajewels.com (“Site”, “Website”), you (“you”, “your”) agree to
          be bound by these Terms & Conditions (“T&Cs”) and our Privacy Policy.
          If you do not agree, please do not use the Site.
        </p>

        <p>
          To access certain services on this Site, you may be required to
          register as an authorized user.
        </p>

        {/* 1 */}
        <Section title="1. Copyright Policy">
          <p>
            All content on this Site is protected by copyright and intellectual
            property laws. You may not reproduce, republish, upload, post,
            transmit, or distribute any material from this Site without prior
            written permission from Omisha Jewels Pvt. Ltd.
          </p>
          <p>
            You may download one copy for personal, non-commercial use, provided
            that all copyright notices remain intact. Any modification or other
            use may violate intellectual property rights.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Use of Website">
          <p>
            You agree to use this Site only for lawful purposes. You further
            agree:
          </p>

          <ul className="list-disc ml-6 space-y-1">
            <li>Not to violate any applicable laws or third-party rights</li>
            <li>Not to post obscene, defamatory, harmful, or illegal content</li>
            <li>Not to interfere with the Site’s operation or security</li>
            <li>Not to attempt unauthorized access to our systems</li>
          </ul>

          <p>
            Omisha Jewels Pvt. Ltd. reserves the right to restrict or terminate
            access if misuse is suspected.
          </p>
        </Section>

        {/* 3 */}
        <Section title="3. Disclaimer">
          <p>
            All materials on this Site are provided on an “as is” basis without
            warranties of any kind. We do not guarantee uninterrupted or
            error-free operation, accuracy, or virus-free access.
          </p>
        </Section>

        {/* 4 */}
        <Section title="4. Limitation of Liability">
          <p>
            Omisha Jewels Pvt. Ltd. shall not be liable for any direct, indirect,
            incidental, or consequential damages arising from the use of this
            Site.
          </p>
          <p>
            Total liability, if any, shall not exceed the amount paid by you to
            access or use the Site.
          </p>
        </Section>

        {/* 5 */}
        <Section title="5. Modifications">
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            this Site at any time without prior notice.
          </p>
        </Section>

        {/* 6 */}
        <Section title="6. Suggestions and Feedback">
          <p>
            Any feedback, ideas, or suggestions you provide shall be deemed
            non-confidential and may be used by Omisha Jewels Pvt. Ltd. for any
            purpose, including service improvement and marketing.
          </p>
        </Section>

        {/* 7 */}
        <Section title="7. Links to Other Sites">
          <p>
            This Site may contain links to third-party websites. Omisha Jewels
            Pvt. Ltd. is not responsible for the content, accuracy, or damages
            resulting from such websites.
          </p>
        </Section>

        {/* 8 */}
        <Section title="8. Applicable Law and Jurisdiction">
          <p>
            These Terms & Conditions shall be governed by the laws of India.
            Courts located in Indore, Madhya Pradesh shall have exclusive
            jurisdiction.
          </p>
        </Section>

        {/* 9 */}
        <Section title="9. General Conditions at Outlets">
          <p>
            Terms, promotions, and conditions at Omisha Jewels Pvt. Ltd. retail
            outlets may differ from those applicable on this Site.
          </p>
        </Section>

        {/* 10 */}
        <Section title="10. Data Protection">
          <p>
            Please refer to our Privacy Policy for details on how we collect,
            use, and protect your personal data.
          </p>
        </Section>

        {/* TERMS OF SERVICE */}
        <h2 className="text-2xl font-semibold mt-12">
          Terms of Service
        </h2>

        {/* TOS 1 */}
        <Section title="1. Customer Information">
          <p>
            To become a customer, you must complete registration with accurate
            information. Only residents of India aged 18 years or above may
            register.
          </p>
          <p>
            Omisha Jewels Pvt. Ltd. reserves the right to suspend or terminate
            registrations at its discretion.
          </p>
        </Section>

        {/* TOS 2 */}
        <Section title="2. Pricing and Ordering">
          <p>
            Prices listed on the website apply only to online purchases and may
            differ from retail outlet pricing.
          </p>
          <p>
            Prices and products are subject to change without notice. Products
            are charged at the price applicable at the time of order placement.
          </p>
          <p>
            Bulk orders must be placed at least 24 hours in advance via email.
          </p>
        </Section>

        {/* TOS 3 */}
        <Section title="3. Payment">
          <p>
            Payments can be made using Visa or MasterCard credit or debit cards.
            Orders cannot be modified after successful payment.
          </p>
          <p>
            Any approved refunds will be credited back to the original payment
            method.
          </p>
        </Section>

        {/* TOS 4 */}
        <Section title="4. Delivery">
          <p>
            All eBooks and digital products are delivered electronically via
            email.
          </p>
          <p>
            Delivery is available worldwide, subject to accurate customer
            information. Download links are typically shared within 24–48
            working hours.
          </p>
        </Section>

        {/* TOS 5 */}
        <Section title="5. Availability of Items">
          <p>
            We reserve the right to replace unavailable items with alternatives
            of equivalent value.
          </p>
          <p>
            All prices include applicable taxes such as GST, unless stated
            otherwise.
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
