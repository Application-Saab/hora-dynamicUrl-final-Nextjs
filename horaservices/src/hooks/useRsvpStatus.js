import useApi from "./useApi";

const {
  GET_GUEST_DETTAILS,
  CREATE_GUEST_BY_EVENTID,
} = require("@/utils/apiconstants");
const { useLayoutEffect, useState, useEffect } = require("react");

const useRsvpStatus = (eventId, skipCheck, refetch) => {
  const [rsvpSubmitted, setRsvpSubmitted] = useState(true);
  const userId = localStorage.getItem("userID");
  const [guestDetails, setGuestDetails] = useState({});
  const { makeRequest: fetchGuestData } = useApi();
  const { makeRequest: createGuestRequest } = useApi();

  const registerUserToEvent = async () => {
    if (eventId && userId) {
      try {
        let resp = await createGuestRequest(
          `${CREATE_GUEST_BY_EVENTID}`,
          "POST",
          {
            eventId,
            userId,
          }
        );
        setGuestDetails(resp?.data);
      } catch (err) {
        console.error("Error creating guest for event:", err);
      }
    }
  };

  useLayoutEffect(() => {
    const fetchGuestDetails = async () => {
      if (eventId && userId && !skipCheck) {
        try {
          let resp = await fetchGuestData(
            `${GET_GUEST_DETTAILS}/${eventId}/user/${userId}`,
            "GET"
          );
          if (resp?.data?._id) {
            setGuestDetails(resp?.data);
          } else {
            registerUserToEvent();
          }
        } catch (err) {
          console.error("Error fetching guest details:", err);
        }
      }
    };
    fetchGuestDetails();
  }, [eventId, userId, skipCheck, refetch]);

  useLayoutEffect(() => {
    if (guestDetails) {
      if (guestDetails?.rsvpStatus) {
        setRsvpSubmitted(true);
      } else {
        setRsvpSubmitted(false);
      }
    }
  }, [guestDetails]);

  return { rsvpSubmitted };
};

export default useRsvpStatus;
