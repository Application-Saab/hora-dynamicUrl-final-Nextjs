import {
  BASE_URL,
  GET_USER_BY_ID,
  UPDATE_USER_AVATAR_BY_ID,
  UPDATE_USER_BY_ID,
} from "@/utils/apiconstants";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./AccountsPage.css";
import ArrowIcon from "@/assets/forward_arrow.svg";
import ArrowIconColoured from "@/assets/forward_arrow_coloured.svg";
import CallIcon from "@/assets/call_icon.svg";
import LogoutIcon from "@/assets/logout_icon.svg";

const AccountPage = () => {
  const [userData, setUserData] = useState({});
  const [errorFetchUser, setErrorFetchUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const userId = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [refetchUserData, setRefetchUserData] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  console.log(
    "%c [ preview ]-24",
    "font-size:13px; background:pink; color:#bf2c9f;",
    preview
  );
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/wonderland";
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
          setErrorFetchUser(data.message || "Failed to fetch guests");
        } else {
          setUserData(data.data || {});
        }
      } catch (err) {
        setErrorFetchUser("Error fetching guests: " + err.message);
      } finally {
        setLoadingUser(false);
      }
    };
    // Initial call
    fetchEventImages();
  }, [userId, refetchUserData]);

  const handleNameSubmit = async (e) => {
    setEditLoading(true);
    e.preventDefault();
    if (!editedName) return;
    if (!token) {
      alert("No authentication token found, please login again.");
      return;
    }

    try {
      const response = await fetch(
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
        localStorage.setItem("wonderLandUserName", editedName);
        setEditLoading(false);
        setRefetchUserData(!refetchUserData);
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
    setLoadingUpload(true);
    if (!url || !file) {
      alert("Please upload an image.");
      setLoadingUpload(false);
      return;
    }
    if (!userId) {
      alert("Please log in to upload a template.");
      setLoadingUpload(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
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
        setLoadingUpload(false);
        const data = await response.json();
        if (data) {
          setPreview(null);
          setRefetchUserData(!refetchUserData);
        }
        setPreview(null);
      } else {
        setLoadingUpload(false);
        const error = await response.json();
        alert("Submission failed: " + (error.message || error.error));
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <>
      <div className="account-ctn">
        <div className="details-ctn">
          <div className="user-img-ctn">
            <img
              src={
                userData?.avatar
                  ? userData?.avatar
                  : "https://avatar.iran.liara.run/public/12"
              }
              height={100}
              width={100}
              className="user-img"
              onClick={() => document.getElementById("userAvatarImage").click()}
            />
            {loadingUpload && <span className="loader"></span>}
            <input
              type="file"
              id="userAvatarImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <p
              className="account-name"
              onClick={() => {
                setEditedName(userData?.name);
                setShowEditName(true);
              }}
            >
              {userData?.name || "Your Name"}
              <span className="ms-1"><Image src={ArrowIconColoured} height={18} width={18} /></span>
            </p>
          </div>
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
          <div
            className="contact-ctn"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <div className="contact-item">
              <Image src={LogoutIcon} height={18} width={18} />
              <p>Logout</p>
            </div>
            <div>
              <Image src={ArrowIcon} />
            </div>
          </div>
        </div>
      </div>
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
                  {editLoading ? <span className="loader"></span> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPage;
