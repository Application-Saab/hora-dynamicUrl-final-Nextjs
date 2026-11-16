import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import "./VenueHighlights.css";

import ParkingIcon from "../../assets/venue/highlights/car_parking_icon.svg";
import GuestIcon from "../../assets/venue/highlights/guest_icon.svg";
import HallsIcon from "../../assets/venue/highlights/halls_building.svg";
import RoomIcon from "../../assets/venue/highlights/room_bed_icon.svg";
import { fetchVenueSuggestion } from "@/services/venueServices";

const TINT_COLORS = [
  "#F2EAFA",
  "#FDF1F7",
  "#EAF6FF",
  "#EAFBF0",
  "#FFF6E8",
  "#F3F0FF",
  "#FFF0F0",
  "#F0F7FF",
  "#F5FFF5",
  "#FFF8F0",
];

const buildBaseHighlights = (data = {}) => {
  const items = [];

  // Max Guests
  if (data.guestCapacity !== undefined && data.guestCapacity !== null) {
    items.push({
      id: "max-guests",
      value: `${data.guestCapacity} Maximum Guest`,
      icon: GuestIcon,
      isSvgFile: true,
      bgColor: "#F2EAFA",
    });
  }

  // Parking
  if (data.isParkingAvailable) {
    items.push({
      id: "parking",
      value: "Parking Area",
      icon: ParkingIcon,
      isSvgFile: true,
      bgColor: "#FDF1F7",
    });
  }

  // Outdoor / Indoor Halls
  const halls = Array.isArray(data.hallType) ? data.hallType : [];
  const outdoorCount = halls.filter((h) =>
    String(h).toLowerCase().includes("out"),
  ).length;
  const indoorCount = halls.filter((h) =>
    String(h).toLowerCase().includes("in"),
  ).length;

  if (outdoorCount > 0 || halls.length > 0) {
    items.push({
      id: "outdoor-halls",
      value: `${outdoorCount || halls.length} Maximum Halls Outdoor`,
      icon: HallsIcon,
      isSvgFile: true,
      bgColor: "#FDF1F7",
    });
  }

  if (indoorCount > 0) {
    items.push({
      id: "indoor-halls",
      value: `${indoorCount} Maximum Hall Indoor`,
      icon: HallsIcon,
      isSvgFile: true,
      bgColor: "#FDF1F7",
    });
  }

  // Rooms
  if (data.totalRoomsAvailable > 0) {
    items.push({
      id: "rooms",
      value: `${data.totalRoomsAvailable} Ac Room`,
      icon: RoomIcon,
      isSvgFile: true,
      bgColor: "#FDF1F7",
    });
  }

  // Min Guests
  if (data.minGuestCapacity !== undefined && data.minGuestCapacity !== null) {
    items.push({
      id: "min-guests",
      value: `${data.minGuestCapacity} Minimum Guest`,
      icon: GuestIcon,
      isSvgFile: true,
      bgColor: "#F2EAFA",
    });
  }

  return items;
};

const VenueHighlights = ({ venueDetails }) => {
  const [featureSuggestions, setFeatureSuggestions] = useState([]);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollRef = useRef(null);

  useEffect(() => {
    fetchVenueSuggestion("SPECIAL_FEATURES")
      .then((data) => setFeatureSuggestions(data || []))
      .catch(() => setFeatureSuggestions([]));
  }, []);

  const items = useMemo(() => {
    const base = buildBaseHighlights(venueDetails || {});

    const features = Array.isArray(venueDetails?.venueFeatures)
      ? venueDetails.venueFeatures
      : [];

    const featureItems = features.filter(Boolean).map((name, index) => {
      const matched = featureSuggestions.find(
        (s) => s?.title?.toLowerCase() === String(name).toLowerCase(),
      );

      return {
        id: `feature-${index}-${name}`,
        value: name,
        iconSvg: matched?.iconSvg || null,
        isSvgFile: false,
      };
    });

    const all = [...base, ...featureItems].map((item, idx) => ({
      ...item,
      tint: TINT_COLORS[idx % TINT_COLORS.length],
    }));

    return all;
  }, [venueDetails, featureSuggestions]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const canScroll = el.scrollWidth > el.clientWidth + 4;
      setShowScrollbar(canScroll);

      if (canScroll) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
        setScrollProgress(progress);
      }
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    const timer = setTimeout(checkScroll, 300);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="vh-container">
      {/* Header */}
      <div className="vh-header">
        <h3 className="vh-title">Venue Highlights</h3>
        <p className="vh-subtitle">
          Everything you need to know about this venue
        </p>
      </div>

      <div className="vh-grid-scroll" ref={scrollRef}>
        <div className="vh-grid">
          {items.map((item) => (
            <div key={item.id} className="vh-card">
              <div
                className="vh-icon-box"
                style={{ backgroundColor: item?.bgColor || item.tint }}
              >
                {item.isSvgFile && item.icon ? (
                  <Image
                    src={item.icon}
                    alt={item.value}
                    width={22}
                    height={22}
                    className="vh-icon-img"
                  />
                ) : item.iconSvg ? (
                  <div
                    className="vh-icon-svg"
                    dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                  />
                ) : (
                  <div className="vh-icon-fallback" />
                )}
              </div>

              <div className="vh-info">
                <span className="vh-val">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showScrollbar && (
        <div className="vh-indicator-track">
          <div
            className="vh-indicator-thumb"
            style={{
              transform: `translateX(${scrollProgress * 30}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VenueHighlights;
