
const OFFER_OPTIONS = { 
    iceRestart:true,
    offerToReceiveAudio: 0, 
    offerToReceiveVideo: 1 
};

/**
 * Conecta al streaming con el cliente
 */
export class RTCConnectionClient extends RTCPeerConnection{

    ICECandidates = [];
    socketId = null;
    
    constructor(props,socketId){
        super(props);

        this.socketId = socketId;
    }

    loadCandidates = async()=>{
        for(let i = 0; i< this.ICECandidates.length;i++){
          await this.addIceCandidate(this.ICECandidates[i]);
        }
    }

    // addCandidates = (candidates) =>{

    //     for(let i = 0; i< candidates.length;i++){
    //       this.addIceCandidate(candidates[i]);
    //     }
    
    // }

}

/**
 * Conecta al cliente al streaming
 */
export class RTCPeerConnectionReceptor extends RTCPeerConnection{


    constructor({
        config_conection,
        onconnectionstatechange,
        ontrack,
        onicecandidate
    }){

        super(config_conection);
        this.onconnectionstatechange = onconnectionstatechange;
        this.ontrack = ontrack;
        this.onicecandidate = onicecandidate;

    }

    offer = async()=>{

        const offerAux = await this.createOffer(OFFER_OPTIONS);
        await this.setLocalDescription(offerAux);
        const local_description = this.localDescription;
        return local_description;

    }


}
