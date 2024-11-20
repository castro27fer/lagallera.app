import client from './client';
import RTCConnectionClient from './RTCConnection'

export const MEDIA_STREAM_CONFIG = {
    video: {
      width:{
        // min: 1024, //not soport
        ideal: 1280,
        max:1920,
      },
      height:{
        // min:576, //not soport
        ideal:600,
        max:1080,
      },
      frameRate:{
        ideal:60,max:70,
      },
    },
    audio: false,
};

const STATE = {
  CREATED : "Created",
  CREATING_THE_STREAMING : "creating_the_streaming"
}

const EVENT_SOCKET = {
  CREATE_STREMING : "create_streming",
  CHAT_ROOM :"chat_room"
}

class emisor extends client{
  
    constructor(){
      super();
      this.clients = [];
      this.mediaStream = null;
      // this.loadSocket();
        this.state = STATE.CREATED;

      this.listeningOffersOfConnections();
  
    }
  
    createStreaming = async() =>{
  
      this.state = STATE.CREATING_THE_STREAMING;
    
      const params = {
        title:"title of streming",
        description:"the description the of streming...."
      }
      this.socket.emit(EVENT_SOCKET.CREATE_STREMING,params);


    }
  
    listeningOffersOfConnections = ()=>{

      this.socket.on("OffersOfConnection",(desc)=> this.aceptOffer(desc));
    }

    // listeningTheChatRoom = () =>{
    //   this.socket.on(EVENT_SOCKET.CHAT_ROOM,(params =>{
    //     console.log(params.message);
    //   }))
    // }
    
  
    aceptOffer = async(desc) =>{
  
      const newClient = new RTCConnectionClient(this.socket);
      newClient.establishConnection(desc);
      newClient.onconnectionstatechange =(event) =>{
        console.log(newClient.connectionState);
      }
      this.clients.push(newClient);
    }
  
    connectWithMediaStream = async () => {
        this.mediaStream = await navigator.mediaDevices.getDisplayMedia(MEDIA_STREAM_CONFIG);
        this.startStream = "mediaStreamingConnected ";
    }
  
    startStream = async()=> {
        this.clients.forEach(client => client.addMediaStream(this.mediaStream));
        this.state = "onStreaming";
    }
  
    closeStream = async()=> {
        this.client.forEach(client => client.close());
        this.state = "endStreaming";
    }

    onState = (callback) =>{
        callback(this.state);
    }
  
  }

export default emisor;