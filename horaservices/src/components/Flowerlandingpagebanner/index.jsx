import Image from "next/image";
import Link from "next/link";
import "./flowerlandingpagebanner.css";

// Apne project ke hisaab se path badal lena
import bannerImg from "@/assets/flowerlandingbannerImg.webp";
import arrowIcon from "@/assets/arrowicon.svg";

export default function FlowerBanner({
  image = bannerImg,
  href = "/",
  buttonText = "Explore Now",
}) {
  return (
    <section className="flower-banner">
      <div className="page-width">
        <div className="flower-banner__wrap">
          <Image
            src={image}
            alt="Beautiful flower decoration for every celebration"
            className="flower-banner__img"
            priority
          />

          <Link href={href} className="flower-banner__btn">
            {buttonText}
            <Image
              src={arrowIcon}
              alt=""
              aria-hidden="true"
              className="flower-banner__arrow"
              width={16}
              height={16}
              unoptimized
            />
          </Link>
        </div>
      </div>
    </section>
  );
}