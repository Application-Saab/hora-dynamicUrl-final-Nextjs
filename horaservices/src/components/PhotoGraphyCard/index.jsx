import Image from "next/image";
import "./photoGraphycard.css";

export default function PhotoGraphyCard({ src, title }) {
  return (
    <div className="card">
      <div className="imageWrapper">
        <Image src={src} alt={title} fill className="image" priority />
          <div className="imageOverlay"></div> 
        <div className="titleWrapper">
          <h3 className="title">{title}</h3>
        </div>
      </div>
      <div className="footer">
        <button className="viewMore">View more</button>
      </div>
    </div>
  );
}



