// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import "./Venuesearchbar.css";

// /* ---- Image icons (reused from VenueCategories + venue list icon set) ---- */
// import searchIcon from "@/assets/searchbar.svg";
// import guestIcon from "@/assets/venuelanding/guest.svg";
// import filterIcon from "@/assets/venuelanding/Filter.svg";
// import defaultEventIcon from "@/assets/venuelanding/Eventtypeicon.svg";
// import birthdayIcon from "@/assets/venuelanding/cake.png";
// import babyshowerIcon from "@/assets/venuelanding/baby-shower.png";
// import engagementIcon from "@/assets/venuelanding/wedding-ring.png";
// import corporateIcon from "@/assets/venuelanding/happy.png";
// import receptionIcon from "@/assets/venuelanding/hall.png";
// import anniversaryIcon from "@/assets/venuelanding/glass.png";

// /* ---- Chevron stays inline SVG (pure directional arrow, rotates via CSS) ---- */
// const ChevronIcon = ({ open }) => (
//   <svg
//     className={`vsb-chevron ${open ? "open" : ""}`}
//     width="11"
//     height="11"
//     viewBox="0 0 12 12"
//     fill="none"
//   >
//     <path
//       d="M2 4L6 8L10 4"
//       stroke="#7C3FB1"
//       strokeWidth="1.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// // Same list + same icons as VenueCategories, so event type stays visually
// // consistent everywhere on the venue landing page.
// const DEFAULT_EVENTS = [
//   { label: "Birthday", icon: birthdayIcon },
//   { label: "Baby Shower", icon: babyshowerIcon },
//   { label: "Engagement", icon: engagementIcon },
//   { label: "Reception", icon: receptionIcon },
//   { label: "Corporate", icon: corporateIcon },
//   { label: "Anniversary", icon: anniversaryIcon },
// ];

// const DEFAULT_CAPACITIES = [
//   { value: "", label: "Any Guests" },
//   { value: "20", label: "20 Guests" },
//   { value: "30", label: "30 Guests" },
//   { value: "40", label: "40 Guests" },
//   { value: "50", label: "50 Guests" },
//   { value: "60", label: "60 Guests" },
//   { value: "70", label: "70 Guests" },
//   { value: "100", label: "100 Guests" },
//   { value: "120", label: "120 Guests" },
//   { value: "200", label: "200 Guests" },
//   { value: "300", label: "300 Guests" },
//   { value: "500", label: "500 Guests" },
// ];
// const ClearIcon = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//     <path
//       d="M6 6l12 12M18 6L6 18"
//       stroke="#97538C"
//       strokeWidth="2.2"
//       strokeLinecap="round"
//     />
//   </svg>
// );

// const VenueSearchBar = ({
//   searchValue,
//   onSearchChange,
//   eventType,
//   onEventTypeChange,
//   guestCapacity,
//   onGuestCapacityChange,
//   onMoreFilterClick,
//   events = DEFAULT_EVENTS,
//   capacities = DEFAULT_CAPACITIES,
// }) => {
//   const [openMenu, setOpenMenu] = useState(null); // "event" | "guest" | null
//   const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
//   const wrapRef = useRef(null);
//   const eventBtnRef = useRef(null);
//   const guestBtnRef = useRef(null);

//   const selectedGuest =
//     capacities.find((c) => c.value === guestCapacity) || capacities[0];

//   // Look up the icon for whichever event is currently selected, so the
//   // filter button itself shows that event's icon (not just a generic one).
//   const selectedEvent = events.find((e) => e.label === eventType);

//   const openDropdown = (key, btnRef) => {
//     if (openMenu === key) {
//       setOpenMenu(null);
//       return;
//     }
//     const btnRect = btnRef.current.getBoundingClientRect();
//     const wrapRect = wrapRef.current.getBoundingClientRect();
//     setDropdownPos({
//       top: btnRect.bottom - wrapRect.top + 6,
//       left: btnRect.left - wrapRect.left,
//     });
//     setOpenMenu(key);
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target))
//         setOpenMenu(null);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="vsb-wrap" ref={wrapRef}>
//       {/* ── Search input ── */}
//       <div className="vsb-search-row">
//         <span className="vsb-search-icon">
//           <Image src={searchIcon} alt="Search" width={18} height={18} />
//         </span>
//         <input
//           className="vsb-search-input"
//           type="text"
//           placeholder="Search Venus, areas"
//           value={searchValue}
//           onChange={(e) => onSearchChange?.(e.target.value)}
//         />
//       </div>
//       <div className="vsb-locality-row">
//         <span className="vsb-search-icon">
//           <Image src={searchIcon} alt="Search" width={18} height={18} />
//         </span>
//         <p>Locality</p>
//         {/* <input
//           className="vsb-search-input"
//           type="text"
//           placeholder="Locality"
//           value={searchValue}
//           onChange={(e) => onSearchChange?.(e.target.value)}
//         /> */}
//       </div>

//       {/* ── Dropdown lives OUTSIDE the scrollable row ── */}
//       {/* {openMenu === "event" && (
//         <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
//           {events.map(({ label, icon }) => (
//             <div
//               key={label}
//               className={`vsb-option ${eventType === label ? "active" : ""}`}
//               onClick={() => {
//                 onEventTypeChange?.(label);
//                 setOpenMenu(null);
//               }}
//             >
//               <Image src={icon} alt={label} width={16} height={16} className="vsb-option-icon" />
//               <span>{label}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {openMenu === "guest" && (
//         <div className="vsb-dropdown" style={{ top: dropdownPos.top, left: dropdownPos.left }}>
//           {capacities
//             .filter((c) => c.value !== "")
//             .map((c) => (
//               <div
//                 key={c.value}
//                 className={`vsb-option ${guestCapacity === c.value ? "active" : ""}`}
//                 onClick={() => {
//                   onGuestCapacityChange?.(c.value);
//                   setOpenMenu(null);
//                 }}
//               >
//                 {c.label}
//               </div>
//             ))}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default VenueSearchBar;
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import "./Venuesearchbar.css";
import MapLocalityIconPopup from "../../../assets/venue/locality_filter_popup_map.svg";
import SearchLocalityIconPopup from "../../../assets/venue/locality_filter_popup_search.svg";
import ArrowLocalityIconPopup from "../../../assets/venue/locality_filter_popup_arrow.svg";
import SearchbarSearchIcon from '../../../assets/venue/search_bar_search_icon.svg';

import all from "@/assets/venuelanding/All.webp";
import banquet from "@/assets/venuelanding/Banquethall.webp";
import farmhouse from "@/assets/venuelanding/farmhaouse.webp";
import fort from "@/assets/venuelanding/Fort.webp";
import gamezone from "@/assets/venuelanding/Gamezone.webp";
import hotels from "@/assets/venuelanding/Hotels.webp";
import lawns from "@/assets/venuelanding/Laws.webp";
import poolside from "@/assets/venuelanding/Poolside.webp";
import pubbar from "@/assets/venuelanding/Pubandbar.webp";
import resorts from "@/assets/venuelanding/Resorts.webp";
import restaurants from "@/assets/venuelanding/REstorants.webp";
import rooftop from "@/assets/venuelanding/roof_top_.webp";
import villas from "@/assets/venuelanding/Villas.webp";
import { useCity } from "@/utils/cityContext";
import { getVenueLocalitiesList } from "@/services/venueServices";
import {
  BASE_URL,
  VENUE_PUBLIC_LISTING,
} from "@/utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

export const venueData = [
  { id: "all", label: "All", slug: "all", img: all },
  { id: "Banquet hall", label: "Banquet Hall", slug: "banquethall", img: banquet },
  { id: "Pub & Bar", label: "Pub & Bar", slug: "pub-and-bar", img: pubbar },
  { id: "Poolside", label: "Poolside", slug: "poolside", img: poolside },
  { id: "Rooftop", label: "Rooftop", slug: "rooftop", img: rooftop },
  { id: "Resort", label: "Resorts", slug: "resorts", img: resorts },
  { id: "Villa", label: "Villas", slug: "villas", img: villas },
  { id: "Game Zone", label: "Game Zone", slug: "gamezone", img: gamezone },
  { id: "Restaurant", label: "Restaurants", slug: "restaurants", img: restaurants },
  { id: "Farmhouse", label: "Farmhouse", slug: "farmhouse", img: farmhouse },
  { id: "Lawn", label: "Lawns", slug: "lawns", img: lawns },
  { id: "Hotels", label: "Hotels", slug: "hotels", img: hotels },
  { id: "Fort/Place", label: "Forts & Palaces", slug: "fortspalaces", img: fort },
];

const SearchBadgeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="#ffffff" strokeWidth="2.5" />
    <path d="M16.5 16.5L21 21" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const LocationPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke="#ffffff"
      strokeWidth="2"
      fill="#924286"
    />
    <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
  </svg>
);

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="#b0a2af" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VenueSearchBar = ({
  searchValue = "",
  onSearchChange,
  onSelectVenueType,
  selectedLocality = "",
  onSelectLocality,
  city = "",
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocalityModal, setShowLocalityModal] = useState(false);
  const [localitySearch, setLocalitySearch] = useState("");
  const searchWrapRef = useRef(null);
  const { selectedCityName, setShowCityModal, showCityModal } = useCity();
  const [reopenLocalityAfterCity, setReopenLocalityAfterCity] = useState(false);
  const [localitiesData, setLocalitiesData] = useState([]);

  // Hybrid search state
  const [venueResults, setVenueResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    const getLocality = async () => {
      const data = await getVenueLocalitiesList(selectedCityName);
      setLocalitiesData(data || []);
    };
    if (selectedCityName) getLocality();
  }, [selectedCityName]);

  // City modal band hone ke baad locality wapas kholo
  useEffect(() => {
    if (!showCityModal && reopenLocalityAfterCity) {
      setShowLocalityModal(true);
      setReopenLocalityAfterCity(false);
    }
  }, [showCityModal, reopenLocalityAfterCity]);

  // Venue types matching typed text
  const matchedVenueTypes = useMemo(() => {
    const q = (searchValue || "").trim().toLowerCase();
    if (!q) return [];
    return venueData.filter(
      (v) =>
        v.id !== "all" &&
        (v.label.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
    );
  }, [searchValue]);

  // Debounced hybrid search for actual venues
  const fetchHybridResults = useCallback(
    (term) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!term || term.trim().length < 2) {
        setVenueResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);

      debounceRef.current = setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          params.append("search", term.trim());
          if (city || selectedCityName) {
            params.append("city", city || selectedCityName);
          }

          const res = await fetchWithError(
            `${BASE_URL}${VENUE_PUBLIC_LISTING}?${params}`
          );
          const json = await res.json();
          setVenueResults(Array.isArray(json?.data) ? json.data.slice(0, 8) : []);
        } catch (e) {
          setVenueResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 320);
    },
    [city, selectedCityName]
  );

  useEffect(() => {
    fetchHybridResults(searchValue);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, fetchHybridResults]);

  // Locality filter inside modal
  const filteredLocalities = useMemo(() => {
    if (!localitySearch.trim()) return localitiesData;
    return localitiesData.filter((loc) =>
      loc.toLowerCase().includes(localitySearch.toLowerCase())
    );
  }, [localitySearch, localitiesData]);

  // Click outside → close dropdown
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const hasAnyResults =
    matchedVenueTypes.length > 0 || venueResults.length > 0 || searchLoading;

  const shouldShowDropdown =
    showDropdown && (searchValue || "").trim().length > 0 && hasAnyResults;

  const getVenueDetailUrl = (venue) => {
    if (!venue?._id) return "#";
    const citySlug = (city || selectedCityName || "").toLowerCase();
    const base = citySlug
      ? `/${citySlug}/venue-list/venue`
      : "/venue-list/venue";
    return `${base}?venueid=${venue._id}`;
  };

  const handleVenueTypeClick = (item) => {
    onSelectVenueType?.(item);
    onSearchChange?.(item.label);
    setShowDropdown(false);
  };

  const handleVenueClick = (venue) => {
    setShowDropdown(false);
    onSearchChange?.(venue.venueName || "");
    router.push(getVenueDetailUrl(venue));
  };
  
  // useEffect(() => {
  //   if(showLocalityModal) {
  //     useLockBodyScroll(true);
  //   }else {
  //     useLockBodyScroll(false);
  //   }
  // }, [showLocalityModal]);

  return (
    <>
      <div className="vsb-container" ref={searchWrapRef}>
        <div className="vsb-bar-row">
          <div
            className={`vsb-input-box ${shouldShowDropdown ? "focused" : ""}`}
          >
            <div className="vsb-icon-badge">
              <Image src={SearchbarSearchIcon} />
            </div>
            <input
              type="text"
              name="search"
              className="vsb-text-input"
              placeholder="Search Venues, area"
              value={searchValue}
              onFocus={() => {
                if ((searchValue || "").trim().length > 0) {
                  setShowDropdown(true);
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                onSearchChange?.(val);
                setShowDropdown(val.trim().length > 0);
              }}
            />
          </div>

          <button
            type="button"
            className="vsb-locality-btn"
            onClick={() => setShowLocalityModal(true)}
          >
            <div className="vsb-icon-badge">
              <LocationPinIcon />
            </div>
            <span className="vsb-locality-text">
              {selectedLocality || "Locality"}
            </span>
          </button>
        </div>

        {/* Hybrid Dropdown */}
        {shouldShowDropdown && (
          <div className="vsb-dropdown-card">
            {/* ===== Venue Types Section ===== */}
            {matchedVenueTypes.length > 0 && (
              <>
                <div className="vsb-section-label">Venue Types</div>
                {matchedVenueTypes.map((item) => (
                  <div
                    key={item.id}
                    className="vsb-venue-item"
                    onClick={() => handleVenueTypeClick(item)}
                  >
                    <div className="vsb-venue-img-wrap">
                      <Image
                        src={item.img}
                        alt={item.label}
                        fill
                        sizes="44px"
                        className="vsb-venue-thumb"
                      />
                    </div>
                    <span className="vsb-venue-title">{item.label}</span>
                    <ChevronRight />
                  </div>
                ))}
              </>
            )}

            {/* ===== Actual Venues Section ===== */}
            {searchLoading && (
              <div className="vsb-no-results">Searching venues...</div>
            )}

            {!searchLoading && venueResults.length > 0 && (
              <>
                <div className="vsb-section-label">Venues</div>
                {venueResults.map((v) => (
                  <div
                    key={v._id}
                    className="vsb-venue-item"
                    onClick={() => handleVenueClick(v)}
                  >
                    <div className="vsb-venue-img-wrap vsb-venue-img-wrap--photo">
                      {v.venueImageUrl ? (
                        <img
                          src={v.venueImageUrl}
                          alt={v.venueName}
                          className="vsb-venue-thumb"
                        />
                      ) : (
                        <div className="vsb-venue-thumb-placeholder" />
                      )}
                    </div>
                    <div className="vsb-venue-meta">
                      <span className="vsb-venue-title">{v.venueName}</span>
                      <span className="vsb-venue-sub">
                        {[v.locality, v.city].filter(Boolean).join(", ") ||
                          v.city ||
                          "—"}
                      </span>
                    </div>
                    <ChevronRight />
                  </div>
                ))}
              </>
            )}

            {!searchLoading &&
              matchedVenueTypes.length === 0 &&
              venueResults.length === 0 && (
                <div className="vsb-no-results">No results found</div>
              )}
          </div>
        )}
      </div>

      {/* Locality Modal */}
      {showLocalityModal && (
        <div className="vsb-modal-overlay">
          <div className="vsb-modal-card">
            <button
              type="button"
              className="vsb-modal-close"
              onClick={() => setShowLocalityModal(false)}
            >
              ✕
            </button>

            <div className="vsb-modal-header">
              <h3 className="vsb-modal-title">Select Locality</h3>
              <div
                className="vsb-modal-city-badge"
                onClick={() => {
                  setReopenLocalityAfterCity(true);
                  setShowLocalityModal(false);
                  setShowCityModal(true);
                }}
              >
                <Image src={MapLocalityIconPopup} alt="map" />
                <span>{selectedCityName}</span>
              </div>
            </div>

            <div className="vsb-modal-input-box">
              <div className="vsb-icon-badge">
                <Image src={SearchLocalityIconPopup} alt="search" />
              </div>
              <input
                type="text"
                autoFocus
                className="vsb-text-input"
                placeholder="Search venue's areas"
                value={localitySearch}
                onChange={(e) => setLocalitySearch(e.target.value)}
              />
            </div>

            <div className="vsb-locality-list">
              {filteredLocalities.map((loc, idx) => (
                <div
                  key={`${loc}-${idx}`}
                  className="vsb-locality-item"
                  onClick={() => {
                    onSelectLocality?.(loc);
                    setShowLocalityModal(false);
                    setLocalitySearch("");
                  }}
                >
                  <span className="vsb-locality-name">{loc}</span>
                  <Image src={ArrowLocalityIconPopup} alt="arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueSearchBar;