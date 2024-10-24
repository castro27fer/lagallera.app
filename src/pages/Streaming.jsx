import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { io } from 'socket.io-client'

function Streaming() {

  const path_api =  process.env.REACT_APP_URL_API;
  const [play,set_play] = useState(false);

  const videoRef = React.createRef(null);
  const canvas = React.createRef(null);
  const status = React.createRef(null);
  const input = React.createRef(null);
  const imgRef = React.createRef(null);
  // let context = null;
  // const textarea = React.createRef(null);

  const socket = io(path_api);

  const sendMessage = (e)=>{

    console.log(input.current);
    // socket.emit("chatExample",input.current.value);
    // context.current.drawImage(video.current,0,0,canvas.current.width,canvas.current.height);
    // var url = canvas.current.toDataURL("image/webp");

    // socket.emit("chatExample",url);

  }

  const startCapture = async()=>{
    

    try {

      navigator.mediaDevices.getDisplayMedia({
        video: {
          width:{
            // min: 1024, //not soport
            ideal: 600,
            max:1920,
          },
          height:{
            // min:576, //not soport
            ideal:400,
            max:1080,
          },
          frameRate:{
            ideal:120,max:300,
          },
        },
        audio: false,
      })
      .then(mediaStream =>{

        
        videoRef.current.srcObject = mediaStream;

        const context = canvas.current.getContext("2d");
        // console.log(canvas);
        
        setInterval(() => {

          canvas.current.width = videoRef.current.videoWidth;
          canvas.current.height = videoRef.current.videoHeight;

          context.drawImage(videoRef.current,0,0,canvas.current.width,canvas.current.height);
          const captureImage = canvas.current.toDataURL("image/webp",100);
          socket.emit('video-stream', captureImage);

        }, 10);
      });

    //   if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8')) {
    //    console.log("codec soportado...")
    // } else {
    //     console.error('Codec no soportado');
    // }

    //   const mediaRecorder = new MediaRecorder(mediaStream,{
    //     mimeType:"video/webm; codecs=vp8, opus",
    //   });
      
      // mediaRecorder.ondataavailable = (event) => {

      //     if (event.data.size > 0) {
      //         socket.emit('video-stream', event.data);
      //     }
      // };

      // mediaRecorder.start(10); // Enviar datos cada 100ms

      // videoRef.current.play();

      // mediaStream.getTracks().forEach(track => {
      //     track.onended = () => {
      //         mediaRecorder.stop();
      //     };
      // });

      status.current.innerHTML = "Status: Start stream..."

    } catch (err) {
      console.error(`Error: ${err}`);
    }

    // return captureStream;
  }

  // useEffect(()=>{

    


  //   socket.on('video-stream', (data) => {

  //     // console.log(data);
  //     imgRef.current.src = data;
  //     // const video = videoRef.current;
  //     // if (video) {
        
  //     //   // pasar directo el data xq es in blob no hay necesidad de instanciar un blob...
  //     //     // const blob = new Blob([data], { type: 'video/webm; codecs=vp8, opus' });

  //     //     const blob = new Blob([data.ArrayBuffer], { type: 'video/webm; codecs=vp8, opus' });

  //     //     console.log('Received data type:', blob);
  //     //     console.log('Is Blob:', blob instanceof Blob); // Esto debe ser true

  //     //     const url = URL.createObjectURL(blob);
  //     //     // console.log(url)
  //     //     video.src  = url;

  //     //     if(play){
  //     //       set_play(()=>true);
  //     //       video.play();
  //     //     }
          
  //     //     // Liberar el objeto URL después de usarlo
  //     //     return () => {
  //     //       URL.revokeObjectURL(url);
  //     //   };

  //     // }
  //   });

  //   return () => {
  //       socket.off('video-stream');
  //   };
  //   // eslint-disable-next-line
  // },[])


  return (<>
    // <Container fluid>
      <h1>Tramisión en Vivo</h1>
      
      <Row>

        <Col>
          <p>Video Original</p>
          <video ref={videoRef} controls autoPlay onError={(err) => console.log(err)}></video>
          <div ref={status} className='status'>Status : No Init</div>
          <button onClick={startCapture}>Start Stream</button>
        </Col>

        <Col>
          <p>Canvas</p>
          <canvas ref={canvas}></canvas>
          {/* <p>Recepción transmisión</p>
          <img ref={imgRef} alt="" /> */}
        </Col>

      </Row>
      

    

        
      {/* <textarea ref={textarea}></textarea>

      <input type="text" ref={input} /> */}
     
    // </Container>
  </>)
}

export default Streaming