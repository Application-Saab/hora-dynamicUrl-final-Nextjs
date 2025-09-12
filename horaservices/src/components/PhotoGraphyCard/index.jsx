import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphycard.css";

export default function PhotoGraphyCard({ src, title }) {
    const router = useRouter();
     const handleViewMore = () => {
     const slug = title.trim().replace(/\s+/g, "-");
      router.push(`/photography-page/${slug}`);
    };
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
        <button className="viewMore" onClick={handleViewMore}>View more</button>
      </div>
    </div>
  );
}



