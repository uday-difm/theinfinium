"use client";

import { useState, useEffect, useRef } from "react";

export default function AdBanner({ zone }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const trackedImpression = useRef(false);

  useEffect(() => {
    async function fetchAd() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
        const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
        const res = await fetch(`${baseUrl}/api/ads/serve?zone=${zone}`, {
          headers: { "x-site-id": siteId }
        });
        const data = await res.json();
        if (data.success && data.data?.ads?.length > 0) {
          // Select a random active ad in this zone
          const list = data.data.ads;
          const selected = list[Math.floor(Math.random() * list.length)];
          setAd(selected);
        }
      } catch (err) {
        console.error("Failed to load ad for zone:", zone, err);
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [zone]);

  useEffect(() => {
    if (!ad || trackedImpression.current) return;

    // Track impression when ad is displayed
    async function trackImpression() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
        await fetch(`${baseUrl}/api/ads/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adId: ad.id, action: "impression" })
        });
        trackedImpression.current = true;
      } catch (err) {
        console.error("Failed to track ad impression", err);
      }
    }

    trackImpression();
  }, [ad]);

  const handleClick = async () => {
    if (!ad) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
      await fetch(`${baseUrl}/api/ads/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id, action: "click" })
      });
    } catch (err) {
      console.error("Failed to track ad click", err);
    }
  };

  if (loading || !ad) return null;

  return (
    <div className="w-full my-6 flex justify-center">
      {ad.type === "adsense" ? (
        <div 
          className="overflow-hidden max-w-full"
          dangerouslySetInnerHTML={{ __html: ad.code }} 
        />
      ) : (
        <a 
          href={ad.targetUrl || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md"
        >
          {ad.imageUrl && (
            <img 
              src={ad.imageUrl} 
              alt={ad.name} 
              className="w-full h-auto object-cover max-h-[160px] sm:max-h-[220px]" 
            />
          )}
        </a>
      )}
    </div>
  );
}
