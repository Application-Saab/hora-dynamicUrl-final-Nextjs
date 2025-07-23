import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import checkImage from "../../../../../../../assets/tick.jpeg";
import { getDecorationProductOrganizationSchema } from "../../../../../../../utils/schema";
import "../../../../../../../css/decoration.css";
import DecorationCatDetails from "@/pages/balloon-decoration/[catValue]/product/[productName]";


const DecorationLocalityCatDetails = () => {
  const router = useRouter();
  const { city, locality, catValue, productName } = router.query;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (router.isReady && productName) {
      const formattedProductName = productName.replace(/-/g, " ");
      // 🧠 Replace this with your actual API call:
      fetch(`/api/getProductByName?name=${formattedProductName}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data);
        });
    }
  }, [router.isReady, productName]);

  const schemaOrg = product ? getDecorationProductOrganizationSchema(product) : null;

  const getItemInclusion = (inclusion) => {
    if (!Array.isArray(inclusion) || inclusion.length === 0) return null;

    const htmlString = inclusion[0];
    const withoutTags = htmlString.replace(/<[^>]*>/g, '');
    const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' ');
    const statements = withoutSpecialChars.split('<div>');
    const inclusionItems = statements.flatMap(statement =>
      statement.split("-").filter(item => item.trim() !== '')
    );

    return (
      <div>
        <div style={{ fontSize: "21px", borderBottom: "1px solid #e7eff9", marginBottom: "10px" }}>
          Inclusions
        </div>
        <ul>
          {inclusionItems.map((item, index) => (
            <li key={index} className="inclusionstyle">
              <Image src={checkImage} alt="check" style={{ height: 13, width: 13, marginRight: 10 }} />
              {item.trim()}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App" style={{ backgroundColor: "#EDEDED" }}>
      <Head>
        <title>{product?.name || "Balloon and Flower Decoration @999"}</title>
        <meta
          name="description"
          content={
            product?.metaDescription ||
            "Celebrate Anniversary, Birthday & other Occasions with Balloon Decorations"
          }
        />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content={product?.name || "Balloon Decoration by Hora"} />
        <meta
          property="og:description"
          content="Book affordable balloon and flower decoration services online!"
        />
        <meta
          property="og:image"
          content={product?.image || "https://horaservices.com/api/uploads/attachment-1706520980436.png"}
        />
        <meta
          property="og:url"
          content={`https://horaservices.com/${city}/${locality}/balloon-decoration/${catValue}/product/${productName}`}
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
        {schemaOrg && (
          <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        )}
      </Head>

      <DecorationCatDetails />
    </div>
  );
};

export default DecorationLocalityCatDetails;
