// import React from "react";
// import Image from "next/image";
// import "./VenueHighlights.css";

// import ParkingIcon from "../../assets/venue/highlights/car_parking_icon.svg";
// import GuestIcon from "../../assets/venue/highlights/guest_icon.svg";
// import HallsIcon from "../../assets/venue/highlights/halls_building.svg";
// import RoomIcon from "../../assets/venue/highlights/room_bed_icon.svg";

// const buildHighlights = (data = {}) => {
//   const items = [];

//   // 1. Max Guests
//   if (data.guestCapacity !== undefined && data.guestCapacity !== null) {
//     items.push({
//       id: "max-guests",
//       value: `${data.guestCapacity} Maximum Guest`,
//       // label: "Maximum Guest",
//       icon: GuestIcon,
//       tint: "#F2EAFA",
//     });
//   }

//   // 2. Parking
//   items.push({
//     id: "parking",
//     value: `${data.isParkingAvailable && "Parking"} Area`,
//     // label: "Area",
//     icon: ParkingIcon,
//     tint: "#FDF1F7",
//   });

//   // 3. Outdoor Halls
//   items.push({
//     id: "outdoor-halls",
//     value: "2 Maximum Halls",
//     // label: "Outdoor",
//     icon: HallsIcon,
//     tint: "#FDF1F7",
//   });

//   // 4. Indoor Halls
//   items.push({
//     id: "indoor-halls",
//     value: "1 Maximum Hall",
//     label: "Indoor",
//     icon: HallsIcon,
//     tint: "#FDF1F7",
//   });

//   // 5. Rooms
//   items.push({
//     id: "rooms",
//     value: `${data.totalRoomsAvailable || "20"} Rooms`,
//     // label: "Ac Room",
//     icon: RoomIcon,
//     tint: "#FDF1F7",
//   });

//   // 6. Min Guests / Additional repeat item for scroll demonstration
//   if (data.minGuestCapacity !== undefined && data.minGuestCapacity !== null) {
//     items.push({
//       id: "min-guests",
//       value: `${data.minGuestCapacity || "100"} Minimum Guest`,
//       // label: "Minimum Guest",
//       icon: GuestIcon,
//       tint: "#F2EAFA",
//     });
//   }

//   return items;
// };

// const VenueHighlights = ({ venueDetails }) => {
//   const items = buildHighlights(venueDetails);

//   if (!items.length) return null;

//   return (
//     <div className="vh-container">
//       {/* Header */}
//       <div className="vh-header">
//         <h3 className="vh-title">Venue Highlights</h3>
//         <p className="vh-subtitle">
//           Everything you need to know about this venue
//         </p>
//       </div>

//       {/* Grid container with horizontal scroll (2 rows) */}
//       <div className="vh-grid-scroll">
//         <div className="vh-grid">
//           {items.map((item) => (
//             <div key={item.id} className="vh-card">
//               <div className={`vh-icon-box`} style={{ backgroundColor: `${item.tint}` }}>
//                 <Image
//                   src={item.icon}
//                   alt={item.label}
//                   width={24}
//                   height={24}
//                   className="vh-icon-img"
//                 />
//               </div>
//               <div className="vh-info">
//                 <span className="vh-val">{item.value}</span>
//                 {/* <span className="vh-lbl">{item.label}</span> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Decorative slider pill indicator */}
//       {items.length > 6 && (
//         <div className="vh-indicator-track">
//           <div className="vh-indicator-thumb" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VenueHighlights;





import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import "./VenueHighlights.css";

import ParkingIcon from "../../assets/venue/highlights/car_parking_icon.svg";
import GuestIcon from "../../assets/venue/highlights/guest_icon.svg";
import HallsIcon from "../../assets/venue/highlights/halls_building.svg";
import RoomIcon from "../../assets/venue/highlights/room_bed_icon.svg";
import { fetchVenueSuggestion } from "@/services/venueServices";

/* Soft background tints – cycle through these */
const TINT_COLORS = [
  "#F2EAFA", // soft purple
  "#FDF1F7", // soft pink
  "#EAF6FF", // soft blue
  "#EAFBF0", // soft green
  "#FFF6E8", // soft orange
  "#F3F0FF", // lavender
  "#FFF0F0", // soft red
  "#F0F7FF", // sky
  "#F5FFF5", // mint
  "#FFF8F0", // peach
];

const buildBaseHighlights = (data = {}) => {
  const items = [];

  // 1. Max Guests
  if (data.guestCapacity !== undefined && data.guestCapacity !== null) {
    items.push({
      id: "max-guests",
      value: `${data.guestCapacity} Maximum Guest`,
      icon: GuestIcon,
      isSvgFile: true,
    });
  }

  // 2. Parking
  if (data.isParkingAvailable) {
    items.push({
      id: "parking",
      value: "Parking Area",
      icon: ParkingIcon,
      isSvgFile: true,
    });
  }

  // 3. Outdoor / Indoor Halls (from hallType array)
  const halls = Array.isArray(data.hallType) ? data.hallType : [];
  const outdoorCount = halls.filter((h) =>
    String(h).toLowerCase().includes("out")
  ).length;
  const indoorCount = halls.filter((h) =>
    String(h).toLowerCase().includes("in")
  ).length;

  if (outdoorCount > 0 || halls.length > 0) {
    items.push({
      id: "outdoor-halls",
      value: `${outdoorCount || halls.length} Maximum Halls Outdoor`,
      icon: HallsIcon,
      isSvgFile: true,
    });
  }

  if (indoorCount > 0) {
    items.push({
      id: "indoor-halls",
      value: `${indoorCount} Maximum Hall Indoor`,
      icon: HallsIcon,
      isSvgFile: true,
    });
  }

  // 4. Rooms
  if (data.totalRoomsAvailable > 0) {
    items.push({
      id: "rooms",
      value: `${data.totalRoomsAvailable} Ac Room`,
      icon: RoomIcon,
      isSvgFile: true,
    });
  }

  // 5. Min Guests
  if (data.minGuestCapacity !== undefined && data.minGuestCapacity !== null) {
    items.push({
      id: "min-guests",
      value: `${data.minGuestCapacity} Minimum Guest`,
      icon: GuestIcon,
      isSvgFile: true,
    });
  }

  return items;
};

const VenueHighlights = ({ venueDetails }) => {
  const [featureSuggestions, setFeatureSuggestions] = useState([]);
  console.log('%c [ featureSuggestions ]', 'font-size:13px; background:pink; color:#bf2c9f;', featureSuggestions)
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollRef = useRef(null);

  // Fetch special feature icons
  useEffect(() => {
    fetchVenueSuggestion("SPECIAL_FEATURES")
      .then((data) => setFeatureSuggestions(data || []))
      .catch(() => setFeatureSuggestions([]));
  }, []);

  // Build final list = base highlights + special features
  const items = useMemo(() => {
    const base = buildBaseHighlights(venueDetails || {});

    const features = Array.isArray(venueDetails?.venueFeatures)
      ? venueDetails.venueFeatures
      : [];

    const featureItems = features
      .filter(Boolean)
      .map((name, index) => {
        const matched = featureSuggestions.find(
          (s) => s?.title?.toLowerCase() === String(name).toLowerCase()
        );

        return {
          id: `feature-${index}-${name}`,
          value: name,
          iconSvg: matched?.iconSvg || null,
          isSvgFile: false,
        };
      });

    // Assign tint colors in cycle
    const all = [...base, ...featureItems].map((item, idx) => ({
      ...item,
      tint: TINT_COLORS[idx % TINT_COLORS.length],
    }));

    return all;
  }, [venueDetails, featureSuggestions]);

  // Detect if content is scrollable + update progress
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

    // Re-check after images/icons load
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

      {/* Horizontal scroll grid (2 rows) */}
      <div className="vh-grid-scroll" ref={scrollRef}>
        <div className="vh-grid">
          {items.map((item) => (
            <div key={item.id} className="vh-card">
              <div
                className="vh-icon-box"
                style={{ backgroundColor: item.tint }}
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

      {/* Scroll indicator – only when content actually scrolls */}
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