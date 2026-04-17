// import { formateDateInDMDFormat } from "@/utils/dateFormatters";
// import React, { useState } from "react";
// import DirectionsImage from "@/assets/wonderland/addressLocationIcon.svg";
// import Image from "next/image";
// import AlertIcon from "@/assets/wonderland/AlertIcon.svg";
// import ErrorPopup from "../../common/ErrorPopup";


// const InviteAddressSection = ({ eventData }) => {
//   const [openLocationAlertModal, setOpenLocationAlertModal] = useState(false);

//   const handleLocationClick = () => {
//     const mapLink = eventData?.googleMapLink;

//     if (!mapLink) {
//       setOpenLocationAlertModal(true);
//       return;
//     }
//     window.open(mapLink, "_blank");
//   };
//   return (
//     <>
//       <div
//         className="d-flex justify-content-between align-items-start"
//         style={{ gap: "30px", marginTop: "9px" }}
//       >
//         <div className="address-part-ctn">
//           {(eventData?.eventDate || eventData?.eventTime) && (
//             <span className="date-time-text">
//               {eventData?.eventDate &&
//                 formateDateInDMDFormat(eventData?.eventDate)}
//               <span className="ms-2">
//                 {eventData?.eventTime && `@ ${eventData?.eventTime}`}
//               </span>
//             </span>
//           )}
//           {eventData?.location && (
//             <span className="address-text">{eventData?.location}</span>
//           )}
//         </div>
//         <div
//           className="d-flex align-items-center"
//           style={{ marginLeft: "-30px" }}
//         >
//           <div className="direction-ctn">
//             <img
//               src="/assets/wonderland/MapGraphImage.png"
//               alt="Location Map Graphic"
//               className="direction-bg-img"
//             />
//           </div>

//           <div
//             className="d-flex justify-content-center align-items-center flex-column direction-icon-ctn"
//             onClick={handleLocationClick}
//           >
//             <Image
//               src={DirectionsImage}
//               alt="directions"
//               className="address-direction-image"
//             />
//             <span>Directions</span>
//           </div>
//         </div>
//       </div>
// <ErrorPopup
//   isOpen={openLocationAlertModal}
//   onClose={() => setOpenLocationAlertModal(false)}
//   heading="Location Missing"
//   message= "Map location is not available"
//   buttonLabel="OK"
//   icon={AlertIcon}
// />

//     </>
//   );
// };

// export default InviteAddressSection;

import { formateDateInDMDFormat } from "@/utils/dateFormatters";
import React, { useState } from "react";
import DirectionsImage from "@/assets/wonderland/addressLocationIcon.svg";
import Image from "next/image";
import AlertIcon from "@/assets/wonderland/AlertIcon.svg";
import ErrorPopup from "../../common/ErrorPopup";

const InviteAddressSection = ({ eventData, hideDateAndTime = false }) => {
  const [openLocationAlertModal, setOpenLocationAlertModal] = useState(false);

  const handleLocationClick = () => {
    const mapLink = eventData?.googleMapLink;

    if (!mapLink) {
      setOpenLocationAlertModal(true);
      return;
    }
    window.open(mapLink, "_blank");
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-start"
        style={{ gap: "30px", marginTop: "9px" }}
      >
        <div className="address-part-ctn">
          {/* Date & Time — venue host ke liye hide hoga */}
          {!hideDateAndTime && (eventData?.eventDate || eventData?.eventTime) && (
            <span className="date-time-text">
              {eventData?.eventDate &&
                formateDateInDMDFormat(eventData?.eventDate)}
              <span className="ms-2">
                {eventData?.eventTime && `@ ${eventData?.eventTime}`}
              </span>
            </span>
          )}

          {/* Location — dono flows mein dikhega */}
          {eventData?.location && (
            <span className="address-text">{eventData?.location}</span>
          )}
        </div>

        <div
          className="d-flex align-items-center"
          style={{ marginLeft: "-30px" }}
        >
          <div className="direction-ctn">
            <img
              src="/assets/wonderland/MapGraphImage.png"
              alt="Location Map Graphic"
              className="direction-bg-img"
            />
          </div>

          <div
            className="d-flex justify-content-center align-items-center flex-column direction-icon-ctn"
            onClick={handleLocationClick}
          >
            <Image
              src={DirectionsImage}
              alt="directions"
              className="address-direction-image"
            />
            <span>Directions</span>
          </div>
        </div>
      </div>

      <ErrorPopup
        isOpen={openLocationAlertModal}
        onClose={() => setOpenLocationAlertModal(false)}
        heading="Location Missing"
        message="Map location is not available"
        buttonLabel="OK"
        icon={AlertIcon}
      />
    </>
  );
};

export default InviteAddressSection;
