import { getDecorationProductOrganizationSchema } from "@/utils/schema";
import Head from "next/head";

export const DecorationDetailsHead=({catValue,product})=>{
    const schemaOrg = getDecorationProductOrganizationSchema(product);
    const scriptTag = JSON.stringify(schemaOrg);
  
    return(
        <Head>
        <title>Balloon and Flower Decoration @999</title>
        <meta name="description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
        <meta name="keywords" content="Balloon and Flower Decoration @999" />
        <meta property="og:title" content="Balloon and Flower Decoration by Professional Decorators" />
        <meta property="og:description" content="Celebrate Anniversary, Birthday & other Occasions with Candlelight Dinners, Surprises & Balloon Decorations" />
        <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
        <script type="application/ld+json">{scriptTag}</script>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
        <meta property="og:url" content={`https://horaservices.com/balloon-decoration/${catValue}/product/${product.name}`} />
        <meta property="og:type" content="website" />
      </Head>
    )
}