import Image from "next/image";
import { useRouter } from "next/router";
import "./photoGraphyCardgrid.css";

export default function PhotoGraphyCardgrid( {src, title, subCategory }) {
  const router = useRouter();
 const handleViewMore = () => {
    if (!subCategory) return; // safety check
    router.push(`/photography-page/${subCategory}`);
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





