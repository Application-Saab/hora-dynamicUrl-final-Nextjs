import React, { useEffect, useLayoutEffect, useState } from "react";
import "./invite.css";
import CreateInviteModal from "@/components/wonderland/create-invite/CreateInviteModal";
import InviteActions from "@/components/wonderland/common/InviteActions";
import WhosJoining from "@/components/wonderland/rsvp/WhosJoining";
import EventwallSection from "@/components/wonderland/event-wall/EventwallSection";
import { useRouter } from "next/router";
import useApi from "@/hooks/useApi";
import { GET_EVENT_BY_ID, GET_USER_BY_ID } from "@/utils/apiconstants";
import InvitePageFlashLoader from "@/components/wonderland/common/InvitePageFlashLoader";
import InviteAddressSection from "@/components/wonderland/common/InviteAddressSection";
import LoginModal from "@/components/wonderland/common/login/LoginModal";
import TemplateRenderer from "@/components/wonderland/common/TemplateRenderer";
import TemplatecardSkeleton from "@/components/wonderland/TemplateSkeleton/templatecardSkeleton";
import useRsvpStatus from "@/hooks/useRsvpStatus";
import CateringCard from "@/components/CateringCard";
import CateringModal from "@/components/CateringModal";
import { getMealTypes, getPackages } from "@/services/cateringService";

const InvitesPage = () => {
  const router = useRouter();
  const { eventid: queryEventId, invenue } = router.query;

  // ─── Venue Host Flag (URL se) ───────────────────────────────────────────────
  const isVenueHost = invenue === "true";
  // ────────────────────────────────────────────────────────────────────────────

  const [openCreateInviteModal, setOpenCreateInviteModal] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [fullPageLoader, setFullPageLoader] = useState(true);
  const [showGuestLoginModal, setShowGuestLoginModal] = useState(false);
  const [loggedinUserId, setLoggedinUserId] = useState(
    localStorage.getItem("userID") || "",
  );
  const [skipRsvpCheck, setSkipRsvpCheck] = useState(true);
  const [rsvpRefetch, setRsvpRefetch] = useState(0);
  const [showHostActionSection, setShowHostActionSection] = useState(false);
  const { rsvpSubmitted } = useRsvpStatus(
    queryEventId,
    skipRsvpCheck,
    rsvpRefetch,
  );
  const [pushRsvpClick, setPushRsvpClick] = useState(false);

  // ─── Food Packages State ────────────────────────────────────────────────────
  const [foodPackages, setFoodPackages] = useState([]);
  const [foodPackagesLoading, setFoodPackagesLoading] = useState(true);
  const [mealTypes, setMealTypes] = useState([]);
  const [mealList, setMealList] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  // ────────────────────────────────────────────────────────────────────────────

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  // Normal host check
  const isHost = eventDetails?.userId === loggedinUserId;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;

      if (!queryEventId && loggedinUserId) {
        setOpenCreateInviteModal(true);
      }
      if (queryEventId && !loggedinUserId) {
        setShowGuestLoginModal(true);
      }
      setFullPageLoader(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [router.isReady, queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchEventDetails = async () => {
      if (queryEventId && loggedinUserId) {
        try {
          await fetchEventInvite(`${GET_EVENT_BY_ID}/${queryEventId}`, "GET");
        } catch (err) {
          console.error("Error fetching event details:", err);
        }
      }
    };
    fetchEventDetails();
  }, [queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    const fetchUserDetails = async () => {
      if (queryEventId && loggedinUserId) {
        try {
          let resp = await fetchUserData(
            `${GET_USER_BY_ID}/${loggedinUserId}`,
            "GET",
          );
          setUserData(resp?.data);
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, [queryEventId, loggedinUserId]);

  useLayoutEffect(() => {
    if (eventData?.data) {
      setEventDetails(eventData.data);
      setFullPageLoader(false);
    }
  }, [eventData]);

  useLayoutEffect(() => {
    if (eventDetails && loggedinUserId) {
      if (isHost) {
        setSkipRsvpCheck(true);
      } else {
        setSkipRsvpCheck(false);
      }
    }
  }, [eventDetails, loggedinUserId]);

  // Listen local storage changes for login state
  useEffect(() => {
    const syncLoginState = () => {
      setLoggedinUserId(localStorage.getItem("userID") || "");
    };

    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (eventDetails && isHost) {
        setShowHostActionSection(true);
      } else {
        setShowHostActionSection(false);
      }
    }, 1000);
  }, [eventDetails, loggedinUserId]);

  // ─── Venue flow mein food packages fetch karo ──────────────────────────────
  useEffect(() => {
    if (!isVenueHost) return;

    const fetchFoodData = async () => {
      setFoodPackagesLoading(true);
      try {
        const meals = await getMealTypes("veg");
        setMealList(meals);
        const formattedMeals = meals
          .filter(item => item?.mealObject?._id)
          .map(item => ({
            _id: item.mealObject._id,
            name: item.mealObject.name,
          }));
        setMealTypes(formattedMeals);

        const packages = await getPackages("bulkFood", "veg");
       setFoodPackages(packages.slice(0, 4));
      } catch (err) {
        console.error("Error fetching food packages:", err);
      } finally {
        setFoodPackagesLoading(false);
      }
    };

    fetchFoodData();
  }, [isVenueHost]);

  // Modal back button handle
  useEffect(() => {
    const handleBack = () => {
      if (selectedPackage) setSelectedPackage(null);
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [selectedPackage]);
  // ────────────────────────────────────────────────────────────────────────────

  if (fullPageLoader) return <InvitePageFlashLoader />;

  // ─── VENUE FLOW ───────────────────────────────────────────────────────────────
  if (isVenueHost) {
    return (
      <>
        <div className="invite-page">
          <div className="invite-page-container">

            {/* Step 1: Template */}
            <div className="invite-template-shell">
              {fetchEventLoading ? (
                <TemplatecardSkeleton
                  width="100%"
                  height="200px"
                  borderRadius="10px"
                />
              ) : (
                <TemplateRenderer
                  fetchEventLoading={fetchEventLoading}
                  eventDetails={eventDetails}
                  orderDetails={eventDetails}
                  isHost={true}
                />
              )}
            </div>

            {/* Step 2: Sirf Address + Google Map — date/time nahi dikhega */}
            {(eventDetails?.location || eventDetails?.googleMapLink) && (
              <div className="invite-address-section">
                <InviteAddressSection
                  eventData={eventDetails}
                  hideDateAndTime={true}
                />
              </div>
            )}

            {/* Step 3: InviteActions — sirf actual host ko dikhega */}
            {isHost && (
              <div className="invite-action-container">
                <InviteActions
                  refetchInvite={() => refetchEventInvite()}
                  eventData={eventDetails}
                />
              </div>
            )}

            {/* Step 4: Food Packages */}
            <div className="whos-joining-container" style={{ marginTop: "10px" }}>
              <p className="wall-heading text-center m-0 p-0">Food Packages</p>
              <div className="catering-grid" style={{ marginTop: "10px" }}>
                {foodPackagesLoading ? (
                  [...Array(4)].map((_, i) => (
                    <TemplatecardSkeleton key={i} width="100%" height="180px" borderRadius="10px" />
                  ))
                ) : foodPackages.length > 0 ? (
                  foodPackages.map((item, index) => (
                    <CateringCard
                      key={index}
                      item={item}
                      image={
                        item.image
                          ? `https://horaservices.com/api/uploads/${item.image}`
                          : "/default-image.webp"
                      }
                      title={item.title || item.name}
                      price={item.price}
                      oldPrice={item.oldPrice || item.actualPrice}
                      dish={item.dish || item.dishCount}
                      onView={() => {
                        setSelectedPackage(item);
                        window.history.pushState(null, "");
                      }}
                    />
                  ))
                ) : (
                  <p>No Packages Found</p>
                )}
              </div>
            </div>

            {/* Step 5: Celebration Wall */}
            <div className="event-wall-container">
              <p className="wall-heading text-center m-0 p-0">Celebration Wall</p>
              <EventwallSection
                userData={userData}
                setPushRsvpClick={setPushRsvpClick}
                rsvpSubmitted={rsvpSubmitted}
                isHost={isHost}          
                isVenueHost={true}
              />
            </div>

          </div>
        </div>

        {/* Food Package Modal — venue view mein buttons nahi dikhenge */}
        {selectedPackage && (
          <CateringModal
            data={selectedPackage}
            mealTypes={mealTypes}
            allDishes={mealList}
            onClose={() => setSelectedPackage(null)}
            isVenueView={true}
          />
        )}

        <LoginModal
          isOpen={showGuestLoginModal}
          onClose={() => setShowGuestLoginModal(false)}
        />
      </>
    );
  }
  // ────────────────────────────────────────────────────────────────────────────

  // ─── NORMAL FLOW (unchanged) ─────────────────────────────────────────────────
  return (
    <>
      <div className="invite-page">
        <div className="invite-page-container">
          <div className="invite-template-shell">
            {fetchEventLoading ? (
              <TemplatecardSkeleton
                width="100%"
                height="200px"
                borderRadius="10px"
              />
            ) : (
              <TemplateRenderer
                fetchEventLoading={fetchEventLoading}
                eventDetails={eventDetails}
                orderDetails={eventDetails}
                isHost={isHost}
              />
            )}
          </div>

          {((eventDetails && eventDetails?.eventDate) ||
            eventData?.location ||
            eventData?.googleMapLink ||
            eventData?.eventTime) && (
            <div className="invite-address-section">
              <InviteAddressSection eventData={eventDetails} />
            </div>
          )}

          {showHostActionSection && (
            <div className="invite-action-container">
              <InviteActions
                refetchInvite={() => refetchEventInvite()}
                eventData={eventDetails}
              />
            </div>
          )}

          <div
            className="whos-joining-container"
            style={{ marginTop: !showHostActionSection ? "10px" : "0px" }}
          >
            <WhosJoining
              isHost={isHost}
              userData={userData}
              loggedinUserId={loggedinUserId}
              rsvpSubmitted={rsvpSubmitted}
              setPushRsvpClick={setPushRsvpClick}
              pushRsvpClick={pushRsvpClick}
              onRsvpUpdate={() => setRsvpRefetch((prev) => prev + 1)}
            />
          </div>

          <div className="event-wall-container">
            <p className="wall-heading text-center m-0 p-0">Celebration Wall</p>
            <EventwallSection
              userData={userData}
              setPushRsvpClick={setPushRsvpClick}
              rsvpSubmitted={rsvpSubmitted}
              isHost={isHost}
            />
          </div>
        </div>
      </div>

      <CreateInviteModal
        isOpen={openCreateInviteModal}
        onClose={() => setOpenCreateInviteModal(false)}
      />
      <LoginModal
        isOpen={showGuestLoginModal}
        onClose={() => setShowGuestLoginModal(false)}
      />
    </>
  );
  // ────────────────────────────────────────────────────────────────────────────
};

export default InvitesPage;
