class receptor extends client{

    constructor(){
      super();
      this.room = "";
      this.connectionInitialClient();
    }
  
    connectionInitialClient = async() =>{
      
      const response = await axios.post(`${this.HOST_SIGNAL}/api/room`,{socketId:this.socket.id});
      this.roomConnection = response.data.roomConnection;
      this.roomChatStream = response.data.roomChatStream;
  
      this.peerConnection = new RTCConnectionClient(this.socket,this.roomConnection);
      await this.peerConnection.establishConnection();
    
    }
  
  }

  export default receptor;