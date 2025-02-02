
const OFFER_OPTIONS = { 
    iceRestart:true,
    offerToReceiveAudio: 0, 
    offerToReceiveVideo: 1 
};

export class PeeerConnection extends RTCPeerConnection{

    ICECandidates = [];

    constructor(props){
        super(props);


    }

    oniceconnectionstatechange  = (event) =>{
        // console.log("candiate state",this.iceConnectionState,event)
    }

    onsignalingstatechange = (event) =>{
        // console.log("onsignalingstatechange state",this.iceConnectionState,event)
    }

    onconnectionstatechange =(event) =>{

        /*STATUS */
        /*connected */
        /*disconnected*/
        /*failed */
        // console.log("connection state",this.connectionState);

        if(this.connectionState === "disconnected"){
            this.restartIce();
        }

    }

    onConnectClient = (client) =>{}

    onicecandidate = async(event)=>{
       
        if(event.candidate){
            this.ICECandidates.push(event.candidate);
        }
    }
}
/**
 * Conecta al streaming con el cliente
 */
export class RTCConnectionClient extends PeeerConnection{

    socketId = null;
    socket = null;
    
    constructor(props,socketId,socket){
        super(props);

        this.socketId = socketId;
        this.socket = socket;
    }

    acept_offer = async(desc)=>{

        await this.setRemoteDescription(desc);
        const answer = await this.createAnswer();
        await this.setLocalDescription(answer);

    }

}

/**
 * Conecta al cliente al streaming
 */
export class RTCPeerConnectionReceptor extends PeeerConnection{


    constructor(props){

        super(props);

    }

    offer = async()=>{

        const offerAux = await this.createOffer(OFFER_OPTIONS);
        await this.setLocalDescription(offerAux);
        const local_description = this.localDescription;
        return local_description;

    }

}
