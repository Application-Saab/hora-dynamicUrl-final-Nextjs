import {
  MdPhotoLibrary,
  MdOutlinePhotoSizeSelectActual,
  MdAccessTime,
  MdGroups,
  MdSupportAgent,
} from "react-icons/md";

import "./whychoosehora.css";

const features = [
  {
    icon: <MdPhotoLibrary />,
    title: "Unlimited Photos",
  },
  {
    icon: <MdOutlinePhotoSizeSelectActual />,
    title: "HD Edited Image",
  },
  {
    icon: <MdAccessTime />,
    title: "On-Time Delivery",
  },
  {
    icon: <MdGroups />,
    title: "Dedicated Team",
  },
  {
    icon: <MdSupportAgent />,
    title: "24×7 Support",
  },
];

export default function WhyChooseHora() {
  return (
    <div className="whyhora-card">
      <h2 className="whyhora-title">Why Choose Hora ?</h2>

      <div className="whyhora-grid">
        {features.map((item, index) => (
          <div className="whyhora-item" key={index}>
            <div className="whyhora-icon">{item.icon}</div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}