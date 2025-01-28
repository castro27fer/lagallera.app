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

    const request_credential_connection = async(result)=>{

      const connectInf = await api.get_connect_streaming(props.params.streamingId);
      
      create({
        token     : connectInf.token,
        user      : connectInf.user,
        streaming : connectInf.streaming
      });
      result.streaming = connectInf.streaming;
      return result;
    }

    //if not authenticated
    if(!is_authenticated()){
      result = await request_credential_connection(result); //get credential...
    }
    else{ // if authenticated
      const streaming = await get_streaming(); //get streaming
      console.log(streaming);
      if(streaming.id !== props.params.streamingId){
        result = await request_credential_connection(result); //get credential...
      }
      else{
        result.streaming = streaming; // get streaming info of localstore...
      }
    }
    // console.log("streaming que recibo de api",result)
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
  let numInstance = 0;

  const video = (event) =>{
    videoRef.current.srcObject = event.streams[0];
  }


  useEffect(()=>{

    if(streaming && numInstance === 0){
      numInstance++;
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