import { is_authenticated } from '../modules/auth';
import { redirect } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import FormStream from '../componets/forms/Stream'
import { useNavigate } from "react-router";

export const loader = ({request})=>{
    

    if(!is_authenticated()){
        return redirect("login");
    }
    return null;
}

function Home(){

    let navigate = useNavigate();

    const onSuccess = (result)=>{

        const { streamingId } = result;

        navigate(`/streaming/${streamingId}`);

    }

    const onError = (err) =>{
        console.log(err);
    }

    return (<>
       <Row className = {'justify-content-center'}>
            <Col xs='6' sm='6' md='6' lg='4' xl='4' className = {'mt-4'}>
                <Card>
                    <Card.Title className = 'text-center p-1'>Crear un Streaming</Card.Title>
                    <Card.Body>

                        <FormStream onSuccess = { onSuccess } onError = { onError } />

                    </Card.Body>
                </Card>
            </Col>
       </Row>
    </>);
}

export default Home