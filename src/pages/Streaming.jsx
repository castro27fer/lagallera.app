import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Emisor }  from '../modules/streming';
import Chat from '../componets/chat/Chat';

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
  const [totalConnecteds,setTotalConnecteds] = useState(0);
  const [maxNumberClient,setmaxNumberClient] = useState(0);

  const [clients,setClients] = useState([]);

  const onState = (state) => setState(()=>state);

  const onCreateStreaming = () =>{

    const params = {
      title:"title of streming",
      description:"the description the of streming...."
    }


    stream.createStreaming(params);
    console.log("created room streaming")
  }

  const connectWithMediaStream = async()=> {

    stream.connectWithMediaStream(videoRef.current);
    console.log("connect a media stream....")

  }

  const startStream = () => {

    console.log("Iniciar Streaming......");
    stream.startStreaming();
  };

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

    if(stream === null){
      setStream(new Emisor());
    }
    
  },[])

  useEffect(()=>{

    if(stream !== null){

      stream.onConnect = (client)=>{
        setId(()=> stream.id);
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

              <Chat socket = { stream ? stream.socket : undefined } />

            </div>
              
          </Row>
          
        </Col>

      </Row>

      <a href={`http://localhost:3003/receptor/${id}`} target='_blank'>{`http://localhost:3003/receptor/${id}`}</a>
  </>)
}

export default Streaming