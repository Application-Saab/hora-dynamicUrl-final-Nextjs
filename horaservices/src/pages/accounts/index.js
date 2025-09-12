import { BASE_URL, GET_USER_DETAIL_ENDPOINT } from "@/utils/apiconstants";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./AccountsPage.css";
import ArrowIcon from "@/assets/forward_arrow.svg";
import CallIcon from "@/assets/call_icon.svg";
import LogoutIcon from "@/assets/logout_icon.svg";
import Avatar from '@/assets/avtar.jpg';
const AccountPage = () => {
  const [userData, setUserData] = useState({});
  const LocalMobile = localStorage.getItem("mobileNumber");
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/wonderland'
  }

  //   useEffect(() => {
  //     const fetchEventImages = async () => {
  //       if (!urlParams.eventId) {
  //         setErrorEventImages("Event ID not found in URL");
  //         setLoadingEventImages(false);
  //         return;
  //       }

  //       try {
  //         const response = await fetch(
  //           `${BASE_URL}${GET_USER_DETAIL_ENDPOINT}/${urlParams?.eventId}`,
  //           {
  //             headers: {
  //               Authorization: `${token}`, // Add token in Authorization header
  //               "Content-Type": "application/json",
  //             },
  //           }
  //         );
  //         const data = await response.json();
  //         if (data.error) {
  //           setEventAllImages([]);
  //           setErrorEventImages(data.message || "Failed to fetch guests");
  //         } else {
  //           setEventAllImages(data.data || []);
  //         }
  //       } catch (err) {
  //         setErrorEventImages("Error fetching guests: " + err.message);
  //       } finally {
  //         setLoadingEventImages(false);
  //       }
  //     };
  //     // Initial call
  //     fetchEventImages();

  //     // Call every 3 minute
  //     const interval = setInterval(fetchEventImages, 180000);

  //     // Cleanup interval on unmount
  //     return () => clearInterval(interval);
  //   }, [
  //     urlParams.eventUserId,
  //     urlParams.eventId,
  //     urlParams.userType,
  //     refetchEventImages,
  //     refetchLuckyDraw,
  //     refetchLuckyDrawHostDelete,
  //     refetchLuckyDrawGuestDelete,
  //   ]);

  return (
    <div className="account-ctn">
      <div className="details-ctn">
        <div>
            <Image src={Avatar} height={100} width={100} className="user-img" />
        </div>
        <div>
          <p className="account-name">Shubham</p>
        </div>
        <div className="contact-ctn">
          <div className="contact-item">
           <Image src={CallIcon} height={18} width={18} />
            <p>91+{LocalMobile}</p>
          </div>
          <div>
          <Image src={ArrowIcon} />
          </div>
        </div>
        <div className="contact-ctn" style={{cursor: 'pointer'}} onClick={handleLogout}>
          <div className="contact-item">
            <Image src={LogoutIcon} height={18} width={18} />
            <p>Logout</p>
          </div>
          <div>
            <Image src={ArrowIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
