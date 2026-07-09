import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import PageLayout from "../components/PageLayout";
import { homeMetadata } from "@/utils/metadata"; // ← import

const inter = Inter({ subsets: ["latin"] });

export const metadata = homeMetadata; // ← use

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}