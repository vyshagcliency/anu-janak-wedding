import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-handwriting",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anu & Janak — April 26, 2026",
  description:
    "Join us as we celebrate the wedding of Anu & Janak. A promise for a Lifetime.",
  openGraph: {
    title: "Anu & Janak — April 26, 2026",
    description: "A promise for a Lifetime.",
    type: "website",
    images: [
      {
        url: "/images/timeline/img4.jpeg",
        width: 1200,
        height: 630,
        alt: "Anu & Janak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anu & Janak — April 26, 2026",
    description: "A promise for a Lifetime.",
    images: ["/images/timeline/img4.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${dancingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
