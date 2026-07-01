"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header({
  siteName = "The Infinium",
  logoUrl = "/Logo.png",
  tagline = "Exposing Lending Lies. Empowering Business Truths.",
  navigation = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Header Container */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md p-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-16 sm:px-6 lg:px-8">
          {/* Left Section: Menu Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-primary transition-colors focus:outline-none group"
              id="header-menu-toggle"
            >
              <span className="flex flex-col gap-1 w-5">
                <span className="h-0.5 w-full bg-current transition-all group-hover:bg-primary"></span>
                <span className="h-0.5 w-full bg-current transition-all group-hover:bg-primary"></span>
                <span className="h-0.5 w-full bg-current transition-all group-hover:bg-primary"></span>
              </span>
            </button>
          </div>

          {/* Center Section: Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex flex-col items-center">
              <span className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-ui">
                <Image
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  height={45}
                  width={180}
                  priority
                  className="h-10 w-auto object-contain"
                />
              </span>
              <span className="hidden md:inline text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                {tagline}
              </span>
            </Link>
          </div>

          {/* Right Section: Search Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle Search"
              id="header-search-toggle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 animate-fade-in">
            <div className="mx-auto max-w-3xl">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 pr-12 text-sm text-gray-900 focus:border-primary focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 p-1.5 text-gray-400 hover:text-primary"
                  aria-label="Submit Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Off-canvas Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          ></div>

          {/* Drawer container */}
          <div className="relative flex w-full max-w-xs flex-col bg-white py-6 px-6 shadow-xl animate-slide-in h-full">
            {/* Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <span className="text-lg font-bold text-gray-900 font-ui">
                Navigate
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto pt-6">
              <nav className="space-y-1">
                {/* CMS Navigation items */}
                {navigation.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url || "/"}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center rounded-md px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:text-primary transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-100 pt-4 text-center">
              <p className="text-[10px] text-gray-400">© 2026 The Infinium</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
