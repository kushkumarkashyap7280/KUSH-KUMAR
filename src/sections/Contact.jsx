import { useState } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    name: "",
    time: "",
    message: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID, // service_l3jevok
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID, // template_nu4u2xe
        {
          title: form.title,
          name: form.name,
          time: form.time,
          message: form.message,
          email: form.email,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY // Your public key
      );

      // Reset form
      setForm({
        title: "",
        name: "",
        time: "",
        message: "",
        email: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Have questions or ideas? Let’s talk! 🚀"
        />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-5">
            <div className="flex-center card-border rounded-xl p-10">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-7">
                
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Subject of your message"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What’s your good name?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time">Preferred Time</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    placeholder="When should I contact you?"
                  />
                </div>

                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What’s your email address?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows="5"
                    required
                  />
                </div>

                <button type="submit">
                  <div className="cta-button group">
                    <div className="bg-circle" />
                    <p className="text">
                      {loading ? "Sending..." : "Send Message"}
                    </p>
                    <div className="arrow-wrapper">
                      <img src="/images/arrow-down.svg" alt="arrow" />
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-7 min-h-96">
            <div className="w-full h-full rounded-3xl overflow-hidden border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <img src="/images/chat.png" alt="Contact" className="w-20 h-20 opacity-90" />
                <p className="text-white-50 max-w-md">
                  I’ll get back to you shortly. This panel replaces the heavy 3D with a fast, clean visual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
