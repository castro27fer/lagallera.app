import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap';
import { io } from 'socket.io-client'

function Receptor() {

  const path_api =  process.env.REACT_APP_URL_API;
  const videoRef = React.createRef();
  const socket = io(path_api);

  useEffect(()=>{

    socket.on('video-stream', (data) => {
      // console.log("llego...")
      videoRef.current.srcObject = data;
      
    });

    // return () => {
    //     socket.off('video-stream');
    // };
    // eslint-disable-next-line
  },[])

  return (<>
    <div>Receptor</div>
    <Row>
      <Col>
        <p>Recepción transmisión</p>
        <video ref={videoRef}></video>
        </Col>
    </Row>

    </>)
}

export default Receptor