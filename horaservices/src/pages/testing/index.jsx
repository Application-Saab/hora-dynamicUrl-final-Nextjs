import { useEffect, useState } from "react";
import Link from "next/link";

export default function SvgList() {
  const [svgs, setSvgs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/api/svgs")
      .then((res) => res.json())
      .then((data) => setSvgs(data))
      .catch((err) => console.error("Error fetching SVGs:", err));
  }, []);

  return (
    <div>
      <h1>SVG List</h1>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {svgs.map((svg, index) => (
          <Link key={index} href={`/testing/${svg.replace(".svg", "")}`}>
            <img
              src={`http://localhost:3002/api/svgs/${svg}`}
              alt={svg}
              width="300"
              height="300"
              style={{ cursor: "pointer", border: "1px solid black" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
