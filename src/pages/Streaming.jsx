import React, { useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { io } from 'socket.io-client'

function Streaming() {

  const path_api =  process.env.REACT_APP_URL_API;

  const videoRef = React.createRef(null);
  // const canvas = React.createRef(null);
  const status = React.createRef(null);
  const input = React.createRef(null);
  // const textarea = React.createRef(null);

  const socket = io(path_api);;

  const sendMessage = (e)=>{

    console.log(input.current);
    // socket.emit("chatExample",input.current.value);
    // context.current.drawImage(video.current,0,0,canvas.current.width,canvas.current.height);
    // var url = canvas.current.toDataURL("image/webp");

    // socket.emit("chatExample",url);

  }

  const startCapture = async()=>{
    

    try {

      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(mediaStream);
      
      mediaRecorder.ondataavailable = (event) => {

          console.log(event)
          if (event.data.size > 0) {
              socket.emit('video-stream', event.data);
          }
      };

      mediaRecorder.start(100); // Enviar datos cada 100ms

      mediaStream.getTracks().forEach(track => {
          track.onended = () => {
              mediaRecorder.stop();
          };
      });

      status.current.innerHTML = "Status: Start stream..."

    } catch (err) {
      console.error(`Error: ${err}`);
    }

    // return captureStream;
  }

  useEffect(()=>{

    socket.on('video-stream', (data) => {
      const video = videoRef.current;
      if (video) {
        
          const blob = new Blob([data.arrayBuffer], { type: 'video/webm; codecs=vp8, opus' });
          const url = URL.createObjectURL(blob);
          console.log(url)
          video.src = url;
          video.play();
      }
    });

    return () => {
        socket.off('video-stream');
    };
    // eslint-disable-next-line
  },[])


  return (
    <Row>
      <h1>Tramisión en Vivo</h1>
      <video ref={videoRef} controls autoPlay></video>
      <div ref={status} className='status'>Status : No Init</div>

      {/* <textarea ref={textarea}></textarea>

      <input type="text" ref={input} /> */}
      <button onClick={startCapture}>Start Stream</button>
    </Row>
  )
}

export default Streaming