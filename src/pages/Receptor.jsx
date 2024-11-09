import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { io } from 'socket.io-client'

function Receptor() {

  const API_SERVER =  process.env.REACT_APP_URL_API;
  const STUN_SERVER = process.env.REACT_SERVER_STUN;

  const videoRef = React.createRef();
  let ICECandidates = [];

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

  const connectStrem = async() =>{
    
    const offerOptions = { 
      iceRestart:true,
      offerToReceiveAudio: 0, 
      offerToReceiveVideo: 1 
    };
    console.log("create offer")
    const offer = await peerConnection.createOffer(offerOptions);
    console.log("load local description")
    await peerConnection.setLocalDescription(offer);
    console.log("send offer")
    socket.emit("offer",peerConnection.localDescription);
  }

  const loadCandidates = async()=>{
    for(let i = 0; i<ICECandidates.length;i++){
      await peerConnection.addIceCandidate(ICECandidates[i]);
    }
  }

  const onCandidate = (event) => {
    if(event.candidate){
      socket.emit("candidate",{candidate:event.candidate,origin:"receptor"});
    }
  }

  const onTrack = (e) =>{

    console.log("onTrack",e);
    videoRef.current.srcObject = e.streams[0];

  };

  const getAnswer = async(desc) => {
    console.log("receive answer")
    console.log("load remote description")
    await peerConnection.setRemoteDescription(desc);
    console.log("loader candidates");
    await loadCandidates();

    console.log("status",peerConnection.connectionState)
  }

  useEffect(()=>{

    peerConnection.onicecandidate = onCandidate;
    peerConnection.ontrack = onTrack;
    
    if(socket === null){
      socket = io(API_SERVER);
      socket.on("getAnswer",(desc) =>getAnswer(desc));
      socket.on("candidate",(candidate)=> ICECandidates.push(candidate.candidate));
    }
    
    setInterval(()=>{
      console.log(peerConnection.connectionState)
    },1000)

  
  },[])

  

  return (<>
    <div>Receptor</div>
    <Row>
      <Col>
        <p>Recepción transmisión</p>
        <video ref={videoRef} controls autoPlay></video>
        </Col>

        <button onClick={connectStrem}>Conectar a la transmisión</button>
    </Row>

    </>)
}

export default Receptor