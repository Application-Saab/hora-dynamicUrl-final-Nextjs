import React, { useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getDecorationCatOrganizationSchema } from "../../../../../utils/schema";
import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";
// import DecorationCatPage from "@/components/DecorationCatPage"; // Move component from pages to components if needed

const DecorationLocalityCatPage = () => {
  const router = useRouter();
  const { city, catValue, locality } = router.query;

  const schemaOrg = getDecorationCatOrganizationSchema(catValue);
  const scriptTag = JSON.stringify(schemaOrg);


  return (
    <div className="decCatPage" style={{ backgroundColor: "#EDEDED" }}>
     

      <DecorationCatPage city={city} locality={locality}/>
    </div>
  );
};

export default DecorationLocalityCatPage;
