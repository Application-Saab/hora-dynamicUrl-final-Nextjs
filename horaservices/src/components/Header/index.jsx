import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
// import avtar from '../assets/avtar.jpg';
import logo from '../../assets/new_logo_light.png.png';
import logolight from '../../assets/hora-light-innerpage.png'
import loginIcon from '../../assets/profile_picture.png';
import { faInstagram ,faWhatsapp  } from '@fortawesome/free-brands-svg-icons';
import { FaCaretDown , FaClipboardList } from "react-icons/fa";
import backIcon from '../../assets/back_arrow1.png';
import logoutImage from '../../assets/logout.png';
import logoWhite from '../../../public/assets/logo_white.svg'

import Link from "next/link";
import Image from "next/image";
import useScrollToTop from '../useScrollToTop'; // Import the custom hook
import ChefCitypage from "../../pages/[city]/chef-near-me";
 import Popup from "../../utils/popup";
import { usePathname, useRouter } from "next/navigation";

function Header() {
  useScrollToTop(); // Use the custo hook

//   const location = useLocation();
  const router = useRouter();
  const routerPathname = usePathname();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDecorationSubMenu, setShowDecorationSubMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [isMounted, setIsMounted] = useState(false); // State to check if component has mounted
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isHomePage = routerPathname === '/';
  const isDelhiPage = routerPathname === '/delhi';

  const drawerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false); // State for controlling popup visibility
  const [popupMessage, setPopupMessage] = useState({}); // State for popup message
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") === "true";
  
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };
  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
};

  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setShowDrawer(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerRef]);

  useEffect(() => {
    setIsMounted(true); // Set the component as mounted
  }, []);

  const openCatItems = (subCategory) => {
    router.push(`/decoration-cat-page/${subCategory}`);
  };


  const SearchBar = () => (
    <div className="navbar-search">
        <input type="text" placeholder="Search for Services" />
        <button className="search-button">
            <i className="search-icon"></i>
        </button>
    </div>
);
const HeaderenuItems = [
  {
    path: "/",
    label: "Categories",
    submenu: [
      { path: "/balloon-decoration", label: "Decoration" },
      { path: "/book-chef-cook-for-party", label: "Chef for Party" },
      { path: "/party-food-delivery-live-catering-buffet/party-food-delivery", label: "Food Delivery" },
      { path: "/party-food-delivery-live-catering-buffet/party-live-buffet-catering", label: "Live Catering" },
      { path: "/", label: "Entertainment", onClick: () => openCatItems("FirstNight") }
    ]
  },
  { path: "/contactus", label: "Contact Us" },
  { path: "/aboutus", label: "About Us" },
  { path: "/reviews", label: "Customer Reviews" }
];


const MainMenu = ({ isDropdownOpen, toggleDropdown }) => (
  <ul style={styles.desktopMenu}>
    {HeaderenuItems.map((item, index) => (
      <li key={index} style={styles.desktopMenuli}>
        {item.submenu ? (
          // If submenu exists (i.e., it's the Categories item)
          <div className="navbar-categories">
            <button onClick={toggleDropdown} className="categories-button">
              <i className="categories-icon"></i>
              {item.label}
              <i className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}></i>
            </button>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              {item.submenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link href={subItem.path} style={styles.subMenuLink} onClick={subItem.onClick || undefined}>
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Regular menu item (not Categories)
          <Link href={item.path} style={styles.link} onClick={item.onClick || undefined}>
            {item.label}
          </Link>
        )}
      </li>
    ))}
  </ul>
);

useEffect(() => {
  const getTitle = () => {
    const pathname = routerPathname;
    switch (true) {
      case pathname === "/balloon-decoration":
        return "Decoration";
      case pathname === "/book-chef-cook-for-party":
        return "Create Order";
      case pathname === "/book-chef-cook-for-party/order-details":
        return "Order Details";
      case pathname === "/book-chef-checkout":
        return "Checkout";
      case pathname ===
        "/party-food-delivery-live-catering-buffet/party-food-delivery":
        return "Food Delivery";
      case pathname ===
        "/party-food-delivery-live-catering-buffet-select-date/party-food-delivery":
        return "Food Delivery Order Details";
      case pathname === "/party-food-delivery-live-catering-buffet-checkout":
        return "Checkout";
      case pathname ===
        "/party-food-delivery-live-catering-buffet/party-live-buffet-catering":
        return "Live Catering";
      case pathname ===
        "/party-food-delivery-live-catering-buffet-select-date/party-live-buffet-catering":
        return "Live Catering Order Details";
      case pathname === "/contactus":
        return "Contact Us";
      case pathname === "/aboutus":
        return "About Us";
      case pathname.match(/^\/balloon-decoration\/.+\/product\/.+$/) !== null:
        return "Product";
      case pathname.match(/^\/balloon-decoration\/.+$/) !== null:
        return "Decoration category";
      case pathname.includes("/photo-gallery"):
          return "Photo Gallery";
      default:
        return "";
    }
  };

  if (routerPathname) {
    setPageTitle(getTitle());
  }
}, [routerPathname]);

  const openLink = () => {
    window.open("https://play.google.com/store/apps/details?id=com.hora", "_blank");
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.clear();
    setPopupMessage({
      img: logoutImage,
      title: "Logout Successful",
      body: "You have been logged out successfully.",
      button: "OK"
    });
    setShowPopup(true); // Show the popup
    router.push("/");
  };

  const cityNames = ["/", "/delhi", "/mumbai", "/gurugram", "/ghaziabad", "/faridabad", "/noida", "/bengaluru", "/hyderabad", "/indore", "/chennai", "/pune", "/surat", "/bhopal", "/lucknow", "/goa"];
  const IscityPagePaths = cityNames.includes(routerPathname);
  return (
    <>
     {IscityPagePaths
     ?  (
          <header style={styles.headerContainerhome} className="home-header">
            <div className="pageWidth">
              {/* desktop menu */}
              <div style={styles.headerContainerinner} className="headerContainerinner">
                <div className="z-1 headerLogoImage">
                  <Link href="/">
                    <Image src={logo} alt="Logo" style={styles.logo} />
                  </Link>
                </div>
                <nav className="nav-li" style={styles.desktopMenu}>
                  <MainMenu isDropdownOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
                </nav>
                <div className="rightSideIcons">
                  <ul style={styles.desktopMenu}>
                    <li style={styles.desktopMenuli1}>
                      {isMounted && (!isLoggedIn ? (
                        <>
                          <Link href="/login" style={styles.linkicon}>
                            <Image src={loginIcon} alt={'login icon'} width={20} height={20} />
                            <span style={{ marginLeft: "7px" }}>Login</span>
                          </Link>
                        </>
                      ) : (<>
                        <a style={styles.linkiconLogout} onClick={handleLogout}>
                          <image src={loginIcon} />
                          <span style={{ marginLeft: "3px" }}>Logout</span>
                        </a>
                      </>))}
                    </li>
                    <li>
                      <Link style={isLoggedIn ? styles.linkiconLogout : styles.linkicon} href="/orderlist">
                        <FaClipboardList />
                        <span style={{ marginLeft: "3px" }}>My Order</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>


              {/* mobile menu */}
              <div style={styles.mobileViewHeader} className='mobileViewHeader py-2'>
                <div className="mobile-container" style={{ width: "100%" }}>
                  {isHomePage || IscityPagePaths ? (
                    <>
                      <Link href="/">
                        <Image src={logo} alt="Logo" style={{ width: "50px", height: "50px", margin: "0px auto" }} />
                      </Link>
                      <FontAwesomeIcon
                        icon={faBars}
                        className="mobileMenuIcon"
                        style={styles.mobileMenuIcon}
                        onClick={toggleDrawer}
                      />

                    </>
                  ) : (
                    <>
                      <Image
                        src={backIcon}
                        alt="Back"
                        style={{
                          width: "35px",
                          height: "auto",
                          cursor: "pointer",
                          color: "#96528D",
                        }}
                        onClick={handleBack}
                      />

                      <h1 style={{ margin: 0, fontSize: "16px" }}>{pageTitle}</h1>
                    </>
                  )}
                </div>
              </div>
            </div>
            {showDrawer && <Drawer closeDrawer={toggleDrawer} drawerRef={drawerRef} handleLogout={handleLogout} />}
            {showPopup && <Popup onClose={() => setShowPopup(false)} popupMessage={popupMessage} />} {/* Render the Popup */}
          </header>
      ) : (
        <header style={styles.headerContainerinnerpage} className="inner-page-header">
        <div className="pageWidth">
          <div style={styles.headerContainerinner} className="headerContainerinner">
            <div className="z-1 headerLogoImage">
              <Link href="/">
                <Image src={logolight} alt="Logo" style={styles.logo} />
              </Link>
            </div>
            <nav >
            <ul style={styles.desktopMenu}>
                {HeaderenuItems.map((item, index) => (<>
                 
                    {item.submenu ? (
                      <>
                        <li
                          style={styles.innerpagedesktopMenuli}
                          onMouseEnter={() => {
                            setShowDecorationSubMenu(true);
                            setIsHovered(true);
                          }}
                          onMouseLeave={() => {
                            setShowDecorationSubMenu(false);
                            setIsHovered(false);
                          }}
                        >
                          <span style={styles.innerpagelink}>{item.label}</span>
                          <FaCaretDown
                            className={`dropdpwnarrow ${isHovered ? "rotate-icon" : ""}`}
                          />
                          {showDecorationSubMenu && (
                            <ul style={styles.subMenu}>
                              {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link href={subItem.path} style={styles.subMenuLink} onClick={subItem.onClick || undefined}>
                                    {subItem.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      </>
                    ) : (
                      <li key={index} style={styles.desktopMenuli}>
                      <Link href={item.path} style={styles.innerpagelink}>
                        {item.label}
                      </Link></li>
                    )}
                 </>
                ))}
              </ul>
            </nav>
      
            <div className="rightSideIcons">
              <ul style={styles.desktopMenu}>
                <li style={styles.desktopMenuli1}>
                  {isMounted && !isLoggedIn ? (
                    <Link href="/login" style={styles.innerpagelinkicon}>
                      <FontAwesomeIcon icon={faUser} style={styles.icon} />
                      <span style={{ marginLeft: "3px" }}>Login</span>
                    </Link>
                  ) : (
                    <a style={styles.linkiconLogout} onClick={handleLogout}>
                      <FontAwesomeIcon icon={faUser} style={styles.icon} />
                      <span style={{ marginLeft: "3px" }}>Logout</span>
                    </a>
                  )}
                </li>
                <li>
                  <Link
                    style={isLoggedIn ? styles.linkiconLogout : styles.innerpagelinkicon}
                    href="/orderlist"
                  >
                    <FaClipboardList />
                    <span style={{ marginLeft: "3px" }}>My Order</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
      
          <div style={styles.mobileViewHeader} className="mobileViewHeader py-2">
            <div className="d-flex align-items-center gap-3 z-1" style={{ width: "100%", justifyContent: "space-between" }}>
              {isHomePage && ChefCitypage ? (
                <>
                  <FontAwesomeIcon
                    icon={faBars}
                    className="mobileMenuIcon"
                    style={styles.mobileMenuIcon}
                    onClick={toggleDrawer}
                  />
                  <Link href="/" style={{ display: "flex", width: "80%", textAlign: "center" }}>
                    <Image src={logoWhite} alt="Logo" style={{ width: "85px", height: "auto", margin: "0px auto" }} />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="Logo"
                      style={{ width: "50px", height: "50px", margin: "0px auto", background: "white", borderRadius: "50%" }}
                    />
                  </Link>
                  <h1 style={{ margin: 0, fontSize: "16px" }}>{pageTitle}</h1>
      
                  <div className="brandLogo">
                    <Link
                      href="https://www.instagram.com/horaservices/?fbclid=IwAR0PktJ-rl5rKC6YGSZ8BSw3m8o9qMfLpJchO17FCEZuCXKxvASZWRymifA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-2"
                      style={{ color: "inherit" }}
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </Link>
                    <Link
                      href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-2"
                      style={{ color: "inherit" }}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      
        {showDrawer && <Drawer closeDrawer={toggleDrawer} drawerRef={drawerRef} handleLogout={handleLogout} />}
        {showPopup && <Popup onClose={() => setShowPopup(false)} popupMessage={popupMessage} />}
      </header>    
      )
    }
    </>
  );
}

const Drawer = ({ closeDrawer, drawerRef, handleLogout }) => {
  const style = {
    drawer: {
      width: "60%",
      backgroundColor: "#fff",
      padding: "0px",
      boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
      position: "fixed",
      top: "0%",
      right: "0%",
      zIndex: 999,
      height: "100vh",
      transition: "left 0.3s ease-in-out",
    },
    drawerLink: {
      borderBottom: "1px solid #efefef",
      color: "#000",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
      margin: "10px 0",
      display: "block",
      cursor:"pointer",
      padding:"0 0 6px 0",
    },
    drawerLinklogin: {
      color: "#fff",
      cursor:"pointer",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
      margin: "10px 0",
      display: "block",
    }
  };

  return (
    <div style={style.drawer} ref={drawerRef}>
      <div style={{ backgroundColor:"rgb(157, 74, 147)" , padding:"30px 10px 20px 20px"}}>
      <Link href="/" style={{ textDecoration:"none"}}>
        <span style={{ color:"#fff" , textDecoration:"none" , fontWeight:"bold"}}>Welcome to Hora</span>
      </Link>
      </div>
      <div style={{ padding:"0px 10px 20px 20px"}}>
      <Link href="/orderlist" style={style.drawerLink} onClick={closeDrawer}>
        My Order
      </Link>
      <Link href="/balloon-decoration" style={style.drawerLink} onClick={closeDrawer}>
        Decoration
      </Link>
      <Link href="/book-chef-cook-for-party" style={style.drawerLink} onClick={closeDrawer}>
        Chef for Party
      </Link>
      <Link href="/party-food-delivery-live-catering-buffet/party-food-delivery" style={style.drawerLink} onClick={closeDrawer}>
        Food Delivery
      </Link>
      <Link href="/party-food-delivery-live-catering-buffet/party-live-buffet-catering" style={style.drawerLink} onClick={closeDrawer}>
        Live Catering
      </Link>
      <Link href="/" style={style.drawerLink} onClick={closeDrawer}>
        Entertainment
      </Link>
      <Link href="/" style={style.drawerLink} onClick={closeDrawer}>
        Hospitality Service
      </Link>
      <Link href="/aboutus" style={style.drawerLink} onClick={closeDrawer}>
        About Us
      </Link>
      <Link href="/contactus" style={style.drawerLink} onClick={closeDrawer}>
        Contact Us
      </Link>
      {localStorage.getItem("isLoggedIn") !== "true" ? (
        <Link href="/login" style={style.drawerLink} onClick={closeDrawer} >
          Login
        </Link>
      ) : (
        <>
          <Link href="/" style={style.drawerLink} onClick={() => {
            handleLogout();
            closeDrawer();
          }}>
            Logout
          </Link>
        </>
      )}
      <Link style={styles.linkiconOrder} href="/orderlist">
                    <FaClipboardList />
                    <span style={{ marginLeft: "3px" }}>My Order</span>
                  </Link>
      </div>
    </div>
  );
};

const styles = {
  headerContainerhome: {
    background: "#F1F5F7",
    padding:"6px 47px 8px 31px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  headerContainerinnerpage:{
   background: "linear-gradient(119deg, #6730B2 -20.39%, #EE7464 80.65%)",
    padding: "1px 30px",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  },
  headerContainerinner: {
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    window: "1200px",
  },
  logo: {
    width: "50px",
    height: "auto",
    margin: "0px",
    padding: "0px",
  },
  desktopMenu: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    listStyle: "none",
    marginBottom: "0",
    listStyleType: "none",
  },
  desktopMenuli: {
    position: "relative",
    color:"#333",
  },
  innerpagedesktopMenuli: {
    paddingRight: "16px",
    position: "relative",
  },
  desktopMenuli1: {
    paddingRight: "3px",
    position: "relative",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  innerpagelink:
  {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer", 
  },
  innerpagelogo: {
    width: "109px",
    height: "56px",
    margin: "0px",
    padding: "0px",
  },
  linkicon: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  linkiconLogout: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  linkiconOrder :{
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  innerpagelinkicon:{
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  linkicon1: {
    padding: "0 18px",
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    marginLeft: "1px",
  },
  subMenu: {
    position: "absolute",
  top: "82%",
  left: "0",
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  listStyle: "none",
  padding: "10px",
  margin: "5px 0 0 0",
  borderRadius: "5px",
  zIndex:"1111",
  },
  subMenuLink: {
    display: "block",
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding:"7px 5px 0px 4px",
  },
  lastChild: {
    borderBottom: "none",
  },
  icon: {
    marginRight: "5px",
  },
  mobileViewHeader: { display: "none" },
  mobileMenuIcon:{
    margin:'0px',
    height:'18px',
    color:"#96528D",
  }
};

export default Header;
