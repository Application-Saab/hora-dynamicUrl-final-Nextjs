import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import "./Venuesearchbar.css";
import MapLocalityIconPopup from "../../../assets/venue/locality_filter_popup_map.svg";
import SearchLocalityIconPopup from "../../../assets/venue/locality_filter_popup_search.svg";
import ArrowLocalityIconPopup from "../../../assets/venue/locality_filter_popup_arrow.svg";
import SearchbarSearchIcon from '../../../assets/venue/search_bar_search_icon.svg';
import LocalityBarMapIcon from '../../../assets/venue/locality_button_map_icon.svg';

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

  useEffect(() => {
    if (!showCityModal && reopenLocalityAfterCity) {
      setShowLocalityModal(true);
      setReopenLocalityAfterCity(false);
    }
  }, [showCityModal, reopenLocalityAfterCity]);

  const matchedVenueTypes = useMemo(() => {
    const q = (searchValue || "").trim().toLowerCase();
    if (!q) return [];
    return venueData.filter(
      (v) =>
        v.id !== "all" &&
        (v.label.toLowerCase().includes(q) || v.id.toLowerCase().includes(q))
    );
  }, [searchValue]);

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

  const filteredLocalities = useMemo(() => {
    if (!localitySearch.trim()) return localitiesData;
    return localitiesData.filter((loc) =>
      loc.toLowerCase().includes(localitySearch.toLowerCase())
    );
  }, [localitySearch, localitiesData]);

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
              autoComplete="off"
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
              <Image src={LocalityBarMapIcon} alt="map pin" />
            </div>
            <span className="vsb-locality-text">
              {selectedLocality || "Locality"}
            </span>
          </button>
        </div>

        {shouldShowDropdown && (
          <div className="vsb-dropdown-card thin-scroll-design">
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
                   <Image src={ArrowLocalityIconPopup} alt="arrow" />
                  </div>
                ))}
              </>
            )}

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
                    <Image src={ArrowLocalityIconPopup} alt="arrow" />
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

            <div className="vsb-locality-list thin-scroll-design">
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