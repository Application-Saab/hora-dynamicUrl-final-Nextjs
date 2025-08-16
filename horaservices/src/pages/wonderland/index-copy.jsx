import WonderlandLandingPage from "@/components/wonderland/WonderlandLandingPage";
import { useRouter } from "next/router";
import React from "react";

const index = () => {
  const router = useRouter();
  const slug = router.query.slug || [];

  return <WonderlandLandingPage slug={slug} />;
};

export default index;
