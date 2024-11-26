import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Receptor as Streaming } from '../modules/streming';
import { useParams } from 'react-router-dom';

function Receptor() {

  const videoRef = React.createRef();
  const { streamingId } = useParams();

  let receptor = null;

  useEffect(()=>{

    if(receptor === null){

      receptor = new Streaming(streamingId);
      receptor.onTrack = (event) =>{
        videoRef.current.srcObject = event.streams[0];
      };
    }
    
  },[])

  return (<>
    <div>Receptor</div>
    <Row>
      <Col>
        <p>Recepción transmisión</p>
        <video ref={videoRef} controls autoPlay></video>
        </Col>

        {/* <button>Conectar a la transmisión</button> */}
    </Row>

    </>)
}

export default Receptor