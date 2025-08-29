/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Your existing patterns
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },

      // --- ADD THIS BLOCK FOR GOOGLE USER IMAGES ---
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // ---------------------------------------------
    ],
  },
};

export default nextConfig;