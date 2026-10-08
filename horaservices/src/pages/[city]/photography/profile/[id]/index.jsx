"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import profileBanner from "../../../../../assets/photographerprofile/profileBanner.jpg";
import profileImage from "../../../../../assets/photographerprofile/profileImage.svg";
import location from "../../../../../assets/photographerprofile/location.svg";
import experience from "../../../../../assets/photographerprofile/experience.svg";
import userProfile from "../../../../../assets/photographerprofile/userProfile.svg";
import aboutUser from "../../../../../assets/photographerprofile/aboutUser.svg";
import star from "../../../../../assets/photographerprofile/star.svg";
import recent from "../../../../../assets/photographerprofile/recent.svg";
import Icon1 from "../../../../../assets/photographerprofile/Icon1.svg";
import Icon2 from "../../../../../assets/photographerprofile/Icon2.svg";
import Icon3 from "../../../../../assets/photographerprofile/Icon3.svg";
import star2 from "../../../../../assets/photographerprofile/star2.svg";
import Image from "next/image";
import { BASE_URL } from "@/utils/apiconstants";
import ImageGrid from "../../../../../components/image-galleries/ImageGrid";
import CommonImagePopup from "../../../../../components/CommonImagePopup";
import "./profile.css"
import { useParams } from "next/navigation";
import { fetchWithError } from "@/utils/fetchWithError";

const Profile = () => {
   const [activeTab, setActiveTab] = useState("all");
   const [userDetails, setUserDetails] = useState(null);
   const [hasHorizontalScroll, setHasHorizontalScroll] = useState(false);
   const [scrollPosition, setScrollPosition] = useState(0);
   const [allSpecializations, setAllSpecializations] = useState([]);
   const [selectedSpecializations, setSelectedSpecializations] = useState([]);
   const [showActionMenu, setShowActionMenu] = useState(false);
   const actionMenuRef = useRef(null);
   const params = useParams();
   const supplierID = params?.id;
   const [pastOrderCount, setPastOrderCount] = useState(0);
   const [recentWorkPhotos, setRecentWorkPhotos] = useState([]);
   const [recentWorkSubFolders, setRecentWorkSubFolders] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedIndex, setSelectedIndex] = useState(null);
   const closePopup = useCallback(() => setSelectedIndex(null), []);
   const handleImageClick = useCallback((index) => setSelectedIndex(index), []);


   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            actionMenuRef.current &&
            !actionMenuRef.current.contains(event.target)
         ) {
            setShowActionMenu(false);
         }
      };

      if (showActionMenu) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [showActionMenu]);

   useEffect(() => {
      if (activeTab === "all" && recentWorkSubFolders.length > 0) {
         const firstFolderWithPhoto = recentWorkSubFolders.find((subFolder) => {
            return recentWorkPhotos.some((photo) => {
               const folderId = String(subFolder._id);

               return (
                  (Array.isArray(photo.folderIds) &&
                     photo.folderIds.map(String).includes(folderId)) ||
                  String(photo.fileId || "").startsWith(`${folderId}_`)
               );
            });
         });

         setActiveTab(
            firstFolderWithPhoto?._id ||
            recentWorkSubFolders[0]._id
         );
      }
   }, [recentWorkSubFolders, recentWorkPhotos]);

   // Selected subfolder ki images
   const filteredPhotos = useMemo(() => {
      if (!Array.isArray(recentWorkPhotos)) return [];

      if (activeTab === "all") {
         return recentWorkPhotos;
      }

      return recentWorkPhotos.filter((img) => {
         const folderId = String(activeTab);

         const folderIdsMatch = Array.isArray(img.folderIds)
            ? img.folderIds.map(String).includes(folderId)
            : false;

         const fileIdMatch = String(img.fileId || "").startsWith(
            `${folderId}_`
         );

         return folderIdsMatch || fileIdMatch;
      });
   }, [recentWorkPhotos, activeTab]);

   const getRecentWorkThumbnails = async (ownerId) => {
      try {
         if (!ownerId) return;

         const folderName = `recentWork_${ownerId}`;

         const response = await fetchWithError(`${BASE_URL}/api/photo/thumbnailsWithinProject?folderName=${encodeURIComponent(folderName)}`);

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message || "Failed to fetch thumbnails");
         }

         const mainFolder = (result.folders || []).find(
            (folder) => folder.folderName === folderName
         );

         setRecentWorkSubFolders(mainFolder?.subFolders || []);
         setRecentWorkPhotos(result.thumbnails || []);   // sirf array
      } catch (error) {
         console.error("Get Recent Work Thumbnails Error:", error);
      }
   };

   const getProfileData = async () => {
      try {
         setLoading(true);

         const userResponse = await fetchWithError(`${BASE_URL}/api/users/user_details/${supplierID}`);

         const userResult = await userResponse.json();

         const specializationResponse = await fetchWithError(`${BASE_URL}/api/specializations/get`);


         const specializationResult = await specializationResponse.json();

         if (userResult.status === 200) {
            const userData = userResult.data;

            setUserDetails(userData);
            setSelectedSpecializations(
               userData.userSpecializations || []
            );

            const FOLDER_OWNER_ID = supplierID;

            await getRecentWorkThumbnails(FOLDER_OWNER_ID);
         }

         if (specializationResult.status === 200) {
            setAllSpecializations(specializationResult.data || []);
         }
      } catch (error) {
         console.error("Get Profile Data Error:", error);
      } finally {
         setLoading(false);
      }
   };

   const getSupplierPastOrderCount = async () => {
      try {
         if (!supplierID) return;

         const response = await fetchWithError(`${BASE_URL}/api/order/supplier/${supplierID}/past-order-count`);

         const result = await response.json();

         if (!response.ok) {
            throw new Error(result.message || "Failed to get order count");
         }

         setPastOrderCount(result.count || 0);

      } catch (error) {
         console.error("Get Supplier Past Order Count Error:", error);
         setPastOrderCount(0);
      }
   };

   useEffect(() => {
      if (!supplierID) return;

      getProfileData();
      getSupplierPastOrderCount();
   }, [supplierID]);

   const selectedSpecializationList = allSpecializations.filter((item) =>
      selectedSpecializations.includes(item._id)
   );

   useEffect(() => {
      const el = document.querySelector(".cards-scroll-container");

      if (el) {
         setHasHorizontalScroll(el.scrollWidth > el.clientWidth);
      }
   }, [selectedSpecializationList]);

   return (
      <div className="main-photographer-container">
         <div className="inner-photographer-container">
            {loading ? (
               <div className="profile-loader">
                  <div className="loader-circle"></div>
               </div>
            ) : (
               <div className="profile-container">

                  <Image
                     src={profileBanner}
                     alt="profile-banner"
                     className="profile-banner"
                  />

                  <div className="profile-white-section">
                     <div className={userDetails?.avatar ? "profile-circle" : "default-profile-circle"}>
                        {userDetails?.avatar ? (
                           <Image
                              src={userDetails.avatar}
                              alt="photographer"
                              fill
                              className="profile-circle-image"
                           />
                        ) : (
                           <Image
                              src={profileImage}
                              alt="photographer"
                              width={110}
                              height={110}
                              className="default-profile-image"
                           />
                        )}
                     </div>

                     <div className="profile-info">

                        <div className="profileName-section">
                           <span className="profile-name">
                              {userDetails?.name || "N/A"}
                           </span>


                        </div>

                        <div className="profile-info-row">
                           <span className="profile-info-icon">
                              <Image
                                 src={userProfile}
                                 alt="profile-banner"
                                 width={12}
                                 height={13}
                              />
                           </span>

                           <span className="profile-info-text">
                              Age - {userDetails?.age || "N/A"} Year
                           </span>
                        </div>

                        <div className="profile-info-row">
                           <span className="profile-info-icon">
                              <Image
                                 src={experience}
                                 alt="profile-banner"
                                 width={13}
                                 height={15}
                              />
                           </span>

                           <span className="profile-info-text">
                              Experience - {userDetails?.experience || "N/A"} year
                           </span>
                        </div>

                        <div className="flex-start justify-between">
                           <div className="profile-info-row">
                              <span className="profile-info-icon">
                                 <Image
                                    src={location}
                                    alt="profile-banner"
                                    width={10}
                                    height={14}
                                 />
                              </span>

                              <span className="profile-info-text">
                                 Location - {userDetails?.city || "N/A"}
                              </span>
                           </div>

                           <div className="profile-rating-container">
                              <div style={{ width: "17", height: "16", marginBottom: "4px" }}>
                                 <Image
                                    src={star2}
                                    alt="profile-banner"
                                    width={17}
                                    height={16}
                                 />
                              </div>
                              <div className="rating-text">
                                 <div className="main-rating">
                                    4.9/5
                                 </div>
                                 <div className="profile-review-text">
                                    (10+ Reviews)
                                 </div>
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>

                  <div className="lower-container">
                     <div className="about-container">

                        <div className="flex align-start gap-12">

                           <span className="about-icon" style={{ height: "24px" }}>
                              <Image src={aboutUser} alt="aboutUser" />
                           </span>

                           <div className="flex-1">

                              <div className="flex align-center gap-8">

                                 <div className="all-heading">About</div>



                              </div>

                              <div className="about-text">
                                 {userDetails?.about || "No about added yet."}
                              </div>

                           </div>

                        </div>

                     </div>
                  </div>

                  <div className="lower-container">

                     <div className="about-container margin-top-5">

                        <div className="flex-1 right-content">

                           <div className="flex align-center gap-8">

                              <Image src={star} alt="aboutUser" />

                              <div className="all-heading">Specialization</div>

                           </div>

                           <div onScroll={(e) => {
                              const el = e.currentTarget;

                              const maxScroll = el.scrollWidth - el.clientWidth;

                              setScrollPosition(
                                 maxScroll > 0 ? el.scrollLeft / maxScroll : 0
                              );
                           }}
                              className={`${selectedSpecializationList.length > 0 ? 'cards-scroll-container' : 'no-content'}`}>

                              {selectedSpecializationList.length > 0 ? (
                                 selectedSpecializationList.map((item) => (
                                    <div key={item._id} className="spec-card">

                                       <div>
                                          <div>
                                             <Image
                                                src={`${BASE_URL}/api/uploads/specialization/${item.image}`}
                                                alt={item.name}
                                                height={34}
                                                width={42}
                                             />
                                          </div>
                                       </div>

                                       <p className="card-title">{item.name}</p>

                                    </div>
                                 ))
                              ) : (
                                 <div className="about-text">
                                    Not selected yet
                                 </div>
                              )}

                           </div>
                           {hasHorizontalScroll && (
                              <div className="custom-scroll-bar">
                                 <span className="arrow left">◀</span>

                                 <div className="track">
                                    <div
                                       className="thumb"
                                       style={{
                                          transform: `translateX(${scrollPosition * 90}px)`
                                       }}
                                    ></div>
                                 </div>

                                 <span className="arrow right">▶</span>
                              </div>
                           )}

                        </div>

                     </div>

                  </div>

                  <div className="profile-highlights">
                     <div className="highlight-card">
                        <div className="highlight-icon">
                           <img src={Icon1.src} alt="Events" />
                        </div>
                        <div className="highlight-content">
                           <h2>{pastOrderCount || 0}+</h2>
                           <h3>HORA Events Complete</h3>
                           <p>Moments turned into beautiful memories</p>
                        </div>
                     </div>

                     <div className="highlight-card">
                        <div className="highlight-icon">
                           <img src={Icon2.src} alt="Rating" />
                        </div>
                        <div className="highlight-content">
                           <h2>4.9</h2>
                           <h3>Rating &amp; Review</h3>
                           <p>Loved by thousands of happy hosts &amp; guests</p>
                        </div>
                     </div>

                     <div className="highlight-card">
                        <div className="highlight-icon">
                           <img src={Icon3.src} alt="Experience" />
                        </div>
                        <div className="highlight-content">
                           <h2>{userDetails?.experience} Years</h2>
                           <h3>Capturing Moments</h3>
                           <p>Celebrating your special days with you</p>
                        </div>
                     </div>
                  </div>

                  <div className="lower-container">

                     <div className="about-container margin-top-5">

                        <div className="flex gap-8 justify-between margin-top-5">
                           <div className="flex-1 right-content">

                              <div className="flex align-center gap-8">

                                 <Image src={recent} alt="aboutUser" />

                                 <div className="all-heading">Recent Work</div>

                              </div>

                           </div>

                        </div>

                        <div className="gallery-headerCard">
                           {recentWorkSubFolders.map((subFolder) => {

                              const subFolderPhotos = recentWorkPhotos.filter((photo) => {
                                 const folderId = String(subFolder._id);

                                 const folderIdsMatch =
                                    Array.isArray(photo.folderIds) &&
                                    photo.folderIds.map(String).includes(folderId);

                                 const fileIdMatch = String(photo.fileId || "").startsWith(
                                    `${folderId}_`
                                 );

                                 return folderIdsMatch || fileIdMatch;
                              });

                              const firstImage = subFolderPhotos.find(
                                 (photo) => photo.thumbnailImageUrl || photo.originalUrl
                              );

                              return (
                                 <div
                                    key={subFolder._id}
                                    className={`card-item ${activeTab === subFolder._id ? "active" : ""
                                       }`}
                                    onClick={() => setActiveTab(subFolder._id)}
                                 >
                                    <div className="circle-img-folder circle-img-both">

                                       {firstImage ? (
                                          <div className="circle-img-inner">
                                             <img
                                                src={firstImage.thumbnailImageUrl || firstImage.originalUrl}
                                                alt={subFolder?.folderName || "Album"}
                                                onError={(e) => {
                                                   const img = e.currentTarget;
                                                   if (firstImage.originalUrl && img.src !== firstImage.originalUrl) {
                                                      img.src = firstImage.originalUrl;
                                                   } else {
                                                      img.style.display = "none";
                                                   }
                                                }}
                                             />
                                          </div>
                                       ) : (
                                          <div className="folder-dp-alt-outer">
                                             <span className="folder-dp-alt">
                                                {subFolder.folderName?.charAt(0).toUpperCase()}
                                             </span>
                                          </div>
                                       )}

                                    </div>

                                    <span>
                                       {subFolder?.folderName || "Album"}
                                    </span>
                                 </div>
                              );
                           })}
                        </div>

                        {/* Selected subfolder ki images */}
                        <div className="image-box" style={{ minHeight: "250px" }}>
                           {filteredPhotos.length > 0 ? (
                              <ImageGrid
                                 data={filteredPhotos}
                                 loading={false}
                                 isEventWall={false}
                                 handleSelectImage={() => { }}
                                 handleImageClick={(indexOnPage) => handleImageClick(indexOnPage)}
                                 isEditing={false}
                                 isSearchMode={false}
                                 activeSubFolderId={false}
                                 isActualMyPhotos={false}
                                 selectedImages={[]}
                                 setSelectedImages={() => { }}
                              />
                           ) : (
                              <div className="empty-iamges-text total-photos">
                                 No photos in this folder yet..
                              </div>
                           )}
                        </div>
                     </div>




                  </div>


                  <CommonImagePopup
                     images={filteredPhotos}
                     selectedIndex={selectedIndex}
                     setSelectedIndex={setSelectedIndex}
                     onClose={closePopup}
                     renderActions={() => null}
                     renderFooter={() => null}
                  />



               </div>
            )}
         </div>
      </div>
   );
};

export default Profile;