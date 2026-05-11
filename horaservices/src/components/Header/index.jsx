"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./header.css";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import loginImg from "../../assets/profile_picture.png";
import logo from "../../assets/new_logo_light.png";
import MobileDrawer from "./MobileDrawer";
import DesktopMenu from "./DesktopMenu";
import OtploginPopup from "../OtpLoginPopup";
import LogoutModal from "@/utils/LogoutModal";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

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

  const isCityPage =
    /^\/(delhi|mumbai|noida|pune|goa|bengaluru|chennai|hyderabad)/.test(
      pathname,
    );

  const isHomeLikePage = homeLikeRoutes.includes(pathname) || isCityPage;
  const isInnerPage = !isHomeLikePage;
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderinternational",
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

  /** -----------------------
   * RENDER
   ------------------------ */
  return (
    <>
      <header className="sec-header">
        <div className="pageWidth header-wrapper">
          {/* LOGO */}
          <Link href={isWonderlandInternational ? "/wonderinternational" : "/"}>
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
