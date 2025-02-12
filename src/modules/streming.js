
import { get_token } from './auth'
import SOCKET from './socket';
import {RTCConnectionClient, RTCPeerConnectionReceptor } from './webRTC';

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

export class Client {

    HOST_SIGNAL = process.env.REACT_APP_URL_SOCKET;
    HOST_STUN = process.env.REACT_APP_SERVER_STUN;
    HOST_STURN = process.env.REACT_APP_SERVER_STURN

    state = "New";
    
    socket = null;
    ICECandidates = [];
    streamingId = null;
    certificate = null;

    constructor({streamingId, certificate}){
    
        this.socket = new SOCKET({
            host: this.HOST_SIGNAL,
            token: get_token()
        });

      this.state = STATE.CREATED;
      this.streamingId = streamingId;
      this.certificate = certificate;

    }


    /**
     * Enviar mensaje al chat
     * @param {string} message mensaje a enviar
     */
    sendMessage = (message) => {
      this.socket.emit(EVENT_SOCKET.CHAT_ROOM,{ message });
    };
  
    /**
     * Escuchando los mensajes del chat
     * @param {function} callback function callback para escuchar los mensajes
     */
    onListeningTheChatRoom = (callback)=>{
      this.socket.on("message", params => callback(params));
    }

    /**
     * Envia los canditados al servidor de señalización para que los reciba el receptor
     * @param {peerConnection} peerConnection representa la conexión con un receptor
     * @param {string} socketId Es el id del receptor
     */
    send_candidates = (peerConnection,socketId) =>{
        
        const send_candidate = (candidate,socketId)=>{

            this.socket.emit(EVENT_SOCKET.SEND_CANDIDATES_OF_CONNECTION,{ 
                candidate : candidate, 
                socketId : socketId, 
            });

        }

        //send all candidates saved...
        peerConnection.ICECandidates.forEach((candidate)=>send_candidate(candidate,socketId));

        //rewrite onicecandidate....
        peerConnection.onicecandidate = (event)=>{
            if(event.candidate){
                this.socket.emit(EVENT_SOCKET.SEND_CANDIDATES_OF_CONNECTION,{ 
                    candidate : event.candidate, 
                    socketId : socketId, 
                });
            }
        }
    }
}

/**
 * Client que se conecta al streaming
 */
export class Receptor extends Client{


    constructor(props){

      super(props);

      this.state = STATE.CREATED;

      this.connectionInitialClient();
    }
  
    /**
     * Conecta al cliente al streaming aun no se ha aceptado la oferta por parte del streaming
     */
    connectionInitialClient = async() =>{
      
        this.state = STATE.CONNECTIONG_WITH_THE_STREAMING;

        this.listeningAnswer();
        this.listeningICECandidates();

        this.peerConnection = new RTCPeerConnectionReceptor({
            config_conection:CONFIG_CONNECTION_DEFAULT,
            certificate : this.certificate
        });

        


        this.peerConnection.onconnectionstatechange = this.onConnectionStateChange;
        this.peerConnection.ontrack = (event) => this.onTrack(event);

        const desc = await this.peerConnection.offer();
    
        this.socket.emit(EVENT_SOCKET.SEND_OFFER_OF_CONNECTION,{ 
            desc : desc, 
            streamingId : this.streamingId 
        });

        this.send_candidates(this.peerConnection);
        
        // console.log("Send offer of connection....");
    }

    onConnectionStateChange = (event) =>{
        // console.log(this.peerConnection.connectionState);
    }

    /**
     * Escucha la respuesta a la oferta de conexión, enviada por el streaming
     */
    listeningAnswer = async()=>{
        this.socket.on(EVENT_SOCKET.ANSWER_OF_CONNECTION,(params) =>{
            this.receiveAnswer(params)
            // console.log("receive Answer....")
        })
    }

    /**
     * Escucha las ofertas de candidatos enviado por el streaming
     */
    listeningICECandidates = () =>{
        this.socket.on(EVENT_SOCKET.CANDIDATES_OF_CONNECTION,(params)=>{
            this.ICECandidates.push(params.candidate);
            // console.log("receive candidates")
        });
    }

    /**
     * Recibe la respuesta del streaming a la oferta de conexión enviada
     * @param {object} params respuesta del streaming
     */
    receiveAnswer = async(params) =>{
        await this.peerConnection.setRemoteDescription(params.desc); 
        await this.loadCandidates();
    }

    /**
     * Carga los canditados enviados por el streaming
     */
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
      this.listeningCandidatesConnect();
      this.socket.emit(EVENT_SOCKET.CREATE_STREAMING,params);

    }
  
    listeningCandidatesConnect = () =>{

        this.socket.on(EVENT_SOCKET.CANDIDATES_OF_CONNECTION,(params)=>{

            const clientAUX = this.clients.find(x => x.socketId === params.socketId);

            if(!clientAUX){
                console.error("client not found",clientAUX); return;
            }

            if(params.candidate){
                clientAUX.ICECandidates.push(params.candidate);
                // console.log("received candidates...")
            }
            
        });
    }

    listeningOffersOfConnections = ()=>{
        
        this.socket.on(EVENT_SOCKET.OFFERS_OF_CONNECTION,(params)=> {
            this.aceptOffer(params)
            // console.log("an offer of connetion");
        });
    }

   
    aceptOffer = async(params) =>{
  
        const newClient = new RTCConnectionClient({ 

            keygenAlgorithm : CONFIG_CONNECTION_DEFAULT,
            certificate : this.certificate 

        },params.socketId,this.socket);

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

        await newClient.acept_offer(params.desc);

        this.socket.emit(EVENT_SOCKET.SEND_ANSWER_OF_CONNECTION,{ 
            desc        : newClient.localDescription, 
            socketId    : params.socketId, // esta malo es el id del cliente
            streamingId : this.streamingId 
        });

         //loader candidates of connect...
         this.send_candidates(newClient,params.socketId);

        this.clients.push(newClient);
    }
  
    
    connectWithMediaStream = async (videoRef) => {
        
        this.startStream = "mediaStreamingConnected ";

       

        try{
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width:{  ideal: 1280, max:1920, },
                  height:{ ideal:600, max:1080, },
                  frameRate:{ ideal:60,max:70, },
                },
                audio: false,
            });
            videoRef.srcObject = this.mediaStream;
        }
        catch(exception){

            console.error(exception);
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

    

    onDisconnectClient = (client) =>{}

    onFailed = ()=>{}
  
}