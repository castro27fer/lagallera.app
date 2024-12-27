import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Receptor as Streaming } from '../modules/streming';
import { useParams } from 'react-router-dom';
import Chat from '../componets/chat/Chat'

function Receptor() {

  const videoRef = React.createRef();
  const { streamingId } = useParams();

  const [receptor,setReceptor] = useState(null);

  const video = (event) =>{
    videoRef.current.srcObject = event.streams[0];
  }

  useEffect(()=>{
    
    if(receptor === null){

      setReceptor(() => new Streaming(streamingId));
      
    }
    
  },[])

  
  useEffect(()=>{
    
    if(receptor){
      receptor.onTrack = (event) => video(event);
    }
    

  },[receptor])
  
  return (<>
    <div>Receptor</div>
    <Row className='ju'>
      <Col md='10'>
        <p>Recepción transmisión</p>
        <video ref={videoRef} controls autoPlay width={"100%"}></video>
        </Col>

        <Col>
        <Chat socket = { receptor ? receptor.socket : undefined } name = {`Client ${receptor ? receptor.socket.id : ""}`} />
        </Col>

        {/* <button>Conectar a la transmisión</button> */}
    </Row>

    </>)
}

export default Receptor