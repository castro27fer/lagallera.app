import { useLoaderData, redirect } from 'react-router';
import Form  from './Form';
import { useEffect, useState } from 'react';
import api from '../../modules/api';
import { is_authenticated } from '../../modules/auth';

export const loader = async(params)=>{

    let result = {
        exeption: null,
        data: null
    };

    try{
        
        if(!is_authenticated()){
            return redirect("login");
        }

        const r = await api.stream_keygenAlgorithm();
        result.data  = r;
        return result;
    }
    catch(error){
        result.exeption = error;
        return result;
    }

}

function Stream({onSuccess,onError}){

    const data = useLoaderData();

    const [certificate,setCertificate] = useState(null);
    const [exeption,setExeption] = useState(null);
    const [view,setView] = useState(null);

    const loadCertificate = async(keygenAlgorithm) =>{

        keygenAlgorithm.publicExponent = new Uint8Array([0x01, 0x00, 0x01]);
        const Certificate = await RTCPeerConnection.generateCertificate(keygenAlgorithm);
        setCertificate(()=> Certificate);
    }

    useEffect(()=>{
        if(data){
            console.log(data)
            if(!data.exeption && data.data){
                if(!certificate){
                    console.log(JSON.parse(data.data.keygenAlgorithm));
                    loadCertificate(JSON.parse(data.data.keygenAlgorithm));
                }
            }else{
                onError(!data.expetion ? "Ocurrio un error inesperado.": data.expetion);
                setExeption(()=> !data.expetion ? "Ocurrio un error inesperado.": data.expetion);
            }
        }
    },[data])

    useEffect(()=>{
        if(exeption){
            setView(()=> errorConnect());
        }
        else{
            setView(()=> formStream());
        }

    },[exeption])
    
    const formStream = ()=>{
        return (<>
            <Form
                url={'/stream'}
                method={'POST'}
                cols={1}
                params = {{certificate}}
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

    const errorConnect = ()=>{
        return (<>
            <h1>Error de conexion</h1>
            <p>Dispulta por las molestias...</p>
            
        </>);
    }

    return <>{view}</>;
}

export default Stream;