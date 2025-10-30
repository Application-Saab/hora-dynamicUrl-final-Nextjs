import useApi from "@/hooks/useApi";
import { GET_GUESTS_BY_EVENTID } from "@/utils/apiconstants";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";

const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7", "#00B894"];
const WhosJoining = () => {
  const router = useRouter();
  const { eventid: eventId } = router.query;
  const { data, makeRequest } = useApi();
  const [allGuestsData, setAllGuestsData] = useState([]);
  const [filledGuests, setFilledGuests] = useState([]);

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
    if (Array.isArray(data?.data)) {
      const guests = [...data.data.slice(0, 5)];
      while (guests.length < 5) guests.push(null);
      setFilledGuests(guests);
      setAllGuestsData(data.data || []);
    } else {
      setFilledGuests(new Array(5).fill(null));
    }
  }, [data?.data]);

  return (
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
                className="avatar-item-ctn"
                style={{ backgroundColor: colors[index] }}
              >
                <div className="avatar-item">
                  <span>{item?.name[0]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="list-btn-ctn">
            <button className="list-view-btn">Full guest list</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhosJoining;
