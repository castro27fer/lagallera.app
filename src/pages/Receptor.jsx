import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap';
import { io } from 'socket.io-client'

function Receptor() {

  const path_api =  process.env.REACT_APP_URL_API;
  const imgRef = React.createRef(null);
  const socket = io(path_api);

  useEffect(()=>{

    socket.on('video-stream', (data) => {

      imgRef.current.src = data;
      
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
        <img ref={imgRef} alt="" />
        </Col>
    </Row>

    </>)
}

export default Receptor