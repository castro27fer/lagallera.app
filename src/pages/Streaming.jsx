import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
// import { io } from 'socket.io-client'

function Streaming() {

  const path_api =  process.env.REACT_APP_URL_API;
  const [play,set_play] = useState(false);
  const [mediaStream,setMediaStream] = useState(null);
  const pc1Local = new RTCPeerConnection();
  const pc1Remote = new RTCPeerConnection();

  const videoRef = React.createRef(null);
  const videoClientRef = React.createRef(null);

  const canvas = React.createRef(null);
  const status = React.createRef(null);
  const input = React.createRef(null);
  const imgRef = React.createRef(null);
  // let context = null;
  // const textarea = React.createRef(null);
  let preferredVideoCodecMimeType = 'video/VP8';

  // const socket = io(path_api);

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
      .then(ms =>{
        setMediaStream(()=>ms);
        /*https://github.com/webrtc/
        https://webrtc.org/getting-started/firebase-rtc-codelab?hl=es-419*/

      }).catch(err =>{
        status.current.innerHTML =  `ERROR: ${err}`
        console.log(`Error: ${err}`);
      })
  }

  const clientConnection = async(e)=>{

    const audioTracks = mediaStream.getAudioTracks();
    const videoTracks = mediaStream.getVideoTracks();
    
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
   
    //se cambia el evento ontrack el el que carga el TrackEvent en el objecto video enviado...
    pc1Remote.ontrack = e => gotRemoteStream(e, videoClientRef.current);

    console.log('pc1: created local and remote peer connection objects');

    // pc2Local = new RTCPeerConnection();
    // pc2Remote = new RTCPeerConnection();
    // pc2Remote.ontrack = e => gotRemoteStream(e, video3);
    // console.log('pc2: created local and remote peer connection objects');

    //
    mediaStream.getTracks().forEach(track => {
      pc1Local.addTrack(track, mediaStream);
      // pc2Local.addTrack(track, localStream);
    });
    await Promise.all([
      negotiate(pc1Local, pc1Remote),
      // negotiate(pc2Local, pc2Remote),
    ]);
}

const supportsSetCodecPreferences = window.RTCRtpTransceiver &&
  'setCodecPreferences' in window.RTCRtpTransceiver.prototype;

const maybeSetCodecPreferences = (trackEvent) => {

  if (!supportsSetCodecPreferences) return;

  if (trackEvent.track.kind === 'video' && preferredVideoCodecMimeType) {
    const {codecs} = RTCRtpReceiver.getCapabilities('video');
    const selectedCodecIndex = codecs.findIndex(c => c.mimeType === preferredVideoCodecMimeType);
    const selectedCodec = codecs[selectedCodecIndex];
    codecs.splice(selectedCodecIndex, 1);
    codecs.unshift(selectedCodec);
    trackEvent.transceiver.setCodecPreferences(codecs);
  }
}

const negotiate = async(localPc, remotePc) => {
  localPc.onicecandidate = e => remotePc.addIceCandidate(e.candidate);
  remotePc.onicecandidate = e => localPc.addIceCandidate(e.candidate);

  await localPc.setLocalDescription();
  await remotePc.setRemoteDescription(localPc.localDescription);
  await remotePc.setLocalDescription();
  await localPc.setRemoteDescription(remotePc.localDescription);
}

  const gotRemoteStream = (e, videoObject) => {
    maybeSetCodecPreferences(e);
    if (videoObject.srcObject !== e.streams[0]) {
      videoObject.srcObject = e.streams[0];
    }
  }

  useEffect(()=>{

    if(mediaStream !== null){

      videoRef.current.srcObject = mediaStream;
      status.current.innerHTML = "Status: Start stream..."
      console.log("estoy en bucle...")
      
    }

  },[mediaStream])


  return (<>
     
      <h1>Tramisión en Vivo</h1>
      
      <Row>

        <Col>
          <p>Video Original</p>
          <video ref={videoRef} controls autoPlay onError={(err) => console.log(err)}></video>
          <div ref={status} className='status'>Status : No Init</div>
          <button onClick={startCapture}>Start Stream</button>
          <button onClick={clientConnection}>Conectar Cliente 1</button>
        </Col>

        <Col>
          <p>Recepción</p>
          <video ref={videoClientRef} playsInline autoPlay></video>
          {/* <p>Recepción transmisión</p>
          <img ref={imgRef} alt="" /> */}
        </Col>

      </Row>
      

    

        
      {/* <textarea ref={textarea}></textarea>

      <input type="text" ref={input} /> */}
     
    
  </>)
}

export default Streaming