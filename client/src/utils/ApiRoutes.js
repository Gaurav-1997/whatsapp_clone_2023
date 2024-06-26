export const HOST = "http://localhost:6001";

export const NEXT_PUBLIC_PUSHER_APP_KEY = "e5033ce5e24be975923f"
export const PUSHER_APP_CLUSTER = "ap2"

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onBoardUser-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
export const USER_STATUS_ROUTE = `${AUTH_ROUTE}/get-user-status`;
export const FRIEND_REQUEST_ROUTE = `${AUTH_ROUTE}/friend-request`;
export const USER_DECISION_REQUEST_ROUTE = `${AUTH_ROUTE}/user-decision-request`;
export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-messages`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
