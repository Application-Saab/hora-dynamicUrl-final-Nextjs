import { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "./useApi";
import {
  GET_GUEST_DETTAILS,
  CREATE_GUEST_BY_EVENTID,
} from "@/utils/apiconstants";

const useRsvpStatus = (eventId, skipCheck = false, refetch) => {
  const [guestDetails, setGuestDetails] = useState(null);

  const { makeRequest: fetchGuestData } = useApi();
  const { makeRequest: createGuestRequest } = useApi();

  // read once
  const userId = useMemo(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("userID")
      : null;
  }, []);

  const registerUserToEvent = useCallback(async () => {
    if (!eventId || !userId) return;

    try {
      const resp = await createGuestRequest(
        CREATE_GUEST_BY_EVENTID,
        "POST",
        { eventId, userId }
      );
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
          "GET"
        );

        if (!isMounted) return;

        if (resp?.data?._id) {
          setGuestDetails(resp.data);
        } else {
          registerUserToEvent();
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

  // derived state (NO extra effect / render)
  const rsvpSubmitted = Boolean(guestDetails?.rsvpStatus);

  return { rsvpSubmitted, guestDetails };
};

export default useRsvpStatus;
