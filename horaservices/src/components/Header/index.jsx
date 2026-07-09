"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./header.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import loginImg from "../../assets/profile_picture.png";
import logo from "../../assets/new_logo_light.png";
import MobileDrawer from "./MobileDrawer";
import DesktopMenu from "./DesktopMenu";
import OtploginPopup from "../OtpLoginPopup";
import LogoutModal from "@/utils/LogoutModal";
import CitySelector from "../Venue/CitySelector";
import cityNameToSlug from "@/utils/cityNameToSlug";

const CITY_LIST = Object.values(cityNameToSlug);

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const drawerRef = useRef(null);

  /** -----------------------
   * PAGE TYPE LOGIC
   ------------------------ */
  const homeLikeRoutes = [
    "/",
    "/photography-page",
    "/photo-gallery",
    "/wonderland",
    "/templates",
    "/services",
  ];

  const CITY_PATH_REGEX = new RegExp(`^/(${CITY_LIST.join("|")})(?=/|$)`, "i");
  const isCityPage = pathname ? CITY_PATH_REGEX.test(pathname) : false;

  const isHomeLikePage = homeLikeRoutes.includes(pathname) || isCityPage;
  const isInnerPage = !isHomeLikePage;
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );

  /** -----------------------
   * AUTH
   ------------------------ */
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  /** -----------------------
   * EFFECTS
   ------------------------ */
  useEffect(() => setIsMounted(true), []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setShowDrawer(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);

  // ✅ agar sessionStorage mein city save hai (popup se select ki hui) use wahi dikhao
  // ✅ warna, agar user seedha kisi city-route par aaya hai (jaise /bengaluru/balloon-decoration),
  //    URL se hi city nikal ke "Select City" ki jagah wahi dikhao
  useEffect(() => {
    const savedCity = sessionStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
      return;
    }

    if (!pathname) {
      setSelectedCity("");
      return;
    }

    const match = pathname.match(CITY_PATH_REGEX);
    if (match && match[1]) {
      const citySlugFromUrl = match[1].toLowerCase();
      setSelectedCity(citySlugFromUrl);
    } else {
      setSelectedCity("");
    }
  }, [pathname]);

  // ✅ display ke liye pehla letter capital, baaki lowercase (routing/slug par koi asar nahi)
  const toDisplayCity = (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const handleCitySelect = (city) => {
    const selected = city === "Others" ? "" : city;

    setSelectedCity(selected);
    setShowCityModal(false);

    sessionStorage.setItem("cityModalShown", "true");
    sessionStorage.setItem("selectedCity", selected);

    // pathname se PURANI city hamesha strip karo (agar hai toh)
    const restOfPath = pathname ? pathname.replace(CITY_PATH_REGEX, "") : "";

    if (selected) {
      const citySlug = selected.toLowerCase().trim().replace(/\s+/g, "-");
      const newUrl = `/${citySlug}${restOfPath}`;
      router.push(newUrl, { scroll: false });
    } else {
      router.push(restOfPath || "/", { scroll: false });
    }
  };
  /** -----------------------
   * RENDER
   ------------------------ */
  return (
    <>
      <header className="sec-header">
        <div className="pageWidth header-wrapper">
          {/* LOGO */}
          <Link href={isWonderlandInternational ? "/wonderlandinternational" : "/"}>
            <Image src={logo} alt="Logo" className="header-logo" />
          </Link>

          {/* DESKTOP MENU */}
          {!isWonderlandInternational && (
            <div className="desktop-only">
              <DesktopMenu />
            </div>
          )}

          {/* AUTH (DESKTOP) */}
          {!isWonderlandInternational && (
            <div className="desktop-only auth-section">
              {isMounted && !isLoggedIn ? (
                /* LOGIN */
                <div onClick={() => setIsLoginOpen(true)} className="auth-btn">
                  <Image
                    src={loginImg} // 👈 sirf login image
                    alt="Login"
                    width={20}
                    height={20}
                  />
                  <span>Login</span>
                </div>
              ) : (
                /* LOGOUT */
                <div onClick={() => setIsLogoutOpen(true)} className="auth-btn">
                  <span>Logout</span> {/* ❌ no image here */}
                </div>
              )}
            </div>
          )}

          {/* MOBILE HEADER */}
          {!isWonderlandInternational && (
            <div className="mobile-only mobile-header">
              {/* CITY SELECTOR PILL */}
              <div className="citySelectorPill" onClick={() => setShowCityModal(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "2px" }}>
                  <path
                    d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"
                    stroke="#97538C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="2.5" stroke="#97538C" strokeWidth="2" />
                </svg>
                <span className="citySelectorPill-text">
                  {toDisplayCity(selectedCity) || "Select City"}
                </span>
                <svg width="16" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#97538C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {isHomeLikePage ? (
                <FontAwesomeIcon
                  icon={faBars}
                  className="menu-icon"
                  onClick={() => setShowDrawer(true)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  className="menu-icon"
                  onClick={toggleDrawer}
                />
              )}
            </div>
          )}
        </div>
        {showCityModal && (
          <CitySelector onSelect={handleCitySelect} />
        )}
        {/* MOBILE DRAWER */}
        {showDrawer && (
          <MobileDrawer
            drawerRef={drawerRef}
            onClose={() => setShowDrawer(false)}
            onLogin={() => setIsLoginOpen(true)}
            onLogout={() => setIsLogoutOpen(true)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </header>

      {/* LOGIN MODAL */}
      {isLoginOpen && <OtploginPopup setIsModalOpen={setIsLoginOpen} />}

      {/* LOGOUT MODAL */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogoutConfirm={handleLogout}
      />
    </>
  );
};

export default Header;