import React from "react";
import OrderDetailTab from "../../components/OrderDetailTab";
import {
  BASE_URL,
  GET_DECORATION_DETAILS,
  ORDER_DETAILS_ENDPOINT,
  GET_FOOD_DELIVERY_DETAILS,
  GET_PHOTOGRAPHY_ORDER_DETAILS,
} from "../../utils/apiconstants";
import { fetchWithError } from "@/utils/fetchWithError";

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
        `${BASE_URL}${ORDER_DETAILS_ENDPOINT}/v1/${apiOrderId}`
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if (orderType === 8) {
      // Photography
      response = await fetchWithError(
        `${BASE_URL}${GET_PHOTOGRAPHY_ORDER_DETAILS}/${orderId}`
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if (orderType === 1) {
      // Decoration
      response = await fetchWithError(
        `${BASE_URL}${GET_DECORATION_DETAILS}/${orderId}`
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
      decorationItems = responseData?.data?.items?.[0]?.decoration ?? [];
      decorationComments = responseData?.data?.decoration_comments ?? "";
      addOn = responseData?.data?.add_on ?? "";
    } else if ([6, 7].includes(orderType)) {
      // Food Delivery / Live Catering
      response = await fetchWithError(
        `${BASE_URL}${GET_FOOD_DELIVERY_DETAILS}/${orderId}`
      );
      responseData = await response.json();
      orderDetail = responseData?.data ?? null;
    } else if ([3, 4, 5].includes(orderType)) {
      // Waiter / Bar Tender / Cleaner
      response = await fetchWithError(
        `${BASE_URL}${ORDER_DETAILS_ENDPOINT}/v1/${apiOrderId}`
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