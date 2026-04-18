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
import VenueFoodModal from "@/components/VenueFoodModal";
import VenueFoodCard from "@/components/VenueFoodCard";

// ─── Static Food Packages Data ──────────────────────────────────────────────
const STATIC_FOOD_PACKAGES = [
  {
    id: 1,
    name: "FOOD",
    price: "₹1,400/-",
    tag: "All Inclusive",
    includes: {
      appetisers: {
        veg: ["French Paneer", "Mushroom Pepper", "Babycorn Chili", "American Corn", "Hara Bhara Kabab", "Paneer Tikka"],
        nonVeg: ["Chicken Kebab", "Chilly Chicken", "Fish Pepper", "Fish Koliwada", "Chicken Tikka", "Murgh Ke Sholay", "French Chicken"],
        note: "Choose any 3 from each",
      },
      mainCourse: {
        items: ["Steamed Rice", "Jeera Rice", "Veg Biryani", "Veg Diwani Handi", "Chicken Biryani", "Dal Fry", "Paneer Butter Masala", "Chicken Butter Masala", "Dhingri Mutter", "Chicken Hyderabadi", "Tomato Kaju Masala", "Veg Noodles", "Chicken Noodles", "Assorted Roti", "Naan, Tandoori, Kulcha"],
        note: "Choose any 7",
      },
      beverage: ["Mocktails", "Canned Juices", "Water", "Coke, Sprite, Soda", "Tonic Water"],
      desserts: ["Chocolate Brownie & Ice Cream"],
    },
  },
  {
    id: 2,
    name: "FOOD & BEER",
    price: "₹1,600/-",
    tag: "All Inclusive",
    includes: {
      appetisers: {
        veg: ["French Paneer", "Mushroom Pepper", "Babycorn Chili", "American Corn", "Hara Bhara Kabab", "Paneer Tikka"],
        nonVeg: ["Chicken Kebab", "Chilly Chicken", "Fish Pepper", "Fish Koliwada", "Chicken Tikka", "Murgh Ke Sholay", "French Chicken"],
        note: "Choose any 3 from each",
      },
      mainCourse: {
        items: ["Steamed Rice", "Jeera Rice", "Veg Biryani", "Veg Diwani Handi", "Chicken Biryani", "Dal Fry", "Paneer Butter Masala", "Chicken Butter Masala", "Dhingri Mutter", "Chicken Hyderabadi", "Tomato Kaju Masala", "Veg Noodles", "Chicken Noodles", "Assorted Roti", "Naan, Tandoori, Kulcha"],
        note: "Choose any 7",
      },
      beverage: ["Beer", "Mocktails", "Canned Juices", "Water", "Coke, Sprite, Soda", "Tonic Water"],
      desserts: ["Chocolate Brownie & Ice Cream"],
    },
  },
  {
    id: 3,
    name: "FOOD & IMFL",
    subtitle: "(Indian Made Foreign Liquor)",
    price: "₹2,500/-",
    tag: "All Inclusive",
    includes: {
      appetisers: {
        veg: ["French Paneer", "Mushroom Pepper", "Babycorn Chili", "American Corn", "Hara Bhara Kabab", "Paneer Tikka"],
        nonVeg: ["Chicken Kebab", "Chilly Chicken", "Fish Pepper", "Fish Koliwada", "Chicken Tikka", "Murgh Ke Sholay", "French Chicken"],
        note: "Choose any 3 from each",
      },
      mainCourse: {
        items: ["Steamed Rice", "Jeera Rice", "Veg Biryani", "Veg Diwani Handi", "Chicken Biryani", "Dal Fry", "Paneer Butter Masala", "Chicken Butter Masala", "Dhingri Mutter", "Chicken Hyderabadi", "Tomato Kaju Masala", "Veg Noodles", "Chicken Noodles", "Assorted Roti", "Naan, Tandoori, Kulcha"],
        note: "Choose any 7",
      },
      beverage: ["IMFL", "Mocktails", "Canned Juices", "Water", "Coke, Sprite, Soda", "Tonic Water"],
      desserts: ["Chocolate Brownie & Ice Cream"],
    },
  },
  {
    id: 4,
    name: "FOOD & IL",
    subtitle: "(Imported Liquor)",
    price: "₹3,500/-",
    tag: "All Inclusive",
    includes: {
      appetisers: {
        veg: ["French Paneer", "Mushroom Pepper", "Babycorn Chili", "American Corn", "Hara Bhara Kabab", "Paneer Tikka"],
        nonVeg: ["Chicken Kebab", "Chilly Chicken", "Fish Pepper", "Fish Koliwada", "Chicken Tikka", "Murgh Ke Sholay", "French Chicken"],
        note: "Choose any 3 from each",
      },
      mainCourse: {
        items: ["Steamed Rice", "Jeera Rice", "Veg Biryani", "Veg Diwani Handi", "Chicken Biryani", "Dal Fry", "Paneer Butter Masala", "Chicken Butter Masala", "Dhingri Mutter", "Chicken Hyderabadi", "Tomato Kaju Masala", "Veg Noodles", "Chicken Noodles", "Assorted Roti", "Naan, Tandoori, Kulcha"],
        note: "Choose any 7",
      },
      beverage: ["Imported Liquor", "Mocktails", "Canned Juices", "Water", "Coke, Sprite, Soda", "Tonic Water"],
      desserts: ["Chocolate Brownie & Ice Cream"],
    },
  },
  {
    id: 5,
    name: "FOOD & PL",
    subtitle: "(Premium Liquor)",
    price: "₹4,500/-",
    tag: "All Inclusive",
    includes: {
      appetisers: {
        veg: ["French Paneer", "Mushroom Pepper", "Babycorn Chili", "American Corn", "Hara Bhara Kabab", "Paneer Tikka"],
        nonVeg: ["Chicken Kebab", "Chilly Chicken", "Fish Pepper", "Fish Koliwada", "Chicken Tikka", "Murgh Ke Sholay", "French Chicken"],
        note: "Choose any 3 from each",
      },
      mainCourse: {
        items: ["Steamed Rice", "Jeera Rice", "Veg Biryani", "Veg Diwani Handi", "Chicken Biryani", "Dal Fry", "Paneer Butter Masala", "Chicken Butter Masala", "Dhingri Mutter", "Chicken Hyderabadi", "Tomato Kaju Masala", "Veg Noodles", "Chicken Noodles", "Assorted Roti", "Naan, Tandoori, Kulcha"],
        note: "Choose any 7",
      },
      beverage: ["Premium Liquor", "Mocktails", "Canned Juices", "Water", "Coke, Sprite, Soda", "Tonic Water"],
      desserts: ["Chocolate Brownie & Ice Cream"],
    },
  },
];
// ────────────────────────────────────────────────────────────────────────────

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
  const [selectedPackage, setSelectedPackage] = useState(null);

  const {
    data: eventData,
    loading: fetchEventLoading,
    makeRequest: fetchEventInvite,
    refetch: refetchEventInvite,
  } = useApi();
  const { makeRequest: fetchUserData } = useApi();

  const isHost = eventDetails?.userId === loggedinUserId;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!router.isReady) return;
      if (!queryEventId && loggedinUserId) setOpenCreateInviteModal(true);
      if (queryEventId && !loggedinUserId) setShowGuestLoginModal(true);
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
          let resp = await fetchUserData(`${GET_USER_BY_ID}/${loggedinUserId}`, "GET");
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
      setSkipRsvpCheck(isHost ? true : false);
    }
  }, [eventDetails, loggedinUserId]);

  useEffect(() => {
    const syncLoginState = () => setLoggedinUserId(localStorage.getItem("userID") || "");
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStateChange", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStateChange", syncLoginState);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowHostActionSection(eventDetails && isHost ? true : false);
    }, 1000);
  }, [eventDetails, loggedinUserId]);

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

            {/* Step 2: Sirf Address + Google Map */}
            {(eventDetails?.location || eventDetails?.googleMapLink) && (
              <div className="invite-address-section">
                <InviteAddressSection
                  eventData={eventDetails}
                  hideDateAndTime={true}
                />
              </div>
            )}

            {/* Step 3: InviteActions — sirf actual host ko */}
            {isHost && (
              <div className="invite-action-container">
                <InviteActions
                  refetchInvite={() => refetchEventInvite()}
                  eventData={eventDetails}
                />
              </div>
            )}

            {/* Step 4: Static Food Packages — 5 packages */}
          <div className="whos-joining-container" style={{ marginTop: "10px" }}>
  <p className="wall-heading text-center m-0 p-0">Food Packages</p>
  <div style={{ marginTop: "10px", padding: "0 4px" }}>
    {STATIC_FOOD_PACKAGES.map((item, index) => (
      <VenueFoodCard
        key={index}
        item={item}
        onView={() => {
          setSelectedPackage(item);
          window.history.pushState(null, "");
        }}
      />
    ))}
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

        {/* Food Package Modal */}
        {selectedPackage && (
         <VenueFoodModal
            data={selectedPackage}
            onClose={() => setSelectedPackage(null)}
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
};

export default InvitesPage;
