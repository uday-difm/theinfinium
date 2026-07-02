import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getLayoutData } from "../services/layout.service";
import { Inter, Raleway } from "next/font/google";
import { GlobalAnalytics, CookieConsentBanner, OneSignalScript } from "@yourcompany/global-backend-next/components";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-raleway",
});

export const metadata = {
  title: "The Infinium - Exposing Lending Lies. Empowering Business Truths.",
  description:
    "A research portal, compliance guide, and analysis platform dedicated to Merchant Cash Advances (MCA) and business funding transparency.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const layout = await getLayoutData();
  const fontClasses = `${inter.variable} ${raleway.variable}`;

  if (!layout.isActive) {
    return (
      <html lang="en" className={`h-full antialiased ${fontClasses}`}>
        <head>
          <title>{layout.siteName} - Deactivated</title>
          <link rel="icon" href={layout.faviconUrl} />
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
          <div className="text-center max-w-md mx-auto px-6 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              Site Deactivated
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              This website is currently deactivated by the administrator. Please check back later.
            </p>
          </div>
        </body>
      </html>
    );
  }

  if (layout.maintenanceMode) {
    return (
      <html lang="en" className={`h-full antialiased ${fontClasses}`}>
        <head>
          <title>{layout.siteName} - Maintenance</title>
          <link rel="icon" href={layout.faviconUrl} />
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
          <div className="text-center max-w-md mx-auto px-6 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5h0" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
              Under Maintenance
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed font-normal">
              {layout.maintenanceMessage}
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`h-full ${fontClasses}`}>
      <head>
        <link rel="icon" href={layout.faviconUrl} />

        {/* Google reCAPTCHA v3 */}
        {layout.securityControls?.recaptchaSiteKey && (
          <script async src={`https://www.google.com/recaptcha/api.js?render=${layout.securityControls.recaptchaSiteKey}`} />
        )}

        {/* Google AdSense */}
        {layout.analytics?.googleAdSenseId && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${layout.analytics.googleAdSenseId}`} crossOrigin="anonymous" />
        )}

        {/* Unified SDK Global Analytics & OneSignal Script */}
        <GlobalAnalytics settings={layout.rawSettings} />
        <OneSignalScript settings={layout.rawSettings} />
      </head>
      <body className="flex min-h-full flex-col bg-slate-50">
        <Header
          siteName={layout.siteName}
          logoUrl={layout.logoUrl}
          tagline={layout.tagline}
          navigation={layout.navigation}
        />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer
          siteName={layout.siteName}
          logoUrl={layout.footerLogoUrl}
          tagline={layout.tagline}
          navigation={layout.navigation}
          footerLinks={layout.footerLinks}
          footerColumns={layout.footerColumns}
          copyright={layout.copyright}
        />

        {/* Unified SDK Cookie Consent Banner */}
        <CookieConsentBanner 
          complianceSettings={layout.rawSettings?.compliance} 
          siteId={process.env.NEXT_PUBLIC_SITE_ID || "infinium"} 
          baseUrl={process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000"} 
        />
      </body>
    </html>
  );
}
