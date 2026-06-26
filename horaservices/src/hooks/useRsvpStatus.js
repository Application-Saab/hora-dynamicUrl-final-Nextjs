// import useApi from "./useApi";

// const {
//   GET_GUEST_DETTAILS,
//   CREATE_GUEST_BY_EVENTID,
// } = require("@/utils/apiconstants");
// const { useLayoutEffect, useState } = require("react");

// const useRsvpStatus = (eventId, skipCheck, refetch) => {
//   const [rsvpSubmitted, setRsvpSubmitted] = useState(true);
//   const userId = localStorage.getItem("userID");
//   const [guestDetails, setGuestDetails] = useState({});
//   console.log('%c [ guestDetails ]-13', 'font-size:13px; background:pink; color:#bf2c9f;', guestDetails)
//   const { makeRequest: fetchGuestData } = useApi();
//   const { makeRequest: createGuestRequest } = useApi();

//   const registerUserToEvent = async () => {
//     if (eventId && userId) {
//       try {
//         let resp = await createGuestRequest(
//           `${CREATE_GUEST_BY_EVENTID}`,
//           "POST",
//           {
//             eventId,
//             userId,
//           }
//         );
//         setGuestDetails(resp?.data);
//       } catch (err) {
//         console.error("Error creating guest for event:", err);
//       }
//     }
//   };

//   useLayoutEffect(() => {
//     const fetchGuestDetails = async () => {
//       if (eventId && userId && !skipCheck) {
//         try {
//           let resp = await fetchGuestData(
//             `${GET_GUEST_DETTAILS}/${eventId}/user/${userId}`,
//             "GET"
//           );
//           if (resp?.data?._id) {
//             setGuestDetails(resp?.data);
//           } else {
//             registerUserToEvent();
//           }
//         } catch (err) {
//           console.error("Error fetching guest details:", err);
//         }
//       }
//     };
//     fetchGuestDetails();
//   }, [eventId, userId, skipCheck, refetch]);

//   useLayoutEffect(() => {
//     if (guestDetails) {
//       if (guestDetails?.rsvpStatus) {
//         setRsvpSubmitted(true);
//       } else {
//         setRsvpSubmitted(false);
//       }
//     }
//   }, [guestDetails]);

//   return { rsvpSubmitted };
// };

// export default useRsvpStatus;

import { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "./useApi";
import { useRouter } from "next/router";
import {
  GET_GUEST_DETTAILS,
  CREATE_GUEST_BY_EVENTID,
} from "@/utils/apiconstants";

const useRsvpStatus = (eventId, skipCheck = false, refetch) => {
  const router = useRouter();
  const { frompanel } = router.query;
  console.log(
    "%c [ frompanel inside rsvp ]",
    "font-size:13px; background:pink; color:#bf2c9f;",
    frompanel,
  );
  const [guestDetails, setGuestDetails] = useState(null);

  const { makeRequest: fetchGuestData } = useApi();
  const { makeRequest: createGuestRequest } = useApi();

  // ✅ read once
  const userId = useMemo(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("userID")
      : null;
  }, []);

  const registerUserToEvent = useCallback(async () => {
    if (!eventId || !userId) return;

    try {
      const resp = await createGuestRequest(CREATE_GUEST_BY_EVENTID, "POST", {
        eventId,
        userId,
      });
      setGuestDetails(resp?.data || null);
    } catch (err) {
      console.error("Error creating guest:", err);
    }
  }, [eventId, userId, createGuestRequest]);

  useEffect(() => {
    if (!eventId || !userId || skipCheck) return;

    let isMounted = true;

    const fetchGuestDetails = async () => {
      try {
        const resp = await fetchGuestData(
          `${GET_GUEST_DETTAILS}/${eventId}/user/${userId}`,
          "GET",
        );

        if (!isMounted) return;

        if (resp?.data?._id) {
          setGuestDetails(resp.data);
        } else {
          if(frompanel != 'true'){
            registerUserToEvent();
          }
        }
      } catch (err) {
        console.error("Error fetching guest details:", err);
      }
    };

    fetchGuestDetails();

    return () => {
      isMounted = false;
    };
  }, [
    eventId,
    userId,
    skipCheck,
    refetch,
    fetchGuestData,
    registerUserToEvent,
  ]);

  // ✅ derived state (NO extra effect / render)
  const rsvpSubmitted = Boolean(guestDetails?.rsvpStatus);

  return { rsvpSubmitted, guestDetails };
};

export default useRsvpStatus;
