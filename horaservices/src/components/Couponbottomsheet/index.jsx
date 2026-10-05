import { useEffect, useRef } from "react";
import "./Couponbottomsheet.css";
import Image from "next/image";
import { useLockBodyScroll } from "@/utils/Uselockbodyscroll";
import couponImage from "@/assets/couponimg.webp";
import iconFree from "@/assets/Absolutely_Free.svg";
import iconValid from "@/assets/100_Vaild.svg";
import iconPremium from "@/assets/Premimum_Quality.svg";
import iconSupport from "@/assets/Support.svg";
import iconWhatsapp from "@/assets/whatsapp-icon.png";

/**
 * Bottom se open hone wala coupon sheet.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   <button onClick={() => setOpen(true)}>Offer dekho</button>
 *   <CouponBottomSheet open={open} onClose={() => setOpen(false)} />
 */
export default function CouponBottomSheet({
  open,
  onClose,
  amount = 150,
  code = "HORA150",
  whatsappNumber = "917338584828",
  eventDate = "",
  message = "",
}) {
  const rootRef = useRef(null);

  useLockBodyScroll(open);

  // GTM: popup khulne par
  useEffect(() => {
    if (!open) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "coupon_150_popup_view" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Band hone par andar ke buttons Tab se focus na ho (inert)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  const handleWhatsApp = () => {
    const finalMessage =
      message ||
      `Hi! My event is approaching soon, I need help with the arrangements.\nCoupon Code - ${code}` +
        (eventDate ? `\nEvent date - ${eventDate}` : "");

    // GTM: WhatsApp click
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "coupon_150_whatsapp_click" });

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMessage)}`,
      "_blank"
    );
  };

  return (
    <div
      ref={rootRef}
      className={`cbs-root ${open ? "cbs-open" : ""}`}
      aria-hidden={!open}
    >
      {/* Backdrop - click par band */}
      <div className="cbs-backdrop" onClick={onClose} />

      {/* Wrapper: ye slide hota hai, ✕ aur sheet dono isi ke andar hain */}
      <div className="cbs-sheet-wrap">
        <button className="cbs-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div
          className="cbs-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Special offer"
        >
          {/* Coupon card */}
          <Image
            src={couponImage}
            alt="Special Offer"
            width={235}
            height={131}
            className="cbs-coupon-image"
          />

          <h3 className="cbs-title">Here's a Special Treat For You!</h3>
          <p className="cbs-sub">
            Use this exclusive coupon <b>₹{amount} OFF</b> auto-applied in
            WhatsApp, no copying needed.
          </p>

          {/* Code applied strip */}
          <div className="cbs-applied">
            <span className="cbs-tick">✓</span>
            <div>
              <b>Code: {code.replace(/(\D+)(\d+)/, "$1 $2")}</b>
              <p>Applied automatically in your WhatsApp chat</p>
            </div>
          </div>

          {/* 3 features */}
          <div className="cbs-features">
            <div>
              <Image src={iconPremium} alt="" width={35} height={35} unoptimized className="cbs-ficon-img" />
              <b>₹{amount} OFF</b>
              <p>On Order Booking</p>
            </div>
            <div>
              <Image src={iconValid} alt="" width={35} height={35} unoptimized className="cbs-ficon-img" />
              <b>100% Valid</b>
              <p>On All Services</p>
            </div>
            <div>
              <Image src={iconFree} alt="" width={35} height={35} unoptimized className="cbs-ficon-img" />
              <b>Limited Time</b>
              <p>Grab it now!</p>
            </div>
          </div>

          {/* Expert box */}
          <div className="cbs-expert">
            <span className="cbs-wa-circle">
              <Image
                src={iconWhatsapp}
                alt=""
                width={30}
                height={30}
                unoptimized
                className="cbs-wa-img"
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
              className="cbs-support-img"
            />
          </div>

          {/* CTA */}
          <button className="cbs-cta" onClick={handleWhatsApp}>
            <Image
              src={iconWhatsapp}
              alt=""
              width={38}
              height={38}
              unoptimized
              className="cbs-wa-img"
            />
            Get ₹{amount} OFF – Chat Now
          </button>

          <div className="cbs-foot">
            <span>🔒 Secure &amp; Private</span>
            <span>💬 Free Expert Support</span>
            <span>⚡ Instant Response</span>
          </div>
        </div>
      </div>
    </div>
  );
}