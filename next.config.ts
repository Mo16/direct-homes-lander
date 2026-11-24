import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  /**
   * The app links its sign-up terms and privacy notice here. Until each has its own page (the text needs a solicitor),
   * they land on the legal index rather than a 404. Temporary on purpose, so the real pages can take over.
   */
  async redirects() {
    return ["privacy", "terms-landlords", "terms-tenants"].map((page) => ({ source: `/legal/${page}`, destination: "/legal", permanent: false }));
  },
};

export default nextConfig;
