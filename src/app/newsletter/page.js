"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cms } from "../../lib/cms";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Call official SDK subscriber method
      const res = await cms.subscribeNewsletter({
        email,
        name,
        metadata: { source: "newsletter-page-demo" },
      });

      if (res) {
        setSuccess(true);
        setEmail("");
        setName("");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            STAY UPDATED
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Newsletter Signup
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Get the latest alternative lending news and compliance articles delivered straight to your inbox.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-center text-sm space-y-2 animate-fade-in">
            <p className="font-bold">✓ Subscribed successfully!</p>
            <p className="text-xs text-emerald-600">
              You have been registered under the connected site: <span className="font-semibold">{process.env.NEXT_PUBLIC_SITE_ID || "infinium"}</span>.
            </p>
          </div>
        ) : null}

        {error ? (
          <div className="p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-2xl text-center text-sm">
            <p className="font-semibold">✕ Registration failed</p>
            <p className="text-xs text-rose-600">{error}</p>
          </div>
        ) : null}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email-address" className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none transition-all disabled:opacity-55"
          >
            {loading ? "Registering..." : "Subscribe Now"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-150">
          <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
