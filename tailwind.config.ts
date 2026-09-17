import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F0EEE6",
        paper: "#FAF9F4",
        ink: "#25211C",
        inkmuted: "#6B6459",
        hairline: "#E4DFD1",
        clay: "#C1613C",
        clayDeep: "#A64F30",
        clayTint: "#F3DDCF",
        sage: "#5F6E52",
        sageTint: "#E4E9D9",
        slate: "#57667A",
        slateTint: "#DEE4EA",
        loss: "#B3492D",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(37,33,28,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
