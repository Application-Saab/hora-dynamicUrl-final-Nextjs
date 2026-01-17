import React, { useEffect, useState } from "react";
import OrderDetailTab from "../../components/OrderDetailTab";
import {
  BASE_URL,
  GET_DECORATION_DETAILS,
  ORDER_DETAILS_ENDPOINT,
  GET_FOOD_DELIVERY_DETAILS
} from "../../utils/apiconstants";
import { useRouter } from "next/router";

// order.type is 2 for chef
// order.type is 1 for decoration
// order.type is 3 for waiter
// order type 4 bar tender
// order type 5 cleaner
// order type 6 Food Delivery
// order type 7 Live Catering

const OrderDetail = () => {

  const router = useRouter();
  let { apiOrderId, orderType, orderId } = router.query;
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const [decorationItems, setDecorationItems] = useState([]);
  const [decorationComments, setDecorationComments] = useState("");
  const [addOn , setAddOn] = useState('');
  const [hospitalityServiceCount, setHospitalityServiceCount] = useState();
  const [hospitalityServiceTotalAmount, setHospitalityServiceTotalAmount] =
    useState();

  orderType = parseInt(orderType);

  useEffect(() => {
    if ([2, 8].includes(orderType)) {
      fetchOrderDetailsMenu();
    } else if (orderType === 1) {
      fetchDecorationOrderDetails();
    } else if ([6, 7].includes(orderType)) {
      fetchFoodDeliveryOrderDetails();
    } else if ([3, 4, 5].includes(orderType)) {
      fetchOrderDetails();
    }
  }, [orderType, orderId, apiOrderId]);
  

  const fetchOrderDetailsMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        BASE_URL + ORDER_DETAILS_ENDPOINT + "/v1/" + apiOrderId
      );
      const responseData = await response.json();
      setOrderDetail(responseData.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchDecorationOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        BASE_URL + GET_DECORATION_DETAILS + "/" + orderId
      );
      const responseData = await response.json();

      setOrderDetail(responseData?.data);
      setDecorationItems(responseData?.data?.items[0]?.decoration);
      setDecorationComments(responseData?.data?.decoration_comments);
      setAddOn(responseData?.data?.add_on);
      setLoading(false);
    } catch (error) {
      console.log("fetchDecorationOrderDetails error", error);
      setLoading(false);
    }
  };

  

  const  fetchFoodDeliveryOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        BASE_URL + GET_FOOD_DELIVERY_DETAILS + "/" + orderId
      );
      const responseData = await response.json();

      console.log(responseData)
      //console.log(BASE_URL + GET_FOOD_DELIVERY_DETAILS + "/" + orderId)
      setOrderDetail(responseData?.data);
      setHospitalityServiceCount(responseData?.data?.no_of_people);
      setHospitalityServiceTotalAmount(responseData?.data?.total_amount);
      setLoading(false);
    } catch (error) {
      console.log("fetchDecorationOrderDetails error", error);
      setLoading(false);
    }
  };
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        BASE_URL + ORDER_DETAILS_ENDPOINT + "/v1/" + apiOrderId
      );
      const responseData = await response.json();

      setOrderDetail(responseData?.data);
      setHospitalityServiceCount(responseData?.data?.no_of_people);
      setHospitalityServiceTotalAmount(responseData?.data?.total_amount);
      setLoading(false);
    } catch (error) {
      console.log("fetchOrderDetails error", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <center>
        <div className="custom-spinner">
          <div>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ color: "#9252AA", textAlign: "center" }}>
              <h4>Data is loading...</h4>
            </div>
          </div>
        </div>
      </center>
    );
  }


  return (
    <>
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

export default OrderDetail;
