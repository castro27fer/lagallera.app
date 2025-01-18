import Form  from './Form';

function Stream({onSuccess,onError}){

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
                value='Testing Streaming...'

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
                value='testintg testing testing .....'
            />

            <Form.Button title='Crear Stream' name='btnCreateStream' type='submit' cols={1} />
            
        </Form>
    </>);
}

export default Stream;