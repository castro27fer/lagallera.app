import './style.css'
import Item from './Item';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';


function Chat({ socket }){

    const [items,setItems] = useState([]);
    const inputRef = React.createRef("");
    const scrollRef = React.createRef("");


    const sendMessage = ()=>{

        if(inputRef.current.value){

            const item = {
                name:"Yo",
                message : inputRef.current.value,
                type : "me"
            };

            addItem(item);
            inputRef.current.value = "";

            socket.emit("sendMessage",{ 
                name: "Fernando Castro Martinez", 
                message: item.message
            });

        }

    }

    const addItem = (message) => {
        
        setItems((prev_items)=>{
            let aux = [...prev_items];
            aux.push(message);
            return aux;
        });

    }

    const onKeyUp = (e) => {
        if(e.code === "Enter" || e.code === "NumpadEnter"){
            sendMessage();
        }
    }

    useEffect(()=>{
        console.log(items);
        if(items.length > 0){
            scrollRef.current.href = `#${items[items.length - 1].name}_${items.length - 1}`;
            scrollRef.current.click();
            inputRef.current.focus();
        }
    },[items]);

    useEffect(()=>{

        if(socket){
            socket.on("message",(params) => {
                console.log("listing chat room....",params)


                addItem({
                    name: params.name,
                    message:params.message,
                    type: "other"
                })
            });
        }

    },[socket]);

    return (<div className='border border-secondary rounded p-3 shadow'>
        <div id="navbar-example2">
            <a ref={scrollRef} href="#" hidden={true}></a>
        </div>
        
        <ul className='overflow-auto chat-container' tabIndex="0" data-bs-target="#navbar-example2" data-bs-spy="scroll" data-bs-smooth-scroll="true">
            {
                items.map((item,index) =>{
                    return (
                        <li key={`${item.name}_${index}`} id={`${item.name}_${index}`} className={`mb-1 chat-item-${item.type}`}>
                            <Item name = { item.name } message = { item.message } type = { item.type } />
                        </li>
                    );
                })
            }
        </ul>

        <div className='chat-control'>
            <Form.Control ref={inputRef} className='chat-control-input' onKeyUp={onKeyUp} type="text" placeholder='Escrite un mensaje' />
            <button className='btn btn-primary chat-control-button' onClick={sendMessage}>Send</button>
        </div>
    </div>);
}

export default Chat