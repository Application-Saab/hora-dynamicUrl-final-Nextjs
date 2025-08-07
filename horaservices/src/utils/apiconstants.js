export const BASE_URL = "https://horaservices.com:3000";
export const OTP_GENERATE_END_POINT = "/api/user/otp_generate";
export const API_SUCCESS_CODE = 200;
export const GET_USER_DETAIL_ENDPOINT = "/api/users/user_details";
export const UPDATE_USER_DETAIL_ENDPOINT = "/api/users/user_update";
export const UPDATE_ORDER_STATUS = "/api/order/update_order_status";
export const GET_ORDER_HISTORY_ENDPOINT = "/api/order/user_order_list";
export const GET_CUISINE_ENDPOINT =
  "/api/configuration/admin_configuration_list";
export const GET_MEAL_DISH_ENDPOINT = "/api/user/getMealDish";
export const GET_ADDRESS_LIST = "/api/users/address/address_list";
export const SAVE_LOCATION_ENDPOINT = "/api/users/address/editByUserID";
export const CONFIRM_ORDER_ENDPOINT = "/api/order/add";
export const OTP_VERIFY_ENDPOINT = "/api/user/otp_verify";
export const USER_DETAILS_ENDPOINT = "/api/setting/details";
export const USER_MYACCOUNT_ENDPOINT = "/api/users/my_account";
export const ORDERLIST_ENDPOINT = "/api/order/user_order_list";
export const ORDER_DETAILS_ENDPOINT = "/api/order/order_details";
export const ORDER_CANCEL = "/api/order/cancelOrder";
export const ORDER_INGREDIENTS = "/api/order/getIngredientByOrder";
export const PAYMENT = "/api/payment_gateway/payment";
export const PAYMENT_STATUS = "/api/payment_gateway/status";
export const GET_DECORATION_CAT_ID = "/api/meals/idByTag?tag=";
export const GET_DECORATION_CAT_ITEM = "/api/Decoration/searchByTag/";
export const GET_DECORATION_DETAILS = "/api/order/order_details_decoration";
export const GET_DECORATION_BY_NAME = "/api/Decoration/searchByName/";
export const GET_FOOD_DELIVERY_DETAILS =
  "/api/order/order_details_food_delivery";
export const GET_PHOTOGRAPHY_BY_NAME =
  "/api/photography/searchByTag/66c96b4e22ed47b72117e09a";
export const IMAGE_UPLOAD = "/api/image_upload";

// Wonderland API Endpoints
export const GET_GUESTS_BY_EVENTID = "/api/customer/event/event-guests/all";
export const CREATE_GUEST_BY_EVENTID = "/api/customer/event/event-guest";
export const UPDATE_RSVP_STATUS = "/api/customer/event/event-guest";
export const GET_ALL_TEMPLATES = "/api/photo/templates";
export const GET_EVENT_IMAGES = '/api/customer/event/event-images'