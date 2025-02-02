// import { io } from 'socket.io-client'
import { Manager as m } from "socket.io-client";

class Manager extends m{

    SOCKET = null;

    constructor(props){
        super(props);
        
        this.SOCKET = this.socket("/");
        this.eventManager();
    }

    eventManager = () =>{
        
        this.SOCKET.io.on("reconnect", (attempt) => {
            console.log(`Reconexión exitosa en el intento ${attempt}`);
        });

        this.SOCKET.io.on("reconnect_attempt", (attempt) => {
            console.log("socket event reconnect_attempt",attempt)
        });

        this.SOCKET.io.on("reconnect_error", (attempt) => {
            console.log("socket event reconnect_error",attempt)
        });

        this.SOCKET.io.on("reconnect_failed", (attempt) => {
            console.log("socket event reconnect_error",attempt)
        });
    }

}

class socket{

    manager = null;
    socket = null;

    constructor({host,token}){

        // this.manager = new Manager({host,token});
        this.manager = new Manager(host, {
            path: '/socket.io',
            query: { token: token },
            reconnection: true, // Activa las reconexiones automáticas
            reconnectionAttempts: 6, // Número máximo de intentos de reconexión
            reconnectionDelay: 500, // Retraso inicial en ms
        });
        
        // this.manager.disconnect();

        this.socket = this.manager.SOCKET;

        this.eventSocket();
    }

    eventSocket = () => {

        this.socket.on("connect",this.onConnect);

        this.socket.on("disconnect", (reason, details) => {
            console.log(`Desconectado del servidor, razón: ${reason}`);
        });


        this.socket.on("connect_error", (error) => {
            
            if (this.socket.active) {
              
                //escribir el algoritmo de reconeccion al servidor  
                console.log("failure connect, try to reconnect")
                this.socket.connect();
                console.log("reconnect socket....")

            } else {
              // the connection was denied by the server
              // in that case, `socket.connect()` must be manually called in order to reconnect

                
              console.log(error);
            }

        });

        this.socket.on("ping", () => {
            console.log("socket event ping")
        });


        this.socket.on("error", (error) => {
            console.log("socket event error",error)
        });

        
        
    }

    onConnect = (props)=> {

        // console.log("on connect...",props)
        
    };

    onReconnect = (props) =>{

    }

    emit = (eventEmit,props) =>{
        this.socket.emit(eventEmit,props);
    }

    on = (eventEmit,callback) =>{
        this.socket.on(eventEmit,callback)
    }
}

export default socket
