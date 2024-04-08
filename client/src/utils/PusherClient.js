import PusherClient from "pusher-js";
import {
  NEXT_PUBLIC_PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
} from "@/utils/ApiRoutes";

export const pusherClient = new PusherClient(NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: PUSHER_APP_CLUSTER,
});
