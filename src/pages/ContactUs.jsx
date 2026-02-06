import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({ type: "success", message: "Message sent successfully." });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch {
      setStatus({ type: "error", message: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="bg-[#f6f1ed] py-20 text-center">
        <h1 className="text-4xl font-semibold mb-3">Contact Us</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Have questions about our eBooks or services?  
          We’re here to help you.
        </p>
      </section>

      {/* INFO CARDS */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon={<MapPin />}
          title="Our Location"
          text="27 Prestige Tower, Indira Complex, Navlakha, Indore – 452001"
        />
        <InfoCard
          icon={<Mail />}
          title="Email Address"
          text="omishajewels.opc@gmail.com"
        />
        <InfoCard
          icon={<Phone />}
          title="Phone Number"
          text="+91 9300098007"
        />
      </section>

      {/* MAP + FORM */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">

        {/* MAP */}
        <div className="rounded-lg overflow-hidden shadow">
          <iframe
            title="Omisha Jewels Map"
            src="https://www.google.com/maps?q=Prestige%20Tower%20Indore&output=embed"
            className="w-full h-[450px]"
            loading="lazy"
          />
        </div>

        {/* FORM */}
        <div className="bg-[#fff7f4] rounded-lg p-10 shadow">
          <h2 className="text-2xl font-semibold mb-6">
            Ask Us Anything
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <Input
              name="company"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={handleChange}
            />

            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-black"
            />

            <button
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status.message && (
              <p
                className={`text-sm mt-2 ${
                  status.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>

      </section>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <div className="flex justify-center mb-4 text-orange-500">
        {icon}
      </div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-black"
    />
  );
}
