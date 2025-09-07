import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey && publicKey !== "3d4Ur9poxXE-v4sqg") {
      emailjs.init(publicKey);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("Name, email, and message are required");
      toast.error("Name, email, and message are required", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Prepare email template parameters
      const now = new Date();
      const timeString = now.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos", // Nigeria timezone
      });

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "aalamin730@gmail.com", // Destination email
        reply_to: email,
        time: timeString,
      };

      // Send email via EmailJS
      const emailResult = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      alert("Email successfully sent!", emailResult.status, emailResult.text);

      // Reset form and show success
      setName("");
      setEmail("");
      setMessage("");
      setError("");
    } catch (error) {
      console.error("Contact form submission error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-kaduna-gray mb-6">Contact Us</h1>
      <p className="text-kaduna-gray mb-6">
        Have questions or feedback? Reach out to us at Better Kaduna. We value
        your input and are here to assist you.
      </p>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Name"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Email"
            aria-required="true"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-kaduna-gray">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
            placeholder="Your Message"
            rows="5"
            aria-required="true"
          ></textarea>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full p-2 rounded-md transition transform hover:scale-105 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "btn-green hover:shadow-sm"
          }`}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
