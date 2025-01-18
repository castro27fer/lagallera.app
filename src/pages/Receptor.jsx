import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Receptor as Streaming } from '../modules/streming';
import Chat from '../componets/chat/Chat';
import { useLoaderData } from "react-router";
import { is_authenticated } from '../modules/auth';
import api from '../modules/api';
import { create } from '../modules/auth';


export const loader = async(props)=>{

  try{

    const connectInf = await api.get_connect_streaming(props.params.streamingId);
    
    if(!is_authenticated()){
      create({
        token :connectInf.token,
        user  :connectInf.streaming
      });
    }
   
    return connectInf;
  }
  catch(err){
    console.log("error",err);
    return {};
  }
  

}

function Receptor() {

  const { streaming } = useLoaderData();
  const videoRef = React.createRef();

  const [receptor,setReceptor] = useState(null);

  const video = (event) =>{
    videoRef.current.srcObject = event.streams[0];
  }


  useEffect(()=>{

    if(streaming){
      setReceptor(() => new Streaming({ streamingId: streaming.id }));
    }
  },[streaming]);

  
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