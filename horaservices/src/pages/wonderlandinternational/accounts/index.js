import {
  BASE_URL,
  UPDATE_USER_AVATAR_BY_ID,
  UPDATE_USER_BY_ID,
} from "@/utils/apiconstants";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./AccountsPage.css";
import ArrowIcon from "@/assets/forward_arrow.svg";
import CallIcon from "@/assets/call_icon.svg";
import LogoutIcon from "@/assets/logout_icon.svg";
import myordericon from "@/assets/Myordersicon.png";
import { useUserDetailsStore } from "@/hooks/UserDetailsContext";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import LogoutModal from "@/utils/logoutmodal.css";
import { fetchWithError } from "@/utils/fetchWithError";
import { safeGetItem, safeSetItem } from "@/utils/safeStorage";

const AccountPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const userId =
    typeof window !== "undefined" ? safeGetItem("userID") : null;
  const token =
    typeof window !== "undefined" ? safeGetItem("token") : null;
  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { userDetails, refetchUser } = useUserDetailsStore();

  useEffect(() => {
    // check login state from localStorage
    if (userId && token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userId, token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/wonderlandinternational/accounts";
  };

  const handleLogin = () => {
    setShowOtpLogin(true);
  };

  const handleOrderClick = () => {
    window.location.href = "https://horaservices.com/orderlist";
  };

  const handleNameSubmit = async (e) => {
    setEditLoading(true);
    e.preventDefault();
    if (!editedName) return;
    if (!token) {
      alert("No authentication token found, please login again.");
      return;
    }

    try {
      const response = await fetchWithError(
        `${BASE_URL}${UPDATE_USER_BY_ID}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setEditLoading(false);
        alert("Something went wrong. Please try again.");
      } else {
        safeSetItem("wonderLandUserName", editedName);
        setEditLoading(false);
        refetchUser();
        setShowEditName(false);
      }
    } catch (err) {
      setEditLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview({ url: imageUrl, file });
      handleUploadTemplate(imageUrl, file);
    }
  };

  const handleUploadTemplate = async (url, file) => {
    if (!url || !file) {
      alert("Please upload an image.");
      return;
    }
    if (!userId) {
      alert("Please log in to upload a template.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetchWithError(
        `${BASE_URL}${UPDATE_USER_AVATAR_BY_ID}/${userId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `${token || localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.data?.avatar) {
          refetchUser();
        }
      } else {
        const error = await response.json();
        alert("Submission failed: " + (error.message || error.error));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <div className="account-ctn">
        <div className="details-ctn">
          <div className="user-img-ctn">
            <img
              src={
                preview?.url
                  ? preview.url
                  : userDetails?.avatar
                  ? userDetails.avatar
                  : "https://avatar.iran.liara.run/public/12"
              }
              height={100}
              width={100}
              className="user-img"
              onClick={() => document.getElementById("userAvatarImage").click()}
            />
            <input
              type="file"
              id="userAvatarImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {isLoggedIn && (
            <div>
              <p
                className="account-name"
                onClick={() => {
                  setEditedName(userDetails?.name);
                  setShowEditName(true);
                }}
              >
                {userDetails?.name || "Your Name"}
                <span className="ms-1"></span>
              </p>
            </div>
          )}
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
                  {userDetails
                    ? userDetails?.phone?.includes(91)
                      ? userDetails?.phone
                      : `${userDetails?.phone}`
                    : ""}
                </p>
              </div>
            </div>
          )}
          <div
            className="contact-ctn"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (isLoggedIn) {
                setShowLogoutConfirm(true);
              } else {
                handleLogin();
              }
            }}
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
        </div>
      </div>

      <LoginModal
        isOpen={showOtpLogin}
        onClose={() => setShowOtpLogin(false)}
      />

      {showEditName && (
        <div className="modal-overlay-edit-form">
          <div className="modal-content-edit-form">
            <span className="edit-modal-heading">Edit Name</span>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                required
              />
              <div className="edit-form-btn-ctn">
                <button
                  type="button"
                  className="cancel-edit-btn"
                  disabled={editLoading}
                  onClick={() => setShowEditName(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-edit-btn"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <div
                      class="spinner-border text-light"
                      style={{
                        height: "1.5rem",
                        width: "1.5rem",
                      }}
                      role="status"
                    ></div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onLogoutConfirm={handleLogout}
      />
    </>
  );
};

export default AccountPage;
