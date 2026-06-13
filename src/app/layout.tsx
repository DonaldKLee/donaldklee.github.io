import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const SITE = "https://donaldlee.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Donald Lee — builds things on the internet",
  description:
    "Donald Lee is a self-taught developer at UBC who builds AI tooling, hackathon projects, and the occasional 2am side quest. Currently interning at Amazon.",
  keywords: [
    "Donald Lee",
    "Donald Kevin Lee",
    "UBC",
    "Vancouver developer",
    "nwPlus",
    "Amazon intern",
    "portfolio",
    "software developer",
  ],
  authors: [{ name: "Donald Lee" }],
  openGraph: {
    title: "Donald Lee — builds things on the internet",
    description:
      "Self-taught developer at UBC building AI tooling and side projects. Come explore.",
    url: SITE,
    siteName: "Donald Lee",
    type: "website",
    images: [{ url: "/images/SEO_BG.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donald Lee — builds things on the internet",
    description:
      "Self-taught developer at UBC building AI tooling and side projects.",
    creator: "@HiDonaldLee",
  },
  icons: {
    icon: [
      { url: "/images/DL_Logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/images/DL_Logo_white.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
