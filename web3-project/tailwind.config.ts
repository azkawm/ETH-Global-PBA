import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class", // Pastikan darkMode berada di tingkat atas
  theme: {
    extend: {
      colors: {
        blues: "#00203F",
        greens: "#a4f9c8",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(140deg, #14b8a6, #003566)", // teal-500 (#14b8a6)
      },
    },
  },
  plugins: [],
} satisfies Config;
