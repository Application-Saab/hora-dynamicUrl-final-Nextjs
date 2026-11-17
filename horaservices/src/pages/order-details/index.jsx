import React, { useEffect } from "react";
import OrderDetailTab from "../../components/OrderDetailTab";
import {
  BASE_URL,
  GET_DECORATION_DETAILS,
  ORDER_DETAILS_ENDPOINT,
  GET_FOOD_DELIVERY_DETAILS,
  GET_PHOTOGRAPHY_ORDER_DETAILS,
} from "../../utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";
import Head from "next/head";
import { trackMetaCustomEvent } from "@/utils/fpixel";
import { safeGetItem } from "@/utils/safeStorage";
import { useRouter } from "next/router";

// order.type is 2 for chef
// order.type is 1 for decoration
// order.type is 3 for waiter
// order type 4 bar tender
// order type 5 cleaner
// order type 6 Food Delivery
// order type 7 Live Catering
// order type 8 photography

const OrderDetail = ({
  orderDetail,
  decorationItems,
  decorationComments,
  addOn,
  orderType,
  error,
}) => {
  const router = useRouter();
  
  useEffect(() => {
    if (!router.isReady) return;

    const currentMobile = safeGetItem("mobileNumber") || "";
    const currentUserId = safeGetItem("userID") || "";

    const trackEventSafely = () => {
      const params = {
        popup_name: "order_details_page",
        order_id: orderDetail?._id || "",
        order_type: orderType || "",
        user_id: currentUserId,
        mobile_number: currentMobile,
        page_path: window.location.pathname || router.asPath || "",
      };

      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        trackMetaCustomEvent("order_details_page_view", params);
      } else {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (
            typeof window !== "undefined" &&
            typeof window.fbq === "function"
          ) {
            trackMetaCustomEvent("order_details_page_view", params);
            clearInterval(interval);
          } else if (attempts >= 10) {
            clearInterval(interval);
          }
        }, 500);
      }
    };

    trackEventSafely();
  }, [router.isReady]);
  
  if (error) {
    return (
      <center>
        <div style={{ padding: "40px", color: "#9252AA" }}>
          <h4>{error}</h4>
        </div>
      </center>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders | Track Your Service Bookings | HORA</title>
        <meta
          name="description"
          content="View and manage all your HORA bookings in one place. Track order status, check booking details, view executor information, and manage your decoration, photography, chef, catering, and event service orders."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://horaservices.com/order-details" />
      </Head>
      <div className="orderheader-orderdetail">
        <div className="order-detail-page-decoration">
          <OrderDetailTab
            orderDetail={orderDetail}
            orderType={orderType}
            decorationItems={decorationItems}
            decorationComments={decorationComments}
            addOn={addOn}
          />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { apiOrderId, orderType: orderTypeRaw, orderId } = context.query;

  // Basic validation
  if (!orderTypeRaw || (!apiOrderId && !orderId)) {
    return {
      notFound: true,
    };
  }

  const orderType = parseInt(orderTypeRaw, 10);

  let orderDetail = null;
  let decorationItems = [];
  let decorationComments = "";
  let addOn = "";

  try {
    let response;
    let responseData;

    if (orderType === 2) {
      // Chef
      response = await fetchWithError(
        `${BASE_URL}${ORDER_DETAILS_ENDPOINT}/v1/${apiOrderId}`,
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if (orderType === 8) {
      // Photography
      response = await fetchWithError(
        `${BASE_URL}${GET_PHOTOGRAPHY_ORDER_DETAILS}/${orderId}`,
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if (orderType === 1) {
      // Decoration
      response = await fetchWithError(
        `${BASE_URL}${GET_DECORATION_DETAILS}/${orderId}`,
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
      decorationItems = responseData?.data?.items?.[0]?.decoration ?? [];
      decorationComments = responseData?.data?.decoration_comments ?? "";
      addOn = responseData?.data?.add_on ?? "";
    } else if ([6, 7].includes(orderType)) {
      // Food Delivery / Live Catering
      response = await fetchWithError(
        `${BASE_URL}${GET_FOOD_DELIVERY_DETAILS}/${orderId}`,
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if ([3, 4, 5].includes(orderType)) {
      // Waiter / Bar Tender / Cleaner
      response = await fetchWithError(
        `${BASE_URL}${ORDER_DETAILS_ENDPOINT}/v1/${apiOrderId}`,
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else {
      return {
        notFound: true,
      };
    }

    // Optional: forward cookies if your API requires auth
    // (uncomment + adjust fetchWithError or use native fetch if needed)
    // const cookieHeader = context.req.headers.cookie || "";
    // ...

    return {
      props: {
        orderDetail,
        decorationItems,
        decorationComments,
        addOn,
        orderType,
        error: null,
      },
    };
  } catch (err) {
    console.error("SSR OrderDetail fetch error:", err);
    return {
      props: {
        orderDetail: null,
        decorationItems: [],
        decorationComments: "",
        addOn: "",
        orderType,
        error: "Failed to load order details. Please try again later.",
      },
    };
  }
}

export default OrderDetail;
