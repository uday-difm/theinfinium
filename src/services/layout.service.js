/**
 * Layout service — fetches global settings, navigation, and footer data
 * for the infinium frontend, with local fallback.
 */
import { cms } from "@/lib/cms";

const FALLBACK = {
  siteName: "The Infinium",
  logoUrl: "/Logo.png",
  footerLogoUrl: "/FooterLogo.png",
  faviconUrl: "/favicon.ico",
  tagline: "Exposing Lending Lies. Empowering Business Truths.",
  navigation: [],
  footerLinks: [],
  copyright: `© ${new Date().getFullYear()} The Infinium. All rights reserved.`,
};

/**
 * Fetch all layout data from CMS in parallel.
 * Returns { siteName, logoUrl, footerLogoUrl, tagline, faviconUrl, navigation, footerLinks, footerColumns, copyright, isActive, maintenanceMode, maintenanceMessage }.
 */
export async function getLayoutData() {
  try {
    const [settingsResponse, globalSettingsData, navigationData, footerData, legalPagesData] = await Promise.all([
      fetchSettings(),
      cms.getGlobalSettings().catch(() => null),
      cms.getNavigation().catch(() => ({ items: [] })),
      cms.getFooterLayout().catch(() => null),
      fetchLegalPages().catch(() => []),
    ]);

    const isActive = settingsResponse?.isActive !== false;
    const globalSettings = globalSettingsData?.settings || globalSettingsData || {};
    const ws = settingsResponse?.websiteSettings || globalSettings.websiteSettings || {};
    const header = globalSettings.header || {};
    const navItems = navigationData?.items || [];
    const footer = footerData?.footer || footerData || {};

    const dbLogoUrl = header.logoUrl || ws.logoUrl;
    const dbFooterLogoUrl = footer.logoUrl || (footer.columns && footer.columns[0]?.logoUrl) || dbLogoUrl;

    const dbLegalPages = legalPagesData || [];
    const mappedLegalLinks = dbLegalPages.map(page => {
      let slugType = page.type;
      if (page.type === "privacy") slugType = "privacy-policy";
      else if (page.type === "terms") slugType = "terms-of-use";
      else if (page.type === "cookies") slugType = "cookie-policy";
      
      return {
        label: page.title,
        url: `/legal/${slugType}`
      };
    });

    const baseFooterLinks = footer.links || footer.items || [];
    const footerLinks = baseFooterLinks.length > 0 ? [...baseFooterLinks] : [
      { label: "About", url: "/about" },
      { label: "Contact Us", url: "/contact" }
    ];

    mappedLegalLinks.forEach(link => {
      if (!footerLinks.some(fl => fl.url === link.url || fl.label.toLowerCase() === link.label.toLowerCase())) {
        footerLinks.push(link);
      }
    });

    return {
      siteName: ws.title || FALLBACK.siteName,
      logoUrl: dbLogoUrl || FALLBACK.logoUrl,
      footerLogoUrl: dbFooterLogoUrl || FALLBACK.footerLogoUrl,
      tagline: ws.tagline || FALLBACK.tagline,
      faviconUrl: ws.favicon || FALLBACK.faviconUrl,
      navigation: navItems,
      footerLinks,
      footerColumns: footer.columns || [],
      copyright: footer.copyright || FALLBACK.copyright,
      isActive,
      maintenanceMode: ws.maintenanceMode === true,
      maintenanceMessage: ws.maintenanceMessage || "We are currently undergoing scheduled maintenance. Please check back shortly.",
      analytics: settingsResponse?.analytics || null,
      securityControls: settingsResponse?.securityControls || null,
      oneSignalAppId: settingsResponse?.oneSignalAppId || null,
      rawSettings: settingsResponse || {},
    };
  } catch (err) {
    console.error("getLayoutData failed, using fallback:", err);
    return {
      ...FALLBACK,
      isActive: true,
      maintenanceMode: false,
      maintenanceMessage: "",
    };
  }
}

async function fetchSettings() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
  try {
    const res = await fetch(
      `${baseUrl}/api/settings?siteId=${encodeURIComponent(siteId)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;
      if (payload) return payload;
    }
  } catch (e) {
    // fall through
  }

  try {
    const data = await cms.getGlobalSettings();
    return {
      isActive: true,
      websiteSettings: data?.settings?.websiteSettings || data?.websiteSettings || null
    };
  } catch (e) {
    return null;
  }
}

async function fetchLegalPages() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
  try {
    const res = await fetch(
      `${baseUrl}/api/legal?siteId=${encodeURIComponent(siteId)}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      const payload = json.data?.legalPages ?? json.legalPages ?? [];
      return payload;
    }
  } catch (e) {
    console.error("fetchLegalPages failed:", e);
  }
  return [];
}
