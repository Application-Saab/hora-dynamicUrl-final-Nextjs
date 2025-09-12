import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphyCardgrid.css";

export default function PhotoGraphyCardgrid({ src, title }) {
  const router = useRouter();
   const handleViewMore = () => {
    const slug = title.trim().replace(/\s+/g, "-");
    router.push(`/photography-page/${slug}`);
  };
  return (
    <div className="cardgrid">
      <div className="imageWrappergrid">
        <Image src={src} alt={title} fill className="image" priority />
          <div className="imageOverlaygrid"></div> 
        <div className="titleWrappergrid">
          <h3 className="titlegrid">{title}</h3>
        </div>
      </div>
      <div className="footergrid">
        <button className="viewMoregrid"  onClick={handleViewMore}>View more</button>
      </div>
    </div>
  );
}



