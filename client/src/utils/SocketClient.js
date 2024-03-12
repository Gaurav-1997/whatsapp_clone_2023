import {io} from "socket.io-client";
import { HOST as SOCKET_HOST } from "./ApiRoutes";

// class SocketClient {
//   static socketInstance = null;
  
//   //making it singleton
//   constructor() {
//     if (!SocketClient.socketInstance) {
//       this.connect();
//       SocketClient.socketInstance = this;
//     }

//     return SocketClient.socketInstance;
//   }

//     connect() {
//       this.socketInstance = io.connect(SOCKET_HOST, { transports: ['websocket'] });
//       // console.log("this.socket",this.socket);
//       return new Promise((resolve, reject) => {
//         this.socketInstance.on('connect', () => resolve());
//         this.socketInstance.on('connect_error', (error) => reject(error));
//       });
//     }
  
//     disconnect() {
//       return new Promise((resolve) => {
//         this.socketInstance.disconnect(() => {
//           this.socketInstance = null;
//           resolve();
//         });
//       });
//     }
  
//     emit(event, data) {
//       console.log("event, data, response", event, data)
//       return new Promise((resolve, reject) => {
//         if (!this.socketInstance) return reject('No socket connection.');
        
//         return this.socketInstance.emit(event, data, (response) => {
//           // Response is the optional callback that you can use with socket.io in every request. See 1 above.
//           console.log("event, data, response",event, data, response)
//           if (response.error) {
//             console.error(response.error);
//             return reject(response.error);
//           }
  
//           return resolve();
//         });
//       });
//     }
  
//     on(event, fun) {
//       // No promise is needed here, but we're expecting one in the middleware.
//       return new Promise((resolve, reject) => {
//         if (!this.socketInstance) return reject('No socket connection.');
        
//         this.socketInstance.on(event, fun);
//         return resolve();
//       });
//     }
//   }
  
//   export default SocketClient;

// import { io } from "socket.io-client";
// import { HOST as SOCKET_HOST } from "./ApiRoutes";

class SocketClient {
  socket = null;
  connectionPromise = null;  // Track connection promise for cleaner handling

  constructor() {
    // Defer connection establishment until `connect` is called
  }

  connect() {
    if (this.connectionPromise) {
      // Connection already in progress, return existing promise
      return this.connectionPromise;
    }

    this.socket = io.connect(SOCKET_HOST, { transports: ["websocket"] });

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log("Socket connected.");
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (!this.socket) {
      console.warn("Socket not connected, cannot disconnect.");
      return Promise.resolve(); // Resolve successfully even if not connected
    }

    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        this.connectionPromise = null; // Reset connection promise for future attempts
        console.log("Socket disconnected.");
        resolve();
      });
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        return reject('No socket connection.');
      }

      return this.socket.emit(event, data, (response) => {
        if (response.error) {
          console.error(response.error);
          return reject(response.error);
        }

        return resolve();
      });
    });
  }

  on(event, callback) {
    if (!this.socket) {
      return Promise.reject('No socket connection.'); // Retain consistent error handling
    }

    this.socket.on(event, callback);
    return Promise.resolve(); // Consistent resolution even if no promise required
  }
}

export default SocketClient;
