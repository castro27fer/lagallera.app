import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Emisor }  from '../modules/streming';
import Chat from '../componets/chat/Chat';
import { redirect, useLoaderData } from "react-router";
import { is_authenticated } from '../modules/auth'
import api from '../modules/api';

export const loader = async(props)=>{

  try{

    if(!is_authenticated){
      return redirect("/");
    }

    const streaming = await api.get_streaming(props.params.streamingId);
    
    return streaming;
  }
  catch(err){
    console.error(err);
    return {};
  }
  
}

function Streaming() {

  const { streaming } = useLoaderData();

  const videoRef = React.createRef(null);
  const status = React.createRef(null);

  // let preferredVideoCodecMimeType = 'video/VP8';

// const supportsSetCodecPreferences = window.RTCRtpTransceiver &&
//   'setCodecPreferences' in window.RTCRtpTransceiver.prototype;

// const maybeSetCodecPreferences = (trackEvent) => {

//   if (!supportsSetCodecPreferences) return;

//   if (trackEvent.track.kind === 'video' && preferredVideoCodecMimeType) {
//     const {codecs} = RTCRtpReceiver.getCapabilities('video');
//     const selectedCodecIndex = codecs.findIndex(c => c.mimeType === preferredVideoCodecMimeType);
//     const selectedCodec = codecs[selectedCodecIndex];
//     codecs.splice(selectedCodecIndex, 1);
//     codecs.unshift(selectedCodec);
//     trackEvent.transceiver.setCodecPreferences(codecs);
//   }
// }

  // const gotRemoteStream = (e, videoObject) => {
  //   maybeSetCodecPreferences(e);
  //   if (videoObject.srcObject !== e.streams[0]) {
  //     videoObject.srcObject = e.streams[0];
  //   }
  // }

  const [state,setState] = useState("New");
  const [id,setId] = useState(null);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [stream,setStream] = useState(null);
  const [totalConnecteds,setTotalConnecteds] = useState(0);
  const [maxNumberClient,setmaxNumberClient] = useState(0);

  const [clients,setClients] = useState([]);

  // const onState = (state) => setState(()=>state);

  // const connectWithMediaStream = async()=> {

  //   stream.connectWithMediaStream(videoRef.current);
  //   console.log("connect a media stream....")

  // }

  const closeStream = () => stream.closeStreaming();


  const synchronizeClient = ()=>{
    
    const mapClient = (stream)=>{
      return stream.clients.map(client =>{
        return {
          socketId: client.socketId,
          state: client.connectionState
        }
      })
    }

    const connectedClients = stream.clients.filter(x => x.connectionState === "connected").length;
    const maxNumberClients = stream.clients.length;

    setTotalConnecteds(() =>  connectedClients);
    setmaxNumberClient(() =>  maxNumberClients);
    setClients(() =>  mapClient(stream));

  }

  useEffect(()=>{

    if(streaming && stream === null){
      setStream(new Emisor(streaming));
    }
    
  },[streaming])

  useEffect(()=>{

    if(stream){

      setId(()=> stream.id);

      stream.onConnect = (client)=>{
        
        console.log("streaming created..")
      }

      stream.onConnectClient = ()=>{
        console.log("connected client")
        synchronizeClient();
      }

      stream.onDisconnectClient = ()=>{
        console.log("disconnect client");
        synchronizeClient();

      }

      stream.onFailed = ()=>{
        console.log("fialed client");
        synchronizeClient();

      }
      
      stream.createStreaming({
        title:streaming.title,
        description:streaming.description,
        streamingId: streaming.id
      });

      stream.connectWithMediaStream(videoRef.current);

      setTitle(streaming.title);
      setDescription(streaming.description);
      setId(streaming.id);

    }
  },[stream])

  useEffect(()=>{
    // console.log(status);
    status.current.innerHTML = state;
  },[state]);

  return (<>
     
      <h1 className='text-center'>Tramisión en Vivo</h1>
      
      <Row>

        <Col md='8' lg='8' xl='8'>
          <video ref={videoRef} controls autoPlay onError={(err) => console.log(err)} width={"100%"}></video>
          <p>title: <span>{title}</span></p>
          <p>description: <span>{description}</span></p>
          <div ref={status} className='status'></div>
          {/* <Button variant={'success'} className='me-2' onClick={onCreateStreaming}>Create Streaming</Button> */}
          {/* <Button variant={'primary'} className='me-2' onClick={connectWithMediaStream}>connect Medio</Button> */}
          {/* <Button variant={'warning'} className='me-2' onClick={startStream}>Start Stream</Button> */}
          <Button variant={'danger'} className='me-2' onClick={closeStream}>Close Stream</Button>

        </Col>


        <Col md='4' lg='4' xl='4'>

          <Row>
            <Col>
              <p>Connecteds (<span>{totalConnecteds}</span>)</p>
              <p>Max Connecteds (<span>{maxNumberClient}</span>)</p>
              <div>
                {
                  clients.map(client =>{

                    return(<p key={client.socketId}>{client.socketId} STATE: {client.state}</p>)

                  })
                }
              </div>
            </Col>
          </Row>

          <Row>
            <p>Room of Chat</p>
            <div>

              <Chat socket = { stream ? stream.socket : undefined } name = "Stream"/>

            </div>
              
          </Row>
          
        </Col>

      </Row>

      <a href={`http://localhost:3003/receptor/${id}`} target='_blank'>{`http://localhost:3003/receptor/${id}`}</a>
  </>)
}

export default Streaming