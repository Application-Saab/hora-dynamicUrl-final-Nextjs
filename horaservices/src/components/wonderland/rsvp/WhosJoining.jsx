// import useApi from "@/hooks/useApi";
// import {
//   GET_GUESTS_BY_EVENTID,
//   UPDATE_RSVP_STATUS,
// } from "@/utils/apiconstants";
// import { useRouter } from "next/router";
// import React, { useEffect, useLayoutEffect, useState } from "react";
// import RsvpListModal from "./RsvpListModal";
// import useScreenSize from "@/hooks/useScreenSize";
// import CustomButton from "../common/CustomButton";
// import { RSVP_STATUS } from "@/utils/constants";

// const colors = [
//   "#FD8D0A",
//   "#E8275F",
//   "#A654B0",
//   "#31B8CC",
//   "#F2BB2F",
//   "#6BB266",
// ];

// const WhosJoining = ({
//   loggedinUserId,
//   isHost,
//   userData,
//   rsvpSubmitted,
//   onRsvpUpdate,
//   setPushRsvpClick,
//   pushRsvpClick,
// }) => {
//   const router = useRouter();
//   const { eventid: eventId } = router.query;
//   const { data, makeRequest } = useApi();
//   const { makeRequest: rsvpRequest, loading } = useApi();
//   const [allGuestsData, setAllGuestsData] = useState([]);
//   const [rsvpSubmittedGuests, setRsvpSubmittedGuests] = useState([]);
//   const [filledGuests, setFilledGuests] = useState([]);
//   const [showListModal, setShowListModal] = useState(false);
//   const { width } = useScreenSize();
//   const [refetchRsvpList, setRefetchRsvpList] = useState(0);
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [highlightRsvpClick, setHighlightRsvpClick] = useState(false);

//   useLayoutEffect(() => {
//     const fetchGuestsDetails = async () => {
//       if (eventId && loggedinUserId) {
//         try {
//           await makeRequest(`${GET_GUESTS_BY_EVENTID}/${eventId}`, "GET");
//         } catch (err) {
//           console.error("Error fetching guests detail:", err);
//         }
//       }
//     };
//     fetchGuestsDetails();
//   }, [eventId, loggedinUserId, refetchRsvpList]);

//   useEffect(() => {
//     let arrSize = width >= 360 ? 6 : 5;

//     const submittedGuests =
//       data?.data?.filter(
//         (guest) =>
//           guest?.rsvpStatus === RSVP_STATUS.WILL_COME ||
//           guest?.rsvpStatus === RSVP_STATUS.WILL_TRY
//       ) || [];

//     setRsvpSubmittedGuests(submittedGuests);

//     const guests = [...submittedGuests.slice(0, arrSize)];
//     while (guests.length < arrSize) guests.push(null);

//     setFilledGuests(guests);
//     setAllGuestsData(data?.data || []);
//   }, [data?.data, width]);

//   const submitRsvp = async (rsvpStatus) => {
//     setSelectedStatus(rsvpStatus);
//     if (!userData?.name && !rsvpStatus) return;
//     try {
//       const response = await rsvpRequest(`${UPDATE_RSVP_STATUS}`, "PUT", {
//         eventId,
//         userId: loggedinUserId,
//         rsvpStatus,
//         name: userData?.name,
//       });

//       if (response.data.error) {
//         alert("Something went wrong. Please try again.");
//       } else {
//         localStorage.setItem(
//           `rsvp_submitted_${eventId}_${loggedinUserId}`,
//           "true"
//         );
//         setRefetchRsvpList((prev) => prev + 1);
//         onRsvpUpdate?.();
//       }
//     } catch (err) {
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   // Detect pushRsvpClick trigger
//   useEffect(() => {
//     if (pushRsvpClick) {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       setHighlightRsvpClick(true);
//       setPushRsvpClick(false);
//     }
//   }, [pushRsvpClick]);

//   // Reset highlight
//   useEffect(() => {
//     if (highlightRsvpClick) {
//       const timer = setTimeout(() => {
//         setHighlightRsvpClick(false);
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [highlightRsvpClick]);

//   return (
//     <>
//       <div className="whos-joining-wrapper">
//         {!isHost && !rsvpSubmitted && (
//           <div
//             className={`guest-rsvp-box d-flex justify-content-center flex-column w-100 ${
//               highlightRsvpClick ? "highlight-rsvp" : ""
//             }`}
//           >
//             <p>Will You be there ?</p>
//             <div className="d-flex justify-content-center  gap-2">
//               <CustomButton
//                 title="I’m Coming!"
//                 buttonClass="guest-rsvp-btn w-100"
//                 onClick={() => submitRsvp(RSVP_STATUS?.WILL_COME)}
//                 loading={selectedStatus === RSVP_STATUS?.WILL_COME && loading}
//               />
//               <CustomButton
//                 title="Will Try!"
//                 buttonClass="guest-rsvp-btn w-100"
//                 onClick={() => submitRsvp(RSVP_STATUS?.WILL_TRY)}
//                 loading={selectedStatus === RSVP_STATUS?.WILL_TRY && loading}
//               />
//             </div>
//           </div>
//         )}
//         <div
//           className="whos-joining-status-box"
//           style={{
//             marginTop: rsvpSubmitted && !isHost ? "10px" : "",
//           }}
//         >
//           <div className="status-box-header">
//             <h3>Who's joining?</h3>
//             <span>{rsvpSubmittedGuests?.length || 0} guest confirmed</span>
//           </div>
//           <div className="status-box-list-ctn">
//             <div className="avatar-container">
//               {filledGuests?.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`avatar-item-ctn confetti-style-${index + 1}`}
//                   style={{ backgroundColor: colors[index % colors.length] }}
//                 >
//                   <span>{item?.name?.[0] || ""}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="list-btn-ctn">
//               <button
//                 className="list-view-btn"
//                 onClick={() => {
//                   isHost
//                     ? setShowListModal(true)
//                     : rsvpSubmitted
//                     ? setShowListModal(true)
//                     : setPushRsvpClick(true);
//                 }}
//               >
//                 Full guest list
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <RsvpListModal
//         isOpen={showListModal}
//         onClose={() => setShowListModal(false)}
//         guestData={allGuestsData}
//         totalSubmitted={rsvpSubmittedGuests?.length || 0}
//       />
//     </>
//   );
// };

// export default WhosJoining;





import useApi from "@/hooks/useApi";
import {
  GET_GUESTS_BY_EVENTID,
  UPDATE_RSVP_STATUS,
} from "@/utils/apiconstants";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import RsvpListModal from "./RsvpListModal";
import useScreenSize from "@/hooks/useScreenSize";
import CustomButton from "../common/CustomButton";
import { RSVP_STATUS } from "@/utils/constants";
import RsvpNameModal from "./RsvpNameModal";
import socket from "@/socket";

const colors = [
  "#FD8D0A",
  "#E8275F",
  "#A654B0",
  "#31B8CC",
  "#F2BB2F",
  "#6BB266",
];

const WhosJoining = ({
  loggedinUserId,
  isHost,
  userData,
  rsvpSubmitted,
  onRsvpUpdate,
  setPushRsvpClick,
  pushRsvpClick,
}) => {
  const router = useRouter();
  const { eventid: eventId } = router.query;
  const { data, makeRequest } = useApi();
  const { makeRequest: rsvpRequest, loading } = useApi();
  const [allGuestsData, setAllGuestsData] = useState([]);
  const [rsvpSubmittedGuests, setRsvpSubmittedGuests] = useState([]);
  const [filledGuests, setFilledGuests] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const { width } = useScreenSize();
  const [refetchRsvpList, setRefetchRsvpList] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showNameModal, setShowNameModal] = useState("");
  const [userName, setUserName] = useState("");
  const [highlightRsvpClick, setHighlightRsvpClick] = useState(false);

  useEffect(() => {
    socket.emit("joinEvent", eventId);

    return () => {
      socket.emit("leaveEvent", eventId);
    };
  }, [eventId]);

  useLayoutEffect(() => {
    const fetchGuestsDetails = async () => {
      if (eventId && loggedinUserId) {
        try {
          await makeRequest(`${GET_GUESTS_BY_EVENTID}/${eventId}`, "GET");
        } catch (err) {
          console.error("Error fetching guests detail:", err);
        }
      }
    };
    fetchGuestsDetails();
  }, [eventId, loggedinUserId, refetchRsvpList]);

  useEffect(() => {
    let arrSize = width >= 360 ? 6 : 5;

    const submittedGuests =
      data?.data?.filter(
        (guest) =>
          guest?.rsvpStatus === RSVP_STATUS.WILL_COME ||
          guest?.rsvpStatus === RSVP_STATUS.WILL_TRY
      ) || [];

    setRsvpSubmittedGuests(submittedGuests);

    const guests = [...submittedGuests.slice(0, arrSize)];
    while (guests.length < arrSize) guests.push(null);

    setFilledGuests(guests);
    setAllGuestsData(data?.data || []);
  }, [data?.data, width]);

  const submitRsvp = async (rsvpStatus) => {
    setShowNameModal(false);
    setSelectedStatus(rsvpStatus);
    const tempId = `temp_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    if (!rsvpStatus) return;
    try {
      const response = await rsvpRequest(`${UPDATE_RSVP_STATUS}`, "PUT", {
        eventId,
        userId: loggedinUserId,
        rsvpStatus,
        name: userData?.name || userName,
      });

      if (response.data.error) {
        alert("Something went wrong. Please try again.");
      } else {
        localStorage.setItem(
          `rsvp_submitted_${eventId}_${loggedinUserId}`,
          "true"
        );
        if (socket && socket.connected) {
          socket.emit("message:send", {
            eventId,
            // groupId,
            message: `${userData?.name || userName} joined the group`,
            type: "info",
            tempId,
            senderName: userData?.name || userName,
            senderPhone: userData?.phone,
          });
        }
        socket.emit("rsvp:updated", { eventId });
        setRefetchRsvpList((prev) => prev + 1);
        onRsvpUpdate?.();
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      if (data.eventId === eventId) {
        setRefetchRsvpList((prev) => prev + 1);
      }
    };

    socket.on("rsvp:refetch", handler);

    return () => {
      socket.off("rsvp:refetch", handler);
    };
  }, [eventId]);

  // Detect pushRsvpClick trigger
  useEffect(() => {
    if (pushRsvpClick) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setHighlightRsvpClick(true);
      setPushRsvpClick(false);
    }
  }, [pushRsvpClick]);

  // Reset highlight
  useEffect(() => {
    if (highlightRsvpClick) {
      const timer = setTimeout(() => {
        setHighlightRsvpClick(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightRsvpClick]);

  return (
    <>
      <div className="whos-joining-wrapper">
        {!isHost && !rsvpSubmitted && (
          <div
            className={`guest-rsvp-box d-flex justify-content-center flex-column w-100 ${
              highlightRsvpClick ? "highlight-rsvp" : ""
            }`}
          >
            <p>Will You be there ?</p>
            <div className="d-flex justify-content-center  gap-2">
              <CustomButton
                title="I’m Coming!"
                buttonClass="guest-rsvp-btn w-100"
                onClick={() => {
                  userData?.name
                    ? submitRsvp(RSVP_STATUS?.WILL_COME)
                    : setShowNameModal(true);
                  setSelectedStatus(RSVP_STATUS?.WILL_COME);
                }}
                loading={selectedStatus === RSVP_STATUS?.WILL_COME && loading}
              />
              <CustomButton
                title="Will Try!"
                buttonClass="guest-rsvp-btn w-100"
                onClick={() => {
                  userData?.name
                    ? submitRsvp(RSVP_STATUS?.WILL_TRY)
                    : setShowNameModal(true);
                  setSelectedStatus(RSVP_STATUS?.WILL_TRY);
                }}
                loading={selectedStatus === RSVP_STATUS?.WILL_TRY && loading}
              />
            </div>
          </div>
        )}
        <div
          className="whos-joining-status-box"
          style={{
            marginTop: rsvpSubmitted && !isHost ? "10px" : "",
          }}
        >
          <div className="status-box-header">
            <h3>Who's joining?</h3>
            <span>{rsvpSubmittedGuests?.length || 0} guest confirmed</span>
          </div>
          <div className="status-box-list-ctn">
            <div className="avatar-container">
              {filledGuests?.map((item, index) => (
                <div
                  key={index}
                  className={`avatar-item-ctn confetti-style-${index + 1}`}
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  <span>{item?.name?.[0] || ""}</span>
                </div>
              ))}
            </div>
            <div className="list-btn-ctn">
              <button
                className="list-view-btn"
                onClick={() => {
                  isHost
                    ? setShowListModal(true)
                    : rsvpSubmitted
                    ? setShowListModal(true)
                    : setPushRsvpClick(true);
                }}
              >
                Full guest list
              </button>
            </div>
          </div>
        </div>
      </div>
      <RsvpListModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        guestData={allGuestsData}
        totalSubmitted={rsvpSubmittedGuests?.length || 0}
      />
      <RsvpNameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        setUserName={setUserName}
        userName={userName}
        onDone={() => submitRsvp(selectedStatus)}
      />
    </>
  );
};

export default WhosJoining;
