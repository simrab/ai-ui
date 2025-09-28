import type { NextConfig } from "next";
import * as path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: { root: path.join(__dirname, "..") },
  env: {
    GEMINI_API_KEY: "AIzaSyDmNCgBCSfS4tXCrfH0WKU5uJZvAjlXkv8",
  },
};

export default nextConfig;
