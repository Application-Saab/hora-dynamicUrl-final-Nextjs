"use client";
import React, { useState, useEffect } from "react";

import "../../app/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeBanner from "../HomePageComponent/HomeBanner";
import InviteCard from "../HomePageComponent/invitecardbanner";
import PlanningCategories from "../HomePageComponent/Planningcategories";
import VenueFinder from "../HomePageComponent/Venuefinder";
import EventHub from "../HomePageComponent/EventHub";

const STORAGE_KEYS = {
  USER_ID: "userID",
};

export default function HomeContent({ isNotFound = false }) {
  const [loggedinUserId, setLoggedinUserId] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const syncLoginState = () => {
      const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (storedUserId) {
        setLoggedinUserId(storedUserId);
        setIsUserLoggedIn(true);
      } else {
        setLoggedinUserId(null);
        setIsUserLoggedIn(false);
      }
    };

    syncLoginState();
    window.addEventListener("loginStateChange", syncLoginState);
    window.addEventListener("storage", syncLoginState);

    return () => {
      window.removeEventListener("loginStateChange", syncLoginState);
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  return (
    <div className="home-wrapper">
      <HomeBanner />
      <InviteCard />

      {isUserLoggedIn && loggedinUserId && <EventHub userId={loggedinUserId} />}
      <div style={!isUserLoggedIn ? { marginTop: "10px" } : undefined}>
        <PlanningCategories isNotFound={isNotFound} />
      </div>
      <VenueFinder isNotFound={isNotFound} />
    </div>
  );
}
