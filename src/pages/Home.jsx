import { is_authenticated } from '../modules/auth';
import { redirect } from "react-router-dom";
import { Row, Col, Card } from 'react-bootstrap';
import FormStream from '../componets/forms/Stream'

export const loader = ({request})=>{
    console.log(request);

    if(!is_authenticated()){
        return redirect("login");
    }
    return null;
}

function Home(){
    return (<>
       <Row className = {'justify-content-center'}>
            <Col xs='6' sm='6' md='6' lg='6' xl='6' className = {'mt-4'}>
                <Card>
                    <Card.Title className = 'text-center p-1'>Crear un Streaming</Card.Title>
                    <Card.Body>

                        <FormStream />

                    </Card.Body>
                </Card>
            </Col>
       </Row>
    </>);
}

export default Home