export default function PrivacyPolicy() {
  return (
    <div className="bg-white text-gray-700">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-16 text-center">
        <h1 className="text-4xl font-semibold mb-3">Privacy Policy</h1>
        <p className="max-w-3xl mx-auto text-gray-600">
          Omisha Jewels OPC Pvt. Ltd. is committed to protecting your personal
          information and respecting your privacy.
        </p>
      </section>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10 leading-7">

        {/* INTRO */}
        <p>
          Omisha Jewels Pvt. Ltd. and our subsidiaries, associated companies,
          affiliates, agents, contractors and service providers take privacy
          very seriously. This Privacy Policy applies to information we collect
          through our websites, applications, sub-domains and other digital
          platforms operated by us.
        </p>

        {/* 1 */}
        <PolicySection title="1. Consent">
          <p>
            By using our platforms and/or providing your personal data, you
            agree to the terms of this Privacy Policy and consent to the
            collection, use and disclosure of your personal data.
          </p>
          <p>
            If you do not agree with this Policy, please do not access our
            platforms or provide your personal information.
          </p>
          <p>
            Omisha Jewels does not knowingly collect personal data from persons
            under the age of 18. If you are a minor, please do not use our
            services or submit personal data.
          </p>
        </PolicySection>

        {/* 2 */}
        <PolicySection title="2. Personal Data">
          <p>
            Personal data refers to information that can be used to identify
            an individual. We may collect the following types of personal data:
          </p>

          <ul className="list-disc ml-6">
            <li>Name</li>
            <li>Contact details such as phone number and email address</li>
            <li>Date of birth and gender</li>
            <li>Home and delivery address</li>
            <li>Payment details</li>
            <li>Purchase and order history</li>
            <li>Login details and account preferences</li>
            <li>
              Any other personal information provided while using our services
            </li>
          </ul>

          <p>
            We may also automatically collect technical data such as IP address,
            browser type, device information and browsing behavior.
          </p>
        </PolicySection>

        {/* 3 */}
        <PolicySection title="3. How the Data Is Used">
          <p>We do not sell or trade your personal data. Your data may be used for:</p>

          <ul className="list-disc ml-6">
            <li>Managing and maintaining your account</li>
            <li>Processing orders and payments</li>
            <li>Providing customer support</li>
            <li>Personalizing your shopping experience</li>
            <li>Sending updates, offers and promotional information</li>
            <li>Conducting surveys, promotions and lucky draws</li>
            <li>Legal compliance and fraud prevention</li>
            <li>Improving products, services and system security</li>
          </ul>

          <p>
            You may opt out of promotional communications at any time by using
            the unsubscribe option or contacting us directly.
          </p>
        </PolicySection>

        {/* 4 */}
        <PolicySection title="4. Data Retention">
          <p>
            We retain personal data only for as long as necessary to fulfill the
            purposes for which it was collected, unless a longer retention
            period is required by law.
          </p>
        </PolicySection>

        {/* 5 */}
        <PolicySection title="5. Security">
          <p>
            We implement reasonable security measures to protect your personal
            data. Sensitive information such as payment details is encrypted
            using SSL technology.
          </p>
          <p>
            However, no system is completely secure, and we cannot guarantee
            absolute security of your data. Users are responsible for keeping
            their login credentials confidential.
          </p>
        </PolicySection>

        {/* 6 */}
        <PolicySection title="6. External Sites">
          <p>
            Our platforms may contain links to third-party websites or
            applications. We are not responsible for the privacy practices of
            such external platforms. Please review their privacy policies
            before sharing your personal data.
          </p>
        </PolicySection>

        {/* 7 */}
        <PolicySection title="7. Cookies">
          <p>
            We use cookies and similar technologies to enhance your experience.
            Cookies help us remember preferences and improve functionality.
          </p>
          <p>
            You may disable cookies through your browser settings, but some
            features of our platforms may not function properly.
          </p>
        </PolicySection>

        {/* 8 */}
        <PolicySection title="8. Contact Us">
          <p>
            You may update or request deletion of your personal data by
            contacting us at:
          </p>
          <p className="font-medium">
            info@omishajewels.com
          </p>
          <p>
            Please allow us reasonable time to process your request. Some data
            may be retained as required by law or for legitimate business
            purposes.
          </p>
        </PolicySection>

        {/* 9 */}
        <PolicySection title="9. Updates">
          <p>
            We reserve the right to update this Privacy Policy at any time.
            Changes will be effective upon posting on our platform.
          </p>
        </PolicySection>

        {/* 10 */}
        <PolicySection title="10. Governing Law">
          <p>
            This Privacy Policy is governed by the laws of India. Any disputes
            shall be subject to the exclusive jurisdiction of Indian courts.
          </p>
        </PolicySection>

      </section>
    </div>
  );
}

/* ---------- REUSABLE SECTION COMPONENT ---------- */

function PolicySection({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
