import {io} from "socket.io-client";
import { HOST as SOCKET_HOST } from "./ApiRoutes";

class SocketClient {
  static socketInstance = null;
  
  //making it singleton
  constructor() {
    if (!SocketClient.socketInstance) {
      this.connect();
      SocketClient.socketInstance = this;
    }

    return SocketClient.socketInstance;
  }

    connect() {
      this.socketInstance = io.connect(SOCKET_HOST, { transports: ['websocket']});
      // console.log("this.socket",this.socket);
      return new Promise((resolve, reject) => {
        this.socketInstance.on('connect', () => resolve());
        this.socketInstance.on('connect_error', (error) => reject(error));
      });
    }
  
    disconnect() {
      return new Promise((resolve) => {
        this.socketInstance.disconnect(() => {
          this.socketInstance = null;
          resolve();
        });
      });
    }
  
    emit(event, data) {
      console.log("event, data", event, data)
      return new Promise((resolve, reject) => {
        if (!this.socketInstance) return reject('No socket connection.');
        
        return this.socketInstance.emit(event, data, (response) => {
          // Response is the optional callback that you can use with socket.io in every request. See 1 above.
          console.log("event, data, response",event, data, response)
          if (response.error) {
            console.error(response.error);
            return reject(response.error);
          }
  
          return resolve();
        });
      });
    }
  
    on(event, fun) {
      // No promise is needed here, but we're expecting one in the middleware.
      return new Promise((resolve, reject) => {
        if (!this.socketInstance) return reject('No socket connection.');
        console.log('event recieved ', event);
        this.socketInstance.on(event, fun);
        return resolve();
      });
    }
  }
  
  export default SocketClient;
