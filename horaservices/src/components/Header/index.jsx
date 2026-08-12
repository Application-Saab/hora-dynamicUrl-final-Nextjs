"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import loginImg from "../../assets/profile_picture.png";
import logo from "../../assets/new_logo_light.png";
import MobileDrawer from "./MobileDrawer";
import DesktopMenu from "./DesktopMenu";
import OtploginPopup from "../OtpLoginPopup";
import cityNameToSlug from "../../utils/Citynametoslug.json";
import { useCity } from "@/utils/cityContext";
import { safeGetItem } from "@/utils/safeStorage";
import LogoutModal from "@/utils/LogoutModal";

const CITY_LIST = Object.values(cityNameToSlug);

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const drawerRef = useRef(null);

  // ✅ ab city state yahan se nahi, shared context se aayegi
  const { selectedCityName, setShowCityModal, isPillHiddenRoute } = useCity();

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
    safeGetItem("isLoggedIn") === "true";

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
                    src={loginImg}
                    alt="Login"
                    width={20}
                    height={20}
                  />
                  <span>Login</span>
                </div>
              ) : (
                /* LOGOUT */
                <div onClick={() => setIsLogoutOpen(true)} className="auth-btn">
                  <span>Logout</span>
                </div>
              )}
            </div>
          )}

          {/* MOBILE HEADER */}
          {!isWonderlandInternational && (
            <div className="mobile-only mobile-header">
              {/* CITY SELECTOR PILL — sirf /photo-gallery par hide hogi, baaki sab routes par dikhegi */}
              {!isPillHiddenRoute && (
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
                    {selectedCityName || "Select City"}
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
              )}

              {isHomeLikePage ? (
                <FontAwesomeIcon
                  icon={faBars}
                  className="menu-icon"
                  onClick={() => setShowDrawer(true)}
                />
              ) : (
                <>
                  <div className="mobile-only mobile-header">
                    <FontAwesomeIcon
                      icon={faBars}
                      className="menu-icon"
                      onClick={toggleDrawer}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ❌ CitySelector yahan se hata diya — ab sirf PageLayout mein ek hi baar render hoga */}

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