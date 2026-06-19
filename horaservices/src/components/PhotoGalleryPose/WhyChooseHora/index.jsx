import {
  MdPhotoLibrary,
  MdOutlinePhotoSizeSelectActual,
  MdAccessTime,
  MdGroups,
  MdSupportAgent,
} from "react-icons/md";

import "./whychoosehora.css";
import Unlimited from "@/assets//poselink/galleryicon.svg";
import HDicon from "@/assets/poselink/hdedit.svg";
import clock from "@/assets/poselink/clock.svg";
import user from "@/assets/poselink/user.svg";
import support from "@/assets/poselink/support.svg";
import Image from "next/image";
const features = [
  {
    icon: Unlimited,
    title: "Unlimited Photos",
  },
  {
    icon: HDicon,
    title: "HD Edited Image",
  },
  {
    icon: clock,
    title: "On-Time Delivery",
  },
  {
    icon: user,
    title: "Dedicated Team",
  },
  {
    icon: support,
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
            <div className="whyhora-icon">
              <Image
                src={item.icon}
                alt={item.title}
                width={32}
                height={32}
              />
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}