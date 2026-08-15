"use client";

import Decoration from "@/components/Decoration/Decoration";
import { useParams } from "next/navigation";

const BalloonDecorationInstagramCity = () => {
  const params = useParams();
 const city = params?.city || "";

  return (
    <div>
      <Decoration city={city} />
    </div>
  );
};

export default BalloonDecorationInstagramCity;
