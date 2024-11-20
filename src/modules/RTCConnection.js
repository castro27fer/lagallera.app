
export const OPTIONS = {
    OFFER     : "offer",
    ANSWER    : "answer",
    CANDIDATE : "candidate",
    FINISH    : "finish"
};

export const CONFIG_CONNECTION_DEFAULT = {
    iceServers: [
        { 
            urls: [
            `stun:stun.l.google.com:19302`
            ]
        }
    ],
    iceTransportPolicy:"all"
};

export const OFFER_OPTIONS = { 
    iceRestart:true,
    offerToReceiveAudio: 0, 
    offerToReceiveVideo: 1 
};

class RTCConnectionClient extends RTCPeerConnection{

  constructor(socket){
    super(CONFIG_CONNECTION_DEFAULT);

    this.socket = socket;
    this.room = "ROOM_RTCCONNECTION";
    this.ICECandidates = [];
    this.mediaStream = null;

    this.loadSocket();
    this.loadMediaStream();
  }

  loadSocket = () =>{
    this.socket.on(this.room,(param) =>{
      switch(param.type){
        case this.OPTIONS.OFFER:{
          this.offer(param.desc);
          break;
        }
        case this.OPTIONS.ANSWER:{
          this.answer(param.desc);
          break;
        }
        case this.OPTIONS.CANDIDATE:{
          this.ICECandidates.push(param.candidate);
          break;
        }
      }
    })
  }

  addMediaStream = (mediaStream) =>{
    this.mediaStream = mediaStream;
    this.mediaStream.getTracks().forEach(track => {
      this.addTrack(track, this.mediaStream);
    });
  }

  establishConnection = async(desc)=>{
    try{
      if(desc !== undefined){
        if(desc.type === OPTIONS.OFFER){
          this.socket.emit(this.room,{type:OPTIONS.OFFER,desc});
        }
        else if(desc.type === OPTIONS.ANSWER){
          this.socket.emit(this.room,{type:OPTIONS.ANSWER,desc});
        }
        else{
          console.log("not establish connection because type description is unknown.")
        }
      }
      else{
        const desc = await this.createOffer(OFFER_OPTIONS);
        await this.setLocalDescription(desc);
        this.socket.emit(this.room,{type:OPTIONS.OFFER,desc:this.LocalDescription});
      }
    }
    catch(err) {
      alert("ocurrio un error inesperado.");
      console.log(err);
    }
  }

  offer = async(desc) =>{

    await this.setRemoteDescription(desc);
    const answer = await this.createAnswer();
    await this.setLocalDescription(answer);
    await this.loadCandidates();

    this.socket.emit(this.room,{type:OPTIONS.ANSWER,desc:this.localDescription});
  }

  answer = async (desc) =>{
    await this.setRemoteDescription(desc);
    await this.loadCandidates();

    // this.socket.emit(this.nameRoom,{option:OPTIONS.ANSWER,desc:this.peerConnection.localDescription});
  }

  loadCandidates = async()=>{
    for(let i = 0; i< this.ICECandidates.length;i++){
      await this.addIceCandidate(this.ICECandidates[i]);
    }
  }

  onicecandidate = (event) => {
    if(event.candidate){
      this.socket.emit(this.room,{type:OPTIONS.CANDIDATE,candidate:event.candidate});
    }
  }
}

export default RTCConnectionClient