import React, { useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { io } from 'socket.io-client'
import video2 from '../assets/videoexample.mp4'

function Streaming() {

  const path_api =  process.env.REACT_APP_URL_API;

  const video = React.createRef(null);
  const canvas = React.createRef(null);
  const status = React.createRef(null);
  const input = React.createRef(null);
  const textarea = React.createRef(null);

  let context = null;
  let socket = io(path_api);;

  const sendMessage = (e)=>{

    console.log(input.current);
    // socket.emit("chatExample",input.current.value);
    context.current.drawImage(video.current,0,0,canvas.current.width,canvas.current.height);
    var url = canvas.current.toDataURL("image/webp");

    socket.emit("chatExample",url);

  }

  useEffect(()=>{

   console.log(canvas)
    
    context = canvas.current.getContext('2d');

    canvas.current.width = video.current.width;
    canvas.current.height = video.current.height;

    context.width = canvas.current.width;
    context.height = canvas.current.height;


    socket.on("chatExample",(msg) =>{
      console.log(textarea,"llego de retorno")
      textarea.current.value = `${msg}`
    })
  // eslint-disable-next-line
  },[]);

  return (
    <Row>
      <video ref={video} src={video2} id='vide' style={{width:"600px",height:"400px"}} loop={true} autoPlay={true}></video>
      <canvas ref={canvas} id='preview'></canvas>
      <div ref={status} className='status'>Status</div>

      <textarea ref={textarea}></textarea>

      <input type="text" ref={input} />
      <button onClick={sendMessage}>Start Stream</button>
    </Row>
  )
}

export default Streaming