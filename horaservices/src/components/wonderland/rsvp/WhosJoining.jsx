import useApi from "@/hooks/useApi";
import { GET_GUESTS_BY_EVENTID } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import RsvpListModal from "./RsvpListModal";
import useScreenSize from "@/hooks/useScreenSize";

const colors = ["#FD8D0A", "#E8275F", "#A654B0", "#31B8CC", "#F2BB2F"]; //#6BB266

const WhosJoining = () => {
  const router = useRouter();
  const { eventid: eventId } = router.query;
  const { data, makeRequest } = useApi();
  const [allGuestsData, setAllGuestsData] = useState([]);
  const [filledGuests, setFilledGuests] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const { width } = useScreenSize();

  useLayoutEffect(() => {
    const fetchGuestsDetails = async () => {
      if (eventId) {
        try {
          await makeRequest(`${GET_GUESTS_BY_EVENTID}/${eventId}`, "GET");
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
    };
    fetchGuestsDetails();
  }, [eventId]);

  useEffect(() => {
    let arrSize = 5;
    if (width >= 360) {
      arrSize = 6;
    }
    if (Array.isArray(data?.data)) {
      const guests = [...data.data.slice(0, arrSize)];
      while (guests.length < arrSize) guests.push(null);
      setFilledGuests(guests);
      setAllGuestsData(data.data || []);
    } else {
      setFilledGuests(new Array(arrSize).fill(null));
    }
  }, [data?.data, width]);

  return (
    <>
      <div className="whos-joining-wrapper">
        <div className="whos-joining-status-box">
          <div className="status-box-header">
            <h3>Who's joining?</h3>
            <span>{allGuestsData?.length || 0} guest confirmed</span>
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
                onClick={() => setShowListModal(true)}
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
      />
    </>
  );
};

export default WhosJoining;
