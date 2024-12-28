import Form from './Form';

function Login(){
    
    const onSuccess = ()=>{

    }


    return (<>
        <Form
            url='auth/login'
            method='POST'
            onSuccess={onSuccess}
            cols = {1}
        >

            <Form.Input
                name        =   { 'email' }
                label       =   { 'Correo Electronico' }
                placeholder =   { 'Escribe tu correo electronico' }
                required    =   { true }
                cols        =   { 1 }
                value = {""}
            />

            <Form.InputPassword 
                name        =   { 'password' }
                label       =   { 'Contraseña' }
                placeholder =   { 'Escribe tu contraseña' }
                required    =   { true }
                cols        =   { 1 }
                value = {""}
            />

            <Form.Button type='submit' name='save' title='Iniciar Sessión' variant='secondary' cols={1} />

        </Form>
    </>);
}

export default Login;