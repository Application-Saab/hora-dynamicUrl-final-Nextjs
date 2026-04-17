import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

// ✅ App Router mein metadata yahan export hoti hai
export const metadata = {
  title: "Party Services in India | Decoration, Catering, Photography & More | HORA",
  description:
    "Book party decoration, catering, photography & chef services for birthdays, anniversaries & events across India. 1000+ designs, verified vendors & easy booking. Plan your perfect party with HORA today!",
  keywords:
    "party services India, balloon decoration, catering services, chef at home, party photography, birthday decoration, anniversary decoration, event services India",
  robots: "index, follow",
  authors: [{ name: "Hora Services" }],
  alternates: {
    canonical: "https://horaservices.com/",
  },
  openGraph: {
    title: "Party Services in India | Decoration, Catering & More | HORA",
    description:
      "Book decoration, catering, photography & chef services for your events across India.",
    url: "https://horaservices.com/",
    type: "website",
    images: [
      {
        url: "https://horaservices.com/api/uploads/attachment-1711520474508.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Party Services in India | HORA",
    description:
      "Book decoration, catering, photography & chef services for your events across India.",
    images: [
      "https://horaservices.com/api/uploads/attachment-1711520474508.png",
    ],
  },
  icons: {
    icon: "https://horaservices.com/api/uploads/logo-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}