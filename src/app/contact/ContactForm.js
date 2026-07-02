"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { cms } from "../../lib/cms";

export default function ContactForm({ posts }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
        const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/settings?siteId=${siteId}`);
        if (res.ok) {
          const data = await res.json();
          const key = data?.data?.securityControls?.recaptchaSiteKey;
          if (key) setRecaptchaKey(key);
        }
      } catch (err) {
        console.error("Failed to load recaptcha settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      let token = undefined;
      if (recaptchaKey && typeof window !== "undefined" && window.grecaptcha) {
        try {
          token = await new Promise((resolve, reject) => {
            window.grecaptcha.ready(() => {
              window.grecaptcha
                .execute(recaptchaKey, { action: "contact" })
                .then(resolve)
                .catch(reject);
            });
          });
        } catch (err) {
          console.error("reCAPTCHA execution failed:", err);
        }
      }

      try {
        await cms.submitContactForm({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          recaptchaToken: token,
        });
      } catch (err) {
        console.error("Failed to submit contact form to CMS:", err);
      }
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Breadcrumbs */}
      <div className="border-b border-gray-200 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs font-semibold text-gray-500 gap-2 items-center">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column: Form & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Box */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-ui">
                Get In Touch
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Contact Us
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                Have questions about our reports, research findings, or MCA compliance? Drop us a line.
              </p>
            </div>

            {/* Contact Form Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Message Sent Successfully!</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Thank you for reaching out to The Infinium. A representative from Do It For Me LLC will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-block bg-primary text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="MCA Usury Compliance Question"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please enter your detailed inquiry here..."
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-hover transition-all shadow-sm focus:outline-none"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Entity Information Card */}
            <div className="rounded-3xl border border-gray-155 bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between items-center sm:items-start">
              <div className="space-y-2 text-center sm:text-left">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-ui">
                  Corporate Information
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  The Infinium is operated by <strong>Do It For Me LLC</strong>. All inquiries regarding corporate compliance, database permissions, or research publications will be routed accordingly.
                </p>
              </div>
              
              <div className="flex-none text-center sm:text-right text-xs text-gray-650 space-y-1">
                <p className="font-bold text-gray-900 font-ui">Do It For Me LLC</p>
                <p>Website: <a href="https://difm.llc" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">difm.llc</a></p>
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
}
