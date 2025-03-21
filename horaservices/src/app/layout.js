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

  useEffect(() => {
    // Google Tag Manager script for GTM
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
      console.log('GTM Script Loaded'); // Debugging log
    })(window,document,'script','dataLayer','GTM-K3SCKLTZ');
  }, []);

  // branch changes
  return (
    <html lang="en">
      <Head>
        <GoogleTagManager />
      </Head>
      <body className={inter.className}>
      {/* <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe>
        </noscript> */}
        <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}