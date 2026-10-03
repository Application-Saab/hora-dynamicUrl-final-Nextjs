import { useEffect, useRef } from "react";
import "./Invitesheet.css";
import Image from "next/image";

// Banner (Your Celebration Our Priority + invite cards + ₹500)
import bannerImage from "@/assets/invitebanner.webp";

// Feature icons
import iconInvite from "@/assets/Free_Invite_Creation.svg";
import iconGuest from "@/assets/Guest_Track.svg";
import iconChat from "@/assets/Cheer_chat.svg";
import iconPhotos from "@/assets/Uploards_Photos.svg";
import iconNotes from "@/assets/Write_Guest_Notes.svg";
import iconShare from "@/assets/Share_Icon.svg";

// Expert box icons
import iconWhatsapp from "@/assets/whatsapp-icon.svg";
import iconSupport from "@/assets/Support.svg";


const FEATURES = [
  { title: "Free Invite Creation", sub: "Create invites at no cost", icon: iconInvite },
  { title: "Guest Track", sub: "Manage guests Easily", icon: iconGuest },
  { title: "Cheer Chat", sub: "Chat with guests", icon: iconChat },
  { title: "Upload Your Photos", sub: "Upload special moments", icon: iconPhotos },
  { title: "Write Guest Notes", sub: "Write something special", icon: iconNotes },
  { title: "Share", sub: "Share Instantly", icon: iconShare },
];

export default function InviteSheet({
  open,
  onClose,
  whatsappNumber = "919999999999", // apna number daalo (country code ke saath)
  message = "Hi! Mujhe free invite create karna hai.",
}) {
  const rootRef = useRef(null);

  // ESC se band + background scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Band hone par Tab focus na jaye
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div
      ref={rootRef}
      className={`ivs-root ${open ? "ivs-open" : ""}`}
      aria-hidden={!open}
    >
      <div className="ivs-backdrop" onClick={onClose} />

      <div className="ivs-wrap">
        <button className="ivs-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div
          className="ivs-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Free invite offer"
        >
          {/* Banner image */}
          <Image
            src={bannerImage}
            alt="Your Celebration, Our Priority - Invite worth ₹500"
            className="ivs-banner"
            priority
          />

          {/* 6 features (3 x 2) */}
          <div className="ivs-features">
            {FEATURES.map((f) => (
              <div className="ivs-feature" key={f.title}>
                <Image
                  src={f.icon}
                  alt=""
                  width={35}
                  height={35}
                  unoptimized
                  className="ivs-ficon-img"
                />
                <b>{f.title}</b>
                <p>{f.sub}</p>
              </div>
            ))}
          </div>

          {/* Expert box */}
          <div className="ivs-expert">
            <span className="ivs-wa-circle">
                        <Image
             src={iconWhatsapp}
             alt=""
             width={30}
             height={30}
             unoptimized
             className="ivs-wa-img"
           />
                       </span>
            <div>
              <b>Our expert is here to help!</b>
              <p>
                Our event expert will guide you on WhatsApp and help you plan
                everything.
              </p>
            </div>
            <Image
              src={iconSupport}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="ivs-support-img"
            />
          </div>

          {/* CTA */}
          <button className="ivs-cta" onClick={handleWhatsApp}>
              <Image
             src={iconWhatsapp}
             alt=""
             width={30}
             height={30}
             unoptimized
             className="ivs-wa-img"
           />
            Get This Free – Chat Now
          </button>

          <div className="ivs-foot">
            <span>🔒 Secure &amp; Private</span>
            <span>💬 Free Expert Support</span>
            <span>⚡ Instant Response</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// CTA button ke andar white icon (green button par)