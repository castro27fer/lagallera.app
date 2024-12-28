import { Col, Row, Card } from 'react-bootstrap';
import FrmLogin from '../componets/forms/login';

function Login(){

    return (<>
        <Row className = 'justify-content-center mt-4'> 
            <Col sm={6} md={6} lg={4} xl={4} xxl={4}>
                <Card>
                    <Card.Header>
                        <Card.Title className = "text-center">Iniciar Sesión</Card.Title>
                    </Card.Header>
                    <Card.Body className='p-4'>
                        <FrmLogin />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>);
}

export default Login