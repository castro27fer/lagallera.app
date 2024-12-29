import Form  from './Form';
import { Row, Col } from 'react-bootstrap';

function Stream(){

    const onSuccess = ()=>{}

    const onError = ()=>{}

    return (<>
        <Form
            url={'/stream'}
            method={'POST'}
            cols={1}
            onSuccess={onSuccess}
            onError={onError}
        >
            <Form.Input
                name        =   {'title'}
                type        =   {'text'}
                label       =   {'Titulo'}
                placeholder =   {'Escribe un titulo'}
                cols        =   {1}
                required    =   {false}
                max         =   {120}
                min         =   {3}

            />

            <Form.Input
                name        =   {'description'}
                type        =   {'text'}
                label       =   {'Descriptión'}
                placeholder =   {'Escribe una descripción'}
                cols        =   {1}
                required    =   {false}
                max         =   {250}
                min         =   {3}
            />

            <Form.Button title='Crear Stream' name='btnCreateStream' type='submit' cols={1} />
            
        </Form>
    </>);
}

export default Stream;