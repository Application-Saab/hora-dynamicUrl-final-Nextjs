'use client';
import { Inter } from "next/font/google";
import Head from "next/head"; 
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <GoogleTagManager />
      </Head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
