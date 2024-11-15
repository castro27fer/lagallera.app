import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { io } from 'socket.io-client'
import RTCConnectionClient from '../modules/RTCConnection.js';

function Receptor() {

  const API_SERVER =  process.env.REACT_APP_URL_API;

  const videoRef = React.createRef();

  let peerConnection = null;

  let socket = null;

  const connectStrem = async() =>{
    peerConnection.establishConnection();
  }

  const onTrack = (e) => videoRef.current.srcObject = e.streams[0];

  const onState = (state) => console.log(`state ${state}`);

  useEffect(()=>{

    if(socket === null){
      socket = io(API_SERVER);
      this.peerConnection = new RTCConnectionClient(socket,"ROOM_CLIENT_001");
      this.peerConnection.onState = onState;
      this.peerConnection.onTrack = onTrack;

    }
    
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