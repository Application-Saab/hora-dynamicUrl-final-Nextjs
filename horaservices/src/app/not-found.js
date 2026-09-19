import Link from "next/link";
import Image from "next/image";

import NotFoundImage from "../assets/NotFoundImage.png";
import arrowicon from "@/assets/arrowicon.svg";

import "./not-found.css";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Image src={NotFoundImage} alt="404 Not Found" width={312} height={254} />

      <h1 className="oops-txt">OOPS!</h1>

      <h3 className="not-found-txt">
        The page you’re looking for <br />
        doesn’t exist.
      </h3>

      <p className="not-found-inst">
        It might be moved, deleted, or the link might be incorrect. <br />
        But don’t worry — you can still find your way back!
      </p>

      <Link href="/" className="not-found-go-home-btn">
        Go To Homepage
        <Image className="photoPkgArrow" src={arrowicon} alt="Arrow" />
      </Link>
    </main>
  );
}
