import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import "@/styles/globals.css";
import { Providers } from "@/app/providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ReviewAI — AI-powered code review, on every commit",
  description:
    "ReviewAI pairs static analysis with an AI reviewer to catch bugs, code smells, and security issues before they ship.",
};

// Prevents a flash of the wrong theme on first paint by applying the class
// before React hydrates, reading the same localStorage key ThemeProvider uses.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('acr-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
