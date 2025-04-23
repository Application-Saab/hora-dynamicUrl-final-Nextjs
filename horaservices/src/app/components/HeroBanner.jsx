import React from "react";
import decorationbanner from "../../assets/decoration-home-banner.jpg";
import Image from "next/image";

export function HeroBanner({openDecorationPage}) {
  return (
    <div className="container my-2">
      <h1 className="text-center text-purple fw-bold display-5 position-relative party-title">
        All party services on one platform
      </h1>

      <div className="my-3">
        <div className="cursor-pointer" onClick={() => openDecorationPage()}>
          <Image
            src={decorationbanner}
            alt="Decoration services, Balloon decoration, decoration for birthday party"
            width={1200}
            height={400}
            className="img-fluid w-100"
          />
        </div>
      </div>
    </div>
  );
}
