'use client';
import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Head from "next/head"; 
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleTagManager } from '@next/third-parties/google'


const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {

  // branch changes
  return (
    <html lang="en">
      <Head>
      </Head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}