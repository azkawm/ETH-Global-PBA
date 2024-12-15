import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class", // Pastikan darkMode berada di tingkat atas
  theme: {
    extend: {
      colors: {
        bluess: "#0C1C34",
        blues: "#040C1C",
        greens: "#00a1ac",
        grens: "#00c59d",
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
