import { io } from 'socket.io-client'
import { get_token } from './auth'
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
    SEND_ANSWER_OF_CONNECTION : "send_answer_of_connection",
    ANSWER_OF_CONNECTION : "answer_of_connection",
    SEND_CANDIDATES_OF_CONNECTION : "send_candidates_of_connection",
    CANDIDATES_OF_CONNECTION : "candidates_of_connection",
}

// const OPTIONS = {
//     OFFER     : "offer",
//     ANSWER    : "answer",
//     CANDIDATE : "candidate",
//     FINISH    : "finish"
// };

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

export class RTCConnectionClient extends RTCPeerConnection{

    ICECandidates = [];

    constructor(props,socketId,callback){
        super(props);

        this.socketId = socketId;

        callback();
    }

    loadCandidates = async()=>{
        for(let i = 0; i< this.ICECandidates.length;i++){
          await this.addIceCandidate(this.ICECandidates[i]);
        }
    }

}

export class Client {

    HOST_SIGNAL = process.env.REACT_APP_URL_SOCKET;
    HOST_STUN = process.env.REACT_APP_SERVER_STUN;
    HOST_STURN = process.env.REACT_APP_SERVER_STURN

    id = null;
    state = "New";
    socket = null;
    ICECandidates = [];
    streamingId = null

    constructor({streamingId}){
       
      this.socket = io(this.HOST_SIGNAL, {
        query: { token: get_token() },
        path: '/socket.io',
      });
      
      this.state = STATE.CREATED;
      this.streamingId = streamingId;

      this.eventoSocket();
    }

    eventoSocket = () => {

        this.socket.on("connect",this.onConnect);

        this.socket.on("disconnect", (reason, details) => {
            console.log("disconnect......")
        });


        this.socket.on("connect_error", (error) => {
            if (this.socket.active) {
              // temporary failure, the socket will automatically try to reconnect
            } else {
              // the connection was denied by the server
              // in that case, `socket.connect()` must be manually called in order to reconnect
              console.log(error.message);
            }

            console.log(error);
        });

        this.socket.on("ping", () => {
            console.log("socket event ping")
        });


        this.socket.on("error", (error) => {
            console.log("socket event error")
        });

        this.socket.on("reconnect", (attempt) => {
            console.log("socket event reconnect")
        });

        this.socket.on("reconnect_attempt", (attempt) => {
            console.log("socket event reconnect_attempt")
        });

        this.socket.on("reconnect_error", (attempt) => {
            console.log("socket event reconnect_error")
        });

        this.socket.on("reconnect_failed", (attempt) => {
            console.log("socket event reconnect_error")
        });
        
    }

    onConnect = (props)=> {

        console.log("on connect...",props)
        
    };

    sendMessage = (message) => {
      this.socket.emit(EVENT_SOCKET.CHAT_ROOM,{ message });
    };
  
    onListeningTheChatRoom = (callback)=>{
      this.socket.on("message", params => callback(params));
    }

}

export class Receptor extends Client{

    ICECandidates = [];

    constructor(props){

      super(props);

      this.state = STATE.CREATED;

      this.connectionInitialClient();
    }
  
    connectionInitialClient = async() =>{
      
        this.state = STATE.CONNECTIONG_WITH_THE_STREAMING;

        this.peerConnection = new RTCPeerConnection(CONFIG_CONNECTION_DEFAULT);

        this.peerConnection.onconnectionstatechange =(event) =>{
            console.log(this.peerConnection.connectionState);
        }

        this.peerConnection.ontrack = (event)=>{
            // console.log("on tranck");
            this.onTrack(event);
        }

        this.peerConnection.onicecandidate = this.onicecandidate;

        this.listeningAnswer();
        this.listeningICECandidates();

        const offer = await this.peerConnection.createOffer(OFFER_OPTIONS);
        await this.peerConnection.setLocalDescription(offer);

        this.socket.emit(EVENT_SOCKET.SEND_OFFER_OF_CONNECTION,{ 
            desc : this.peerConnection.localDescription, 
            streamingId : this.streamingId 
        });

        console.log("Send offer of connection....");
    }

    listeningAnswer = async()=>{
        this.socket.on(EVENT_SOCKET.ANSWER_OF_CONNECTION,(params) =>{
            this.receiveAnswer(params)
            console.log("receive Answer....")
        })
    }

    listeningICECandidates = () =>{
        this.socket.on(EVENT_SOCKET.CANDIDATES_OF_CONNECTION,(params)=>{
            this.ICECandidates.push(params.candidate);
            console.log("receive candidates")
        });
    }

    receiveAnswer = async(params) =>{
        await this.peerConnection.setRemoteDescription(params.desc); 
        await this.loadCandidates();
    }

    loadCandidates = async()=>{
        
        for(let i = 0; i< this.ICECandidates.length;i++){
          await this.peerConnection.addIceCandidate(this.ICECandidates[i]);
        }
    }
    
    onicecandidate = (event) => {
        if(event.candidate){

           this.socket.emit(EVENT_SOCKET.SEND_CANDIDATES_OF_CONNECTION,{ 
                candidate   :   event.candidate,
                socketId    :   this.socket.id,
                streamingId :   this.streamingId 
            });
     
        }
    }

    onTrack = (event) => event
}

export class Emisor extends Client{
  
    clients = [];
    mediaStream = null;

    constructor(props){
        super(props);
    }

    createStreaming(params){
  
      this.state = STATE.CREATING_THE_STREAMING;

      this.listeningOffersOfConnections();
      this.socket.emit(EVENT_SOCKET.CREATE_STREAMING,params);

    }
  
    listeningOffersOfConnections = ()=>{
        
        this.socket.on(EVENT_SOCKET.OFFERS_OF_CONNECTION,(params)=> {
            this.aceptOffer(params)
            // console.log("an offer of connetion");
        });
    }

    aceptOffer = async(params) =>{
  
        const newClient = new RTCConnectionClient(CONFIG_CONNECTION_DEFAULT,this.streamingId,()=>{
           
            this.socket.on(EVENT_SOCKET.CANDIDATES_OF_CONNECTION,(params)=>{
                newClient.ICECandidates.push(params.candidate);
                // console.log("received candidates...")
            });
        });

        newClient.onicecandidate = (event)=>{
            if(event.candidate){
                this.socket.emit(EVENT_SOCKET.SEND_CANDIDATES_OF_CONNECTION,{ candidate : event.candidate, socketId : params.socketId, streamingId : this.streamingId });
                // console.log("send candidates...")
             }
        }

        newClient.onconnectionstatechange =(event) =>{

            if(newClient.connectionState === "connected"){
                this.onConnectClient();
            }
            else if(newClient.connectionState === "disconnected"){
                this.onDisconnectClient();
            }
            else if(newClient.connectionState === "failed"){
                this.onFailed();
            }
            
        }

        this.mediaStream.getTracks().forEach(track => {
            // console.log("add track",track,this.mediaStream)
            newClient.addTrack(track, this.mediaStream);
        });

        const videoTracks = this.mediaStream.getVideoTracks();
        const audioTracks = this.mediaStream.getAudioTracks();

        if (videoTracks.length > 0) {
            console.log(`Using video device: ${videoTracks[0].label}`);
        }
        if (audioTracks.length > 0) {
            console.log(`Using audio device: ${audioTracks[0].label}`);
        }

        await newClient.setRemoteDescription(params.desc);
        const answer = await newClient.createAnswer();
        await newClient.setLocalDescription(answer);

        await newClient.loadCandidates();
        
        this.socket.emit(EVENT_SOCKET.SEND_ANSWER_OF_CONNECTION,{ 
            desc        : newClient.localDescription, 
            socketId    : params.socketId, // esta malo es el id del cliente
            streamingId : this.streamingId 
        });

        this.clients.push(newClient);
    }
  
    
    connectWithMediaStream = async (videoRef) => {
        
        this.startStream = "mediaStreamingConnected ";

        this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width:{  ideal: 1280, max:1920, },
              height:{ ideal:600, max:1080, },
              frameRate:{ ideal:60,max:70, },
            },
            audio: false,
        });

        videoRef.srcObject = this.mediaStream;
    }
  
    startStreaming = async()=> {
        this.clients.forEach(client => {
            this.mediaStream.getTracks().forEach(track => {
                client.addTrack(track, this.mediaStream);
            });
        });

        this.state = STATE.ON_STREAMING;
    }
  
    closeStreaming = async()=> {
        this.client.forEach(client => client.close());
        this.state = STATE.END_STREAMING;
    }

    onState = (callback) =>{
        callback(this.state);
    }

    onConnectClient = (client) =>{}

    onDisconnectClient = (client) =>{}

    onFailed = ()=>{}
  
}