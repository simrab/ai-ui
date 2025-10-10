// postcss.config.mjs
// We need to import the plugin this way for Vitest to work correctly.
import tailwindcssPostcss from "@tailwindcss/postcss";

const config = {
  plugins: [tailwindcssPostcss],
};

export default config;

