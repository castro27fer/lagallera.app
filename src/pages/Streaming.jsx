import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { io } from 'socket.io-client'

function Streaming() {

  const API_SERVER =  process.env.REACT_APP_URL_API;
  const STUN_SERVER = process.env.REACT_SERVER_STUN;

  const videoRef = React.createRef(null);
  const status = React.createRef(null);

  let ICECandidates = [];
  let mediaStream = null;
  // const [socket,setSocket] = useState(null)

  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { 
        urls: [
          `stun:stun.l.google.com:19302`
        ]
      }
    ],
    iceTransportPolicy:"all"
  });

  
  let socket = null;
  // let preferredVideoCodecMimeType = 'video/VP8';

  const startCapture = async()=>{
    navigator.mediaDevices.getDisplayMedia({
      video: {
        width:{
          // min: 1024, //not soport
          ideal: 600,
          max:1920,
        },
        height:{
          // min:576, //not soport
          ideal:400,
          max:1080,
        },
        frameRate:{
          ideal:60,max:70,
        },
      },
      audio: false,
    })
    .then(ms => {
      
      mediaStream = ms;
      // set_mediaStream(()=> ms); 
      status.current.innerHTML = "Status: Start stream..."
      videoRef.current.srcObject = mediaStream;

      mediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, mediaStream);
      });
    })
    .catch(err =>{
      status.current.innerHTML =  `ERROR: ${err}`
      console.log(`Error: ${err}`);
    })
  }

// const supportsSetCodecPreferences = window.RTCRtpTransceiver &&
//   'setCodecPreferences' in window.RTCRtpTransceiver.prototype;

// const maybeSetCodecPreferences = (trackEvent) => {

//   if (!supportsSetCodecPreferences) return;

//   if (trackEvent.track.kind === 'video' && preferredVideoCodecMimeType) {
//     const {codecs} = RTCRtpReceiver.getCapabilities('video');
//     const selectedCodecIndex = codecs.findIndex(c => c.mimeType === preferredVideoCodecMimeType);
//     const selectedCodec = codecs[selectedCodecIndex];
//     codecs.splice(selectedCodecIndex, 1);
//     codecs.unshift(selectedCodec);
//     trackEvent.transceiver.setCodecPreferences(codecs);
//   }
// }

  // const gotRemoteStream = (e, videoObject) => {
  //   maybeSetCodecPreferences(e);
  //   if (videoObject.srcObject !== e.streams[0]) {
  //     videoObject.srcObject = e.streams[0];
  //   }
  // }


  const createAnswer = async(desc) => {

    try{
      console.log("receive offer");
      console.log("load remote description")
      await peerConnection.setRemoteDescription(desc);
      console.log("create Answer")
      const answer = await peerConnection.createAnswer();
      console.log("load local description")
      await peerConnection.setLocalDescription(answer);
      await loadCandidates();

      console.log("status",peerConnection.connectionState)
    }
    catch(err){
      console.log("error al cargar setRemoteDescription",err);
    }
    console.log("send answer");
    socket.emit("answer",peerConnection.localDescription);
  }

  const onCandidate = (event) => {
    if(event.candidate){
      socket.emit("candidate",{candidate: event.candidate, origin:"emisor"});
    }
  }

  const loadCandidates = async()=>{
    console.log("loader candidates")
    for(let i = 0; i<ICECandidates.length;i++){
      await peerConnection.addIceCandidate(ICECandidates[i]);
    }
  }

  // useEffect(()=>{
  //   if(mediaStream !== null){
  //     status.current.innerHTML = "Status: Start stream..."
  //     videoRef.current.srcObject = mediaStream;

  //     mediaStream.getTracks().forEach(track => {
  //       console.log("add track")
  //       peerConnection.addTrack(track, mediaStream);
  //     });
  //   }
    

  // },[mediaStream])

  useEffect(()=>{

    peerConnection.onicecandidate = onCandidate;
    
    if(socket === null){

      socket = io(API_SERVER);
      socket.on("getOffer",(desc)=>createAnswer(desc));
      socket.on("candidate",(candidate)=>ICECandidates.push(candidate.candidate));
    }
    
    setInterval(()=>{
      console.log(peerConnection.connectionState)
    },1000)

  },[])

  

  return (<>
     
      <h1>Tramisión en Vivo</h1>
      
      <Row>

        <Col>
          <p>Video Original</p>
          <video ref={videoRef} controls autoPlay onError={(err) => console.log(err)}></video>
          <div ref={status} className='status'>Status : No Init</div>
          <button onClick={startCapture}>Start Stream</button>
          {/* <button onClick={clientConnection}>Conectar Cliente 1</button> */}
        </Col>

      </Row>
      

    

        
      {/* <textarea ref={textarea}></textarea>

      <input type="text" ref={input} /> */}
     
    
  </>)
}

export default Streaming