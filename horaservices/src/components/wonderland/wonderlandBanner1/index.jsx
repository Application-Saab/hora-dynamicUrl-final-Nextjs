import Image from "next/image";
import WonderlandbannerImg from "@/assets/wonderland/wonderlandimagebanner.webp";
import arrowIcon from "@/assets/arrowicon.svg";
export default function CelebrationSection({onCreateInvite}) {
  return (
    <div className="celebration-wrapper">
      
      {/* LEFT IMAGE */}
      <div className="image-box">
        <Image
          src={WonderlandbannerImg}
          alt="celebration"
          className="left-image"
          priority
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="celebration-content">
        <h2 className="title">Celebration Wall</h2>

        <p className="subtitle">
          Collaborative event gallery of private moments
        </p>

        <p className="description">
          Upload photos and videos to keep memories alive forever.
          Don’t let your best shots get lost in WhatsApp chats!
        </p>

        <button className="cta-btn" onClick={onCreateInvite}>
          Create Invite 
           <Image
    src={arrowIcon}
    alt="arrow"
    width={16}
    height={16}
    className="arrow-img"
  />
        </button>
      </div>

    </div>
  );
}