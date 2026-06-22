/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Airtable serves attachment images from these hosts.
    // NOTE: Airtable attachment URLs are temporary (expire after a few hours).
    // For production, re-host images on a CDN (see README) — but with ISR
    // revalidation below the URLs refresh well within their validity window.
    remotePatterns: [
      { protocol: "https", hostname: "v5.airtableusercontent.com" },
      { protocol: "https", hostname: "dl.airtable.com" },
      { protocol: "https", hostname: "*.airtableusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
