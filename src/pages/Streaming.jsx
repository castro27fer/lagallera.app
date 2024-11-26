import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Emisor }  from '../modules/streming';

function Streaming() {

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
  const [stream,setStream] = useState(null);

  // const [streaming,setStreaming] = useState(null);
  // const [clients,setClients] = useState([]);
  // const [chats,setChats] = useState([]);

  const onState = (state) => setState(()=>state);

  const onCreateStreaming = () =>{

    const params = {
      title:"title of streming",
      description:"the description the of streming...."
    }


    stream.createStreaming(params);
    console.log("created room streaming")
    // console.log(stream);
    // stream.onConnect = ()=>{
    //   setId(()=> stream.id);
    //   console.log("streaming created..")
    // }
  }

  const connectWithMediaStream = async()=> {

    // const mediaStream = await navigator.mediaDevices.getDisplayMedia({
    //   video: {
    //     width:{  ideal: 1280, max:1920, },
    //     height:{ ideal:600, max:1080, },
    //     frameRate:{ ideal:60,max:70, },
    //   },
    //   audio: false,
    // });

    stream.connectWithMediaStream(videoRef.current);
    // videoRef.current.srcObject = mediaStream;

    console.log("connect a media stream....")

  }

  const startStream = () => {

    console.log("Iniciar Streaming......");
    stream.startStreaming();
  };

  const closeStream = () => stream.closeStreaming();


  useEffect(()=>{

    if(stream === null){
      setStream(new Emisor());
    }
    
  },[])

  useEffect(()=>{

    if(stream !== null){

      stream.onConnect = ()=>{
        setId(()=> stream.id);
        console.log("streaming created..")
      }

    }
  },[stream])

  useEffect(()=>{
    console.log(status);
    status.current.innerHTML = state;
  },

  [state]);

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
              {/* <p>Connecteds (<span>{clients.length}</span>)</p>
              <div hidden={clients.length === 0}>
                {
                  clients.map(client =>{

                    return(<p key={client.id}>{client.name}</p>)

                  })
                }
              </div> */}
            </Col>
          </Row>

          <Row>
            <p>Room of Chat</p>
            <div>
                {/* {
                  chats.map(chat =>{
                    return(<p><strong>{chat.name}:</strong> {chat.message}</p>);
                  })
                } */}
            </div>
            <Form.Control type='text' placeholder='Entro a message' />
            <Button variant='secondary' className='mt-2'>Send message</Button>
          </Row>
          
        </Col>

      </Row>

      <a href={`http://localhost:3003/receptor/${id}`} target='_blank'>{`http://localhost:3003/receptor/${id}`}</a>
  </>)
}

export default Streaming