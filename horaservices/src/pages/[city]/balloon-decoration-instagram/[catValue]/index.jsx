"use client";

import DecorationCatPage from "@/pages/balloon-decoration/[catValue]";
import { useParams } from "next/navigation";

const BalloonDecorationInstagramCategory = () => {
  const params = useParams();
  const { city = "", catValue = "" } = params || {};

  return (
    <div>
      <DecorationCatPage city={city} catValue={catValue} />
    </div>
  );
};

export default BalloonDecorationInstagramCategory;
