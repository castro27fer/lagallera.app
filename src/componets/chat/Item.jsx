import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';

function Item(props){

    const [item,setItem] = useState({
        name    :   "",
        message :   "",
        type    :   ""
    });

    useEffect(() => setItem(() => props),[props]);
    
    return (
           
        <Card className={`shadow-ms chat-message-${item.type}`}>
            <Card.Subtitle className="ms-3 me-3 mt-2"> {item.name} </Card.Subtitle>
            <Card.Body className="pt-1">
                <Card.Text>{item.message}</Card.Text>
            </Card.Body>    
        </Card>

    );

}

export default Item;