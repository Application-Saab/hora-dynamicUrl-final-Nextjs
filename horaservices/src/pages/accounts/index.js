// import { BASE_URL, GET_USER_BY_ID } from "@/utils/apiconstants";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import "./AccountsPage.css";
// import ArrowIcon from "@/assets/forward_arrow.svg";
// import CallIcon from "@/assets/call_icon.svg";
// import LogoutIcon from "@/assets/logout_icon.svg";
// import myordericon from "@/assets/Myordersicon.png"
// import Avatar from "@/assets/avtar.jpg";
// const AccountPage = () => {
//   const [userData, setUserData] = useState({});
//   const [errorFetchUser, setErrorFetchUser] = useState(false);
//   const [loadingUser, setLoadingUser] = useState(false);
//   const userId = localStorage.getItem('userID');
//   const token = localStorage.getItem('token')
//    const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const handleLogout = () => {
//     localStorage.clear();
//      setIsLoggedIn(false);
//     window.location.href = "/wonderland";
//   };
//   const handleLogin = () => {
//     window.location.href = "/login"; // ya aapka login route
//   };
//   useEffect(() => {
//     const fetchEventImages = async () => {
//       if (!userId) {
//         setErrorFetchUser("User id not found ");
//         setLoadingUser(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `${BASE_URL}${GET_USER_BY_ID}/${userId}`,
//           {
//             headers: {
//               Authorization: `${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await response.json();
//         console.log(data);
        
//         if (data.error) {
//           setUserData({});
//           setErrorFetchUser(data.message || "Failed to fetch guests");
//         } else {
//           setUserData(data.data || {});
//         }
//       } catch (err) {
//         setErrorFetchUser("Error fetching guests: " + err.message);
//       } finally {
//         setLoadingUser(false);
//       }
//     };
//     // Initial call
//     fetchEventImages();
//   }, [userId]);
// const handleOrderClick = () => {
//     window.location.href = "https://horaservices.com/orderlist";
//     // ya agar naya tab chahiye:
//     // window.open("https://horaservices.com/orderlist", "_blank");
//   };
//   return (
//     <>
//     <div className="account-ctn">
//       <div className="details-ctn">
//         <div>
//           <img src={userData?.avatar ? userData?.avatar : 'https://avatar.iran.liara.run/public/12'} height={100} width={100} className="user-img" />
//         </div>
//         <div>
//           <p className="account-name">{userData?.name}</p>
//         </div>
//             <div
//           className="contact-ctn"
//           style={{ cursor: "pointer" }}
//           onClick={handleOrderClick}
//         >
//           <div className="contact-item">
//             <Image src={myordericon} height={18} width={18} />
//             <p>My Order</p>
//           </div>
//           <div>
//             <Image src={ArrowIcon} />
//           </div>
//         </div>
//         <div className="contact-ctn">
//           <div className="contact-item">
//             <Image src={CallIcon} height={18} width={18} />
//             <p>{userData?.phone?.includes(91) ? userData?.phone : `+91${userData?.phone}`}</p>
//           </div>
//           <div>
//             <Image src={ArrowIcon} />
//           </div>
//         </div>
        
//        <div
//       className="contact-ctn"
//       style={{ cursor: "pointer" }}
//       onClick={isLoggedIn ? handleLogout : handleLogin}
//     >
//       <div className="contact-item">
//         <Image
//           src={isLoggedIn ? LogoutIcon : LogoutIcon}
//           height={18}
//           width={18}
//           alt={isLoggedIn ? "Logout" : "Login"}
//         />
//         <p>{isLoggedIn ? "Logout" : "Login"}</p>
//       </div>
//     </div>
//       </div>
//     </div>

//     </>
//   );
// };

// export default AccountPage;

import { BASE_URL, GET_USER_BY_ID } from "@/utils/apiconstants";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./AccountsPage.css";
import ArrowIcon from "@/assets/forward_arrow.svg";
import CallIcon from "@/assets/call_icon.svg";
import LogoutIcon from "@/assets/logout_icon.svg";
import myordericon from "@/assets/Myordersicon.png";
import OtpLogin from "@/components/OtpLoginPopup";

const AccountPage = () => {
  const [userData, setUserData] = useState({});
  const [errorFetchUser, setErrorFetchUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showOtpLogin, setShowOtpLogin] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // ✅ check login state from localStorage
    if (userId && token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userId, token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
     window.location.href = "/wonderland";
  };

 const handleLogin = () => {
  setShowOtpLogin(true);   // ✅ redirect ke jagah OTP popup khulega
};


  useEffect(() => {
    const fetchEventImages = async () => {
      if (!userId) {
        setErrorFetchUser("User id not found ");
        setLoadingUser(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}${GET_USER_BY_ID}/${userId}`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.error) {
          setUserData({});
          setErrorFetchUser(data.message || "Failed to fetch user");
        } else {
          setUserData(data.data || {});
        }
      } catch (err) {
        setErrorFetchUser("Error fetching user: " + err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isLoggedIn) {
      fetchEventImages();
    }
  }, [userId, token, isLoggedIn]);

  const handleOrderClick = () => {
    window.location.href = "https://horaservices.com/orderlist";
  };

  return (
    <div className="account-ctn">
      <div className="details-ctn">
        <div>
          <img
            src={userData?.avatar ? userData?.avatar : "https://avatar.iran.liara.run/public/12"}
            height={100}
            width={100}
            className="user-img"
          />
        </div>
        <div>
          <p className="account-name">{userData?.name}</p>
        </div>

        {isLoggedIn && (
          <div
            className="contact-ctn"
            style={{ cursor: "pointer" }}
            onClick={handleOrderClick}
          >
            <div className="contact-item">
              <Image src={myordericon} height={18} width={18} />
              <p>My Order</p>
            </div>
            <div>
              <Image src={ArrowIcon} />
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="contact-ctn">
            <div className="contact-item">
              <Image src={CallIcon} height={18} width={18} />
              <p>
                {userData?.phone?.includes(91)
                  ? userData?.phone
                  : `+91${userData?.phone}`}
              </p>
            </div>
            <div>
              <Image src={ArrowIcon} />
            </div>
          </div>
        )}

        {/* ✅ Login / Logout button */}
        <div
          className="contact-ctn"
          style={{ cursor: "pointer" }}
          onClick={isLoggedIn ? handleLogout : handleLogin}
        >
          <div className="contact-item">
            <Image
              src={LogoutIcon}
              height={18}
              width={18}
              alt={isLoggedIn ? "Logout" : "Login"}
            />
            <p>{isLoggedIn ? "Logout" : "Login"}</p>
          </div>
        </div>

        {showOtpLogin && (
  <OtpLogin
    setIsModalOpen={() => setShowOtpLogin(false)}
    onSuccess={(user) => {
      localStorage.setItem("userID", user.id);
      localStorage.setItem("token", user.token);
      setIsLoggedIn(true);
      setUserData(user);
      setShowOtpLogin(false);
    }}
  />
)}
      </div>
    </div>
  );
};

export default AccountPage;
