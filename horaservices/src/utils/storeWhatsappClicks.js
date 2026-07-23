import axios from "axios";
import { BASE_URL, TRACK_WHATSAPP_CLICKS } from "./apiconstants";
import { safeGetItem } from "./safeStorage";

export const trackWAClicks = async (type = "whatsapp") => {
  const userId = safeGetItem("userID");
  const visitorId = safeGetItem("VISITOR_ID");
  if (!userId && !visitorId) {
    console.log("userId or visitorId are required");
    return;
  }

  try {
    let payload = {
      userId,
      visitorId,
      type,
    };
    await axios.patch(BASE_URL + TRACK_WHATSAPP_CLICKS, payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return;
  }
};
