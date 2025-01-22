import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Receptor as Streaming } from '../modules/streming';
import Chat from '../componets/chat/Chat';
import { useLoaderData } from "react-router";
import { is_authenticated } from '../modules/auth';
import api from '../modules/api';
import { create,get_streaming } from '../modules/auth';


export const loader = async(props)=>{

  let result = {
    exeption: null,
    streaming:null
  }

  try{

    if(!is_authenticated()){

      const connectInf = await api.get_connect_streaming(props.params.streamingId);
      console.log("streaming que recibo de api",connectInf)
      create({
        token     : connectInf.token,
        user      : connectInf.user,
        streaming : connectInf.streaming
      });

      result.streaming = connectInf.streaming;
    }
    else {
      
      result.streaming = get_streaming();
    }
    return result;
  }
  catch(err){
    console.log("error",err);
    result.exeption = err;
    return result;
  }
}

function Receptor() {

  const { exeption, streaming } = useLoaderData();
  const videoRef = React.createRef();

  const [receptor,setReceptor] = useState(null);

  const video = (event) =>{
    videoRef.current.srcObject = event.streams[0];
  }


  useEffect(()=>{

    if(streaming !== undefined){
      console.log(streaming,streaming.id)
      setReceptor(() => new Streaming({ streamingId: streaming.id }));
    }
  },[streaming]);

  useEffect(()=>{

    if(exeption){
      console.log(exeption)
    }    

  },[exeption]);

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