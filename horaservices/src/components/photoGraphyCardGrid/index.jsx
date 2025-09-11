import Image from "next/image";
import "./photoGraphyCardgrid.css";

export default function PhotoGraphyCardgrid({ src, title }) {
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
        <button className="viewMoregrid">View more</button>
      </div>
    </div>
  );
}



