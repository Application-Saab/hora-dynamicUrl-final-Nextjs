import { useRouter } from "next/router";
import Image from "next/image";
import whatshare from "@/assets/whatshare.png";
import { useEffect, useState } from "react";
import "./ShareInvitation.css";
import BASE_URL from "@/utils/apiconstants";
import FinalInviteDisplay from "@/components/FinalInviteDisplay"
import vector from "@/assets/sharepageVector.png"
import vector1 from "@/assets/sharepageVector1.png"
import vector2 from "@/assets/sharepageVector2.png"
export default function ShareInvitation() {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (router.query.data) {
            try {
                setOrderDetails(JSON.parse(router.query.data));
            } catch (err) {
                console.error("Error parsing order details", err);
            }
        }
    }, [router.query.data]);

    const handleWhatsAppShare = () => {
        if (!orderDetails) return;
        const inviteURL = `https://horaservices.com/${orderDetails.userId}/${orderDetails.id}/guest`;
        const shareText = `You're invited to ${orderDetails.Name || "someone"}'s ${orderDetails["Event Type"] || "Birthday"}! 🎉
📅 ${orderDetails.Date}
⏰ ${orderDetails.Time}
📍 ${orderDetails.Address || "Venue"}
👉 Tap to view the invite:\n${inviteURL}`;

        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappLink, "_blank");
    };

    if (!orderDetails) return <p>Loading...</p>;

    return (
        <div className="share-invitation-page">
            <h2>Your Celebration, Your Way!</h2>
            <p>Your Data is 100% Secure</p>
            <p className="small-text">Guests can RSVP easily and even upload their favorite moments — all in one place!</p>

            <div className="info-boxes">
                <div className="info-box">
                    <Image src={vector} alt="Private & Secure" />
                    <span>Private & Secure</span>
                </div>
                <div className="info-box">
                    <Image src={vector1} alt="Upload Photos" />
                    <span>Upload & Photos</span>
                </div>
                <div className="info-box">
                    <Image src={vector2} alt="RSVP Easily" />
                    <span>View RSVP Easily</span>
                </div>
            </div>

            <button className="btn-share" onClick={handleWhatsAppShare}>
                Share Invitation
                <span className="icon-bg">
                    <Image src={whatshare} alt="WhatsApp" className="icon-img" />
                </span>
            </button>
            <div className="card-container">
                <FinalInviteDisplay
                    orderDetails={orderDetails}
                />
            </div>
        </div>
    );
}
