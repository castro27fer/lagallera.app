import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import emisor from '../modules/emisor';

function Streaming() {

  const videoRef = React.createRef(null);
  const status = React.createRef(null);
  const countClient = React.createRef(null)

  let stream = null;

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
  const [clients,setClients] = useState([]);
  const [chats,setChats] = useState([]);

  const onState = (state) => setState(()=>state);

  const onCreateStreaming = () =>{
    stream = new emisor();
    stream.onState = onState;
    stream.clientsConnected = clientsConnected
  }

  const clientsConnected = (client) =>{
    setClients((prev_clients)=>{

      prev_clients.push(client);
      return prev_clients;
      
    })
  }

  const connectWithMediaStream = ()=> stream.connectWithMediaStream();

  const startStream = () => stream.startStream();

  const closeStream = () => stream.closeStream();


  useEffect(()=>{
    
  },[])

  useEffect(()=>{
    console.log(status);
    status.current.innerHTML = state;
  },[state]);

  return (<>
     
      <h1 className='text-center'>Tramisión en Vivo</h1>
      
      <Row>

        <Col md='8' lg='8' xl='8'>
          <video ref={videoRef} controls autoPlay onError={(err) => console.log(err)} width={"100%"}></video>
          <div ref={status} className='status'></div>
          <Button variant={'success'} className='me-2' onClick={onCreateStreaming}>Create Streaming</Button>
          <Button variant={'primary'} className='me-2' onClick={connectWithMediaStream}>connect Medio</Button>
          <Button variant={'warning'} className='me-2' onClick={startStream}>Start Stream</Button>
          <Button variant={'danger'} className='me-2' onClick={closeStream}>Close Stream</Button>

        </Col>

        <Col md='4' lg='4' xl='4'>

          <Row>
            <Col>
              <p>Connecteds (<span>{clients.length}</span>)</p>
              <div hidden={clients.length === 0}>
                {
                  clients.map(client =>{

                    return(<p key={client.id}>{client.name}</p>)

                  })
                }
              </div>
            </Col>
          </Row>

          <Row>
            <p>Room of Chat</p>
            <div>
                {
                  chats.map(chat =>{
                    return(<p><strong>{chat.name}:</strong> {chat.message}</p>);
                  })
                }
            </div>
            <Form.Control type='text' placeholder='Entro a message' />
            <Button variant='secondary' className='mt-2'>Send message</Button>
          </Row>
          
        </Col>

      </Row>
  </>)
}

export default Streaming