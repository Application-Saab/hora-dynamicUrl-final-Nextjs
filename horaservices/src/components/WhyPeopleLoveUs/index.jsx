import Image from "next/image";
import "./WhyPeopleLoveUs.css";

/**
 * stats = [{ icon: "/images/icon1.png", number: "10K+", label: "Happy Customers" }, ...]
 */
export default function WhyPeopleLoveUs({ stats = [] }) {
  return (
    <section className="why-people-love-us">
      <div className="page-width">
        <h2>Why People Love Us</h2>

        <div className="stats-line-container">
          {stats.map((item, index) => (
            <div key={index} className="stat-item">
              <Image
                src={item.icon}
                alt={item.label}
                width={70}
                height={50}
              />
              <h3>{item.number}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}