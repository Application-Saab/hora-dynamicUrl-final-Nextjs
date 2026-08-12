


import React from "react";
import loader1 from "@/assets/loaderImage/loader1.svg"
import loader2 from "@/assets/loaderImage/loader2.svg"
import loader3 from "@/assets/loaderImage/loader3.svg"
import Image from "next/image";
const SequentialLoader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="icon icon1">
        <Image src={loader3} alt="icon2"  />
        </div>
        <div className="icon icon2">
            <Image src={loader1} alt="icon2"  />
        </div>
        <div className="icon icon3">
           <Image src={loader2} alt="icon3" />
        </div>
      </div>
    </div>
  );
};

export default SequentialLoader;
