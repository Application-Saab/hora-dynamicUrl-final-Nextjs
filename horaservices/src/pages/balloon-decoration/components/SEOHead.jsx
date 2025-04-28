import { getDecorationOrganizationSchema } from "@/utils/schema";
import Head from "next/head";
import React from "react";

function SeoHead() {
  const schemaOrg = getDecorationOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

  return (
    <>
       <Head>
          <title>HORA Decorations : Professional Balloon & Flower Decorations for Birthdays, Parties, & Weddings – Starting at ₹1199</title>
          <meta name="description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
          <meta name="keywords" content="birthday decoration, anniversary decoration, party themes decorations, candlelight dinners, welcome baby decoration, baby shower decoration, first night decorations, haldi decoration, mehndi decoration, balloon room decoration, birthday decorators near me" />
          <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
          <meta property="og:description" content="🎉 Explore a wide range of stunning decoration designs for every event and party, including 🎂 birthdays, 🧸 kids' parties, 💍 anniversaries, 💃 bachelorette parties, 👶 baby showers, 🍼 naming ceremonies, and 🌙 first nights. Choose your ideal design and book directly through our website for a seamless experience. Need help? Reach out to us at 7338584828 for friendly support and personalised assistance. 😊" />
          <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
          <meta property="og:image:alt" content="birthday decoration, anniversary decoration, party themes decorations, candlelight dinners, welcome baby decoration, baby shower decoration, first night decorations, haldi decoration, mehndi decoration, balloon room decoration, birthday decorators near me" />
          <script type="application/ld+json">{scriptTag}</script>  
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Hora Services" />
          <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
          <meta property="og:url" content="https://horaservices.com/balloon-decoration" />
          <meta property="og:type" content="website" />
      </Head>
    </>
  );
}

export default SeoHead;
