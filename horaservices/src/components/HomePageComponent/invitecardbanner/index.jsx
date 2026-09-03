import "./invitecardbanner.css";
import invitationImage from "@/assets/Homepageimages/invitation-envelope.jpg";
import iconQuick from "@/assets/Homepageimages/icon-quick.webp";
import iconBeautiful from "@/assets/Homepageimages/icon-beautiful.webp";
import iconShare from "@/assets/Homepageimages/icon-share.webp";
import Image from "next/image";
import editIcon from "@/assets/Homepageimages/edit-icon.svg";
import arrowIcon from "@/assets/Homepageimages/arrow-right.svg";
const features = [
  {
    label: "Quick",
    text: "Create in mins",
    icon: iconQuick,
  },
  {
    label: "Beautiful",
    text: "Stunning designs",
    icon: iconBeautiful,
  },
  {
    label: "Share",
    text: "With loved ones",
    icon: iconShare,
  },
];

export default function InviteCard({ onCreate }) {
  return (
    <div className="invite-card">
      <div className="invite-card-content">
        <div className="invite-card-text">
          <h2>Create Smart Invitation</h2>
          <p>Design beautiful invites in minutes for any celebration</p>

          <div className="feature-row">
            {features.map((f) => (
              <div className="feature" key={f.label}>
                <Image src={f.icon} alt={f.label} className="feature-icon" />
                <div className="feature-text">
                  <b>{f.label}</b>
                  <span>{f.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Image
          src={invitationImage}
          alt="Invitation envelope with cards"
          className="invite-illustration"
        />
      </div>

     <button className="cta-btn" onClick={onCreate}>
  <Image
    src={editIcon}
    alt="Edit"
    width={20}
    height={20}
    className="cta-icon"
  />

  Create Invitation

  <Image
    src={arrowIcon}
    alt="Arrow"
    width={20}
    height={20}
    className="cta-icon"
  />
</button>
    </div>
  );
}