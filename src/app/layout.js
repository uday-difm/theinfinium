import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getLayoutData } from "../services/layout.service";
import { Inter, Raleway } from "next/font/google";

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

        {/* 1. Google Search Console Verification */}
        {layout.analytics?.searchConsoleVerification && (
          <meta name="google-site-verification" content={layout.analytics.searchConsoleVerification} />
        )}

        {/* 2. Google Analytics 4 */}
        {layout.analytics?.gaMeasurementId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${layout.analytics.gaMeasurementId}`} />
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${layout.analytics.gaMeasurementId}', { page_path: window.location.pathname });
              `
            }} />
          </>
        )}

        {/* 3. Microsoft Clarity */}
        {layout.analytics?.clarityId && (
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${layout.analytics.clarityId}");
            `
          }} />
        )}

        {/* 4. Meta Pixel */}
        {layout.analytics?.metaPixelId && (
          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${layout.analytics.metaPixelId}');
              fbq('track', 'PageView');
            `
          }} />
        )}

        {/* 5. LinkedIn Tag */}
        {layout.analytics?.linkedInTagId && (
          <script dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "${layout.analytics.linkedInTagId}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
              (function(l) {
                if (!l) return;
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);
              })(window.lintrk);
            `
          }} />
        )}

        {/* 6. Google AdSense */}
        {layout.analytics?.googleAdSenseId && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${layout.analytics.googleAdSenseId}`} crossorigin="anonymous" />
        )}

        {/* 7. OneSignal Push Notification */}
        {layout.oneSignalAppId && (
          <>
            <script async src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" />
            <script dangerouslySetInnerHTML={{
              __html: `
                window.OneSignalDeferred = window.OneSignalDeferred || [];
                window.OneSignalDeferred.push(async function(OneSignal) {
                  await OneSignal.init({
                    appId: "${layout.oneSignalAppId}",
                  });
                });
              `
            }} />
          </>
        )}

        {/* 8. Google reCAPTCHA v3 */}
        {layout.securityControls?.recaptchaSiteKey && (
          <script async src={`https://www.google.com/recaptcha/api.js?render=${layout.securityControls.recaptchaSiteKey}`} />
        )}
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
      </body>
    </html>
  );
}
