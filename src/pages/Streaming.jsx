import React, { useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { io } from 'socket.io-client'

function Streaming() {


  const video = React.createRef(null);
  const canvas = React.createRef(null);
  const status = React.createRef(null);

  let context = null;
  let socket = null;


  useEffect(()=>{

   console.log(canvas)
    
    context = canvas.current.getContext('2d');

    canvas.current.width = 512;
    canvas.current.height = 384;

    context.width = canvas.current.width;
    context.height = canvas.current.height;

    socket = io('http://localhost:3001');
  // eslint-disable-next-line
  },[]);

  return (
    <Row>
      <video ref={video} src='' id='vide' style={{width:"800px",height:"600px"}} autoPlay={true}></video>
      <canvas ref={canvas} id='preview'></canvas>
      <div ref={status} className='status'>Status</div>
      <button>Start Stream</button>
    </Row>
  )
}

export default Streaming