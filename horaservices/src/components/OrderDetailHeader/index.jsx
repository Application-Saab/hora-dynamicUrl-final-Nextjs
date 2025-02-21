import React from "react";
import { CiCalendar } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { MdPeopleAlt } from "react-icons/md";


const OrderDetailHeader = ({ orderDetail }) => {
  const getOrderId = (e) => {
    const orderId1 = 10800 + e;
    const updateOrderId = "#" + orderId1;
    localStorage.setItem("orderId", updateOrderId);
    return updateOrderId;
  };
  const getOrderStatus = (orderStatusValue) => {
    if (orderStatusValue === 0) {
      return { status: "Booked", className: "status-booked-detail" };
    }
    if (orderStatusValue == 1) {
      return { status: "Accepted", className: "status-accepted-detail" };
    }
    if (orderStatusValue === 2) {
      return { status: "In-progress", className: "status-in-progress--detail" };
    }
    if (orderStatusValue === 3) {
      return { status: "Completed", className: "status-completed-detail" };
    }
    if (orderStatusValue === 4) {
      return { status: "Cancelled", className: "status-cancelled-detail" };
    }
    if (orderStatusValue === 5) {
      return { status: "", className: "status-empty-detail" };
    }
    if (orderStatusValue === 6) {
      return { status: "Expired", className: "status-expired-detail" };
    }
  };

  const orderStatus = getOrderStatus(orderDetail?.order_status);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="order-header">
      <div className="order-header-left">
        <h5 className="order-id-h">
          Order Id: {getOrderId(orderDetail?.order_id)}
        </h5>
        <p className="order-status-button">{orderStatus?.status}</p>
      </div>
      <div className="order-header-right">
        <div className="order-info-div">
          <CiCalendar className="header-icons" size={20}  style={{marginLeft: "25px"}}/>
          <p>{formatDate(orderDetail?.order_date)}</p>
        </div>
        <div className="order-info-div">
          <GoClock className="header-icons" size={20} style={{marginLeft: "15px"}} />
          <p>{orderDetail?.order_time}</p>
        </div>
        {orderDetail.type !== 8 && 
        <div className="order-info-div">
          <MdPeopleAlt className="header-icons" size={20} style={{marginLeft: "15px"}} />
          <p>{orderDetail?.no_of_people} People</p>
        </div>}
      </div>
    </div>
  );
};

export default OrderDetailHeader;
