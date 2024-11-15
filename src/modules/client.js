import { io } from 'socket.io-client'

class client {

    constructor(){
      this.HOST_SIGNAL = process.env.REACT_APP_URL_API;
      this.HOST_STUN = process.env.REACT_SERVER_STUN;
      this.HOST_STURN = process.env.REACT_SERVER_STURN
      this.socket = io(this.HOST_SIGNAL);
    }
  
    sendMessage = (message) => {
      this.socket.emit(this.roomChatStream,message);
    };
  
    listeningTheChatRoom = (callback)=>{
      this.socket.on(this.roomChatStream,params => callback(params));
    }

  }

  export default client;