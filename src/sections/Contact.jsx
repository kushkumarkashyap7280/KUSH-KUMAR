import { useState } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import TitleHeader from "../components/TitleHeader";
import { createContact as createContactApi } from "../apis/contacts";
import "./Contact.css";

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
      // 1) Send to backend (source of truth)
      await createContactApi({
        name: form.name,
        email: form.email,
        topic: form.title,
        message: form.message,
        type: "other",
        meta: { preferredTime: form.time },
      });

      // 2) Best-effort EmailJS (does not block success)
      try {
        await emailjs.send(
          import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
          {
            title: form.title,
            name: form.name,
            time: form.time,
            message: form.message,
            email: form.email,
          },
          import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
        );
      } catch (emailErr) {
        console.warn("EmailJS best-effort send failed:", emailErr);
      }

      // Reset form
      setForm({
        title: "",
        name: "",
        time: "",
        message: "",
        email: "",
      });
      toast.success("Thanks! Your message has been sent.");
    } catch (error) {
      console.error("Contact submit error:", error?.response?.data || error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send your message. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <TitleHeader
          title="Get in Touch – Let’s Connect"
          sub="💬 Have questions or ideas? Let’s talk! 🚀"
        />
        <div className="contact-grid">
          <div>
            <div className="contact-card">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Subject of your message"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What’s your good name?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <input
                    type="text"
                    id="time"
                    name="time"
                    className="input"
                    value={form.time}
                    onChange={handleChange}
                    placeholder="When should I contact you?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What’s your email address?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="textarea"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows="5"
                    required
                  />
                </div>

                <div className="actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right card removed as requested */}
        </div>
      </div>
    </section>
  );
};

export default Contact;