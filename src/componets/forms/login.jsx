import Form from './Form';
import { create } from '../../modules/auth'
import { Link, useLocation, redirect, useNavigate   } from "react-router-dom";

function Login(){
    
    let navigate = useNavigate();

    const onSuccess = (result)=>{

        create(result);
        // console.log("redirect to home")
        navigate("/");
        
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
                type        =   { 'email' }
                label       =   { 'Correo Electrónico' }
                placeholder =   { 'Escribe tu correo electrónico' }
                required    =   { true }
                cols        =   { 1 }
                value       =   { "jf3r123@gmail.com" }
            />

            <Form.InputPassword 
                name        =   { 'password' }
                type        =   { 'password' }
                label       =   { 'Contraseña' }
                placeholder =   { 'Escribe tu contraseña' }
                required    =   { false }
                cols        =   { 1 }
                value       =   { "Castrofer27*" }
            />

            <Form.Button type='submit' name='save' title='Iniciar Sessión' variant='secondary' cols={1} />

        </Form>
    </>);
}

export default Login;