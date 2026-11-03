'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'
import { getHomeOrganizationSchema } from "../utils/schema";

const inter = Inter({ subsets: ["latin"] });
const schemaOrg = getHomeOrganizationSchema();
const scriptTag = JSON.stringify(schemaOrg);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-K3SCKLTZ" />
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
