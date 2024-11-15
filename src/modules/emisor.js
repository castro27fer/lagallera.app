import client from './client';
import RTCConnectionClient from './RTCConnection'
import axios from 'axios';

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
  }

class emisor extends client{
  
    constructor(){
      super();
      this.clients = [];
      this.mediaStream = null;
      // this.loadSocket();
        this.state = "NEW";

      this.initialStream();
  
    }
  
    initialStream = async() =>{
  
      this.state = "SendRequest";
      const response = await axios.post(`${this.HOST_SIGNAL}/api/stream`,{socketId:this.socket.id});
      const { offerConnections, myRoom } = response.data;
      this.listeningOffersOfConnections(offerConnections);
      this.listeningMyRoom(myRoom);

      this.state = "streamStart";
  
    }
  
    listeningOffersOfConnections = (offersOfConnections)=>{
      this.socket.on(offersOfConnections,(connection)=>this.aceptOffer(connection));
    }
  
    aceptOffer = async(roomOfConnection) =>{
  
      const newClient = new RTCConnectionClient(this.socket,roomOfConnection);
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