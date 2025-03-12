// pages/contact.js
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-white p-8"
    >
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
      {submitted ? (
        <p>Thank you for reaching out!</p>
      ) : (
        <form
          action="https://formspree.io/f/mblgrepy"
          method="POST"
          className="w-full max-w-md space-y-4"
          onSubmit={(e) => {
            // Optional: handle submission via JavaScript if needed.
            // Otherwise, Formspree handles the POST request.
            // To prevent default handling and use AJAX, remove the action attribute and write your own handler.
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="email"
            name="_replyto" // Use _replyto for Formspree email reply field
            placeholder="Your Email"
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full border border-gray-300 p-2 rounded"
            rows={4}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Send Message
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </motion.div>
  );
}
