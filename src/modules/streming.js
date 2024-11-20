import { io } from 'socket.io-client'

const STATE = {
    CREATED : "Created",
    CREATING_THE_STREAMING : "creating_the_streaming",
    ON_STREAMING: "onStreaming",
    END_STREAMING: "endStreaming",
    CONNECTIONG_WITH_THE_STREAMING : "connecting_with_the_streaming"
}
  
const EVENT_SOCKET = {
    CREATE_STREAMING : "create_streaming",
    CHAT_ROOM :"chat_room",
    SEND_OFFER_OF_CONNECTION : "send_offer_of_connection",
    OFFERS_OF_CONNECTION : "offers_of_connection",
    ANSWER_OF_CONNECTION : "answer_of_connection"
}

const OPTIONS = {
    OFFER     : "offer",
    ANSWER    : "answer",
    CANDIDATE : "candidate",
    FINISH    : "finish"
};

const CONFIG_CONNECTION_DEFAULT = {
    iceServers: [
        { 
            urls: [
            `stun:stun.l.google.com:19302`
            ]
        }
    ],
    iceTransportPolicy:"all"
};

const OFFER_OPTIONS = { 
    iceRestart:true,
    offerToReceiveAudio: 0, 
    offerToReceiveVideo: 1 
};

export class RTCConnectionClient extends RTCPeerConnection{

    ICECandidates = [];

    constructor(props){
        super(props);
    }

    loadCandidates = async()=>{
        for(let i = 0; i< this.ICECandidates.length;i++){
          await this.addIceCandidate(this.ICECandidates[i]);
        }
    }
    
    onicecandidate = (event) => {
        if(event.candidate){
           this.ICECandidates.push(event.candidate);
        }
    }

}

export class client {

    constructor(){
      this.HOST_SIGNAL = process.env.REACT_APP_URL_API;
      this.HOST_STUN = process.env.REACT_SERVER_STUN;
      this.HOST_STURN = process.env.REACT_SERVER_STURN
      this.socket = io(this.HOST_SIGNAL);
      this.state = STATE.CREATED;
      this.ICECandidates = [];
    }
  
    sendMessage = (message) => {
      this.socket.emit(EVENT_SOCKET.CHAT_ROOM,{ message });
    };
  
    onListeningTheChatRoom = (callback)=>{
      this.socket.on("message", params => callback(params));
    }

}

export class receptor extends client{

    ICECandidates = [];

    constructor(streamingId){
      super();

      this.state = STATE.CREATED;
      this.streamingId = streamingId;

      this.connectionInitialClient();
    }
  
    connectionInitialClient = async() =>{
      
        this.state = STATE.CONNECTIONG_WITH_THE_STREAMING;

        this.peerConnection = new RTCConnectionClient(CONFIG_CONNECTION_DEFAULT);
        const offer = await this.peerConnection.createOffer(OFFER_OPTIONS);
        await this.peerConnection.setLocalDescription(offer);
        await this.peerConnection.loadCandidates();

        this.socket.emit(EVENT_SOCKET.SEND_OFFER_OF_CONNECTION,{ 
            desc : this.peerConnection.localDescription, 
            streamingId : this.streamingId 
        });
    }

    listeningAnswer = async()=>{
        this.socket.on(EVENT_SOCKET.RESPONDING_TO_CLIENT,(params) => this.receiveAnswer(params))
    }

    receiveAnswer = async(params) =>{
        await this.peerConnection.setRemoteDescription(params.desc); 
    }
  
}

export class emisor extends client{
  
    constructor(){
      super();
      this.clients = [];
      this.mediaStream = null;
        
    //   this.listeningCreateStreaming();
      this.listeningOffersOfConnections();
  
    }
  
    createStreaming = async() =>{
  
      this.state = STATE.CREATING_THE_STREAMING;
    
      const params = {
        title:"title of streming",
        description:"the description the of streming...."
      }
      this.socket.emit(EVENT_SOCKET.CREATE_STREAMING,params);

    }

    // listeningCreateStreaming = ()=>{
    //     this.socket.on(EVENT_SOCKET.CREATE_STREAMING,params =>{
    //         console.log(params.roomId)
    //     });
    // }
  
    listeningOffersOfConnections = ()=>{
      this.socket.on(EVENT_SOCKET.OFFERS_OF_CONNECTION,(params)=> this.aceptOffer(params));
    }

    aceptOffer = async(params) =>{
  
        const newClient = new RTCConnectionClient(CONFIG_CONNECTION_DEFAULT);
      
        await newClient.setRemoteDescription(params.desc);
        const answer = await newClient.createAnswer();
        await newClient.setLocalDescription(answer);

        newClient.onconnectionstatechange =(event) =>{
            console.log(newClient.connectionState);
        }

        await newClient.loadCandidates();

        this.socket.emit(EVENT_SOCKET.ANSWER_OF_CONNECTION,{ 
            desc : newClient.localDescription, 
            socketId : params.socketId 
        });

        this.clients.push(newClient);
    }
  
    connectWithMediaStream = async () => {
        this.mediaStream = await navigator.mediaDevices.getDisplayMedia(MEDIA_STREAM_CONFIG);
        this.startStream = "mediaStreamingConnected ";
    }
  
    startStream = async()=> {
        this.clients.forEach(client => {
            this.mediaStream.getTracks().forEach(track => {
                client.addTrack(track, this.mediaStream);
            });
        });

        this.state = STATE.ON_STREAMING;
    }
  
    closeStream = async()=> {
        this.client.forEach(client => client.close());
        this.state = STATE.END_STREAMING;
    }

    onState = (callback) =>{
        callback(this.state);
    }
  
}