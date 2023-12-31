export const HOST = "http://localhost:6001";

const AUTH_ROUTE = `${HOST}/api/auth`;
const MESSAGES_ROUTE = `${HOST}/api/messages`;

export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onBoardUser-user`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
export const ADD_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/add-messages`;
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
