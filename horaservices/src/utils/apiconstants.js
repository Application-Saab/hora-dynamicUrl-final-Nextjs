export const BASE_URL = "http://localhost:5000";
export const MEDIA_WORKER_URL = "http://localhost:4000";
export const FACE_FINDER_URL = "https://horaservices.com/face-api";
export const BG_REMOVER_URL = "https://horaservices.com/bg-remove/remove-bg";
export const OTP_GENERATE_END_POINT = "/api/user/otp_generate";
export const API_SUCCESS_CODE = 200;
export const COMPRESSED_WEBP_IMG_URL =
  "https://horaservices.com/api/uploads/compressed_webp/";
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
export const GET_PHOTOGRAPHY_BY_TAG = "/api/photography/searchByTag/"

export const IMAGE_UPLOAD = "/api/image_upload";
export const ADD_RATING_REVIEWS = "/api/order/add-rating-reviews";
// Wonderland API Endpoints
export const CREATE_EVENT_INVITE = "/api/customer/event/create-event-invite";
export const GET_EVENT_BY_ID = "/api/customer/event/event-invites";
export const UPDATE_EVENT_BY_ID = "/api/customer/event/event-invites";
export const GET_GUESTS_BY_EVENTID = "/api/customer/event/event-guests/all";
export const CREATE_GUEST_BY_EVENTID = "/api/customer/event/event-guest";
export const UPDATE_RSVP_STATUS = "/api/customer/event/event-guest";
export const GET_ALL_TEMPLATES = "/api/photo/templates";
export const GET_TEMPLATES_BY_ID = "/api/photo/templates";
export const EVENT_POST_LIKE_UNLIKE = '/api/customer/event';
export const LIKED_POST_BY_EVENT_AND_USERID = "/api/customer/event/liked-posts"
export const GENERATE_SHARE_CODE = '/smartinvite/share/generate-share-code'

export const GET_EVENT_IMAGES = "/api/customer/event/event-images";
export const UPLOAD_IMAGES_SELF = "/api/customer/event/event-images";
export const UPLOAD_THANKYOU_NOTE = "/api/customer/event/event-images";
export const CREATE_NEW_POST = "/api/customer/event/event-posts";
export const GET_ALL_POSTS = "/api/customer/event/event-posts";
export const GET_PRESIGNED_POST_URL = "/api/customer/event/get-presigned-url";
export const CREATE_EVENT_SUBFOLDER = "/api/customer/event/create-event-subfolder";
export const ASSIGN_TO_EVENT_SUBFOLDER = "/api/customer/event/assign-to-subfolder";
export const DELETE_EVENT_POST = "/api/customer/event/delete-post";
export const GET_GUEST_DETTAILS = "/api/customer/event/event-guest";
export const GET_ALL_EVENTS_BY_USERID = "/api/customer/event/event-invites/all";
export const GET_USER_BY_ID = "/api/user/user-details";
export const GET_USER_BY_PHONE = "/api/user/user-details-by-phone";
export const UPDATE_USER_BY_ID = "/api/user/user-details";
export const UPDATE_USER_AVATAR_BY_ID = "/api/user/user-avatar";
// Chat Routes

export const GET_CHAT_ROOMS = "/api/customer/event/chat/chatrooms/user";
export const GET_CHAT_MESSAGES = "/api/customer/event/chat/messages";
export const MARK_READ_MESSAGE = "/api/customer/event/chat/mark-read";
export const CREATE_DIRECT_CHAT_ROOM = "/api/customer/event/chat/create-direct-room";
export const SUBSCRIBE_NOTIFICATION = "/api/customer/event/chat/subscribe";
export const UNSUBSCRIBE_NOTIFICATION = "/api/customer/event/chat/unsubscribe";
export const UNREAD_MESSAGE_COUNT = "/api/customer/event/chat/chatrooms";
export const GET_PHOTOGRAPHY_ORDER_DETAILS = "/api/order/order_details_photography";

