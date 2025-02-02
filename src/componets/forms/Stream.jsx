import { useSearchParams } from 'react-router-dom';
import Form  from './Form';
import { useEffect, useState } from 'react';

function Stream({onSuccess,onError}){

    const [certificate,setCertificate] = useState(null);

    const loadCertificate = async() =>{

        const Certificate = await RTCPeerConnection.generateCertificate({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256"
        });

        // console.log("certificado sin serialzar",res);
        // const Certificate = JSON.stringify(res);
        
        // console.log("certificado serializado",Certificate)
        setCertificate(()=> Certificate);
    }

    useEffect(()=>{

        if(!certificate){
            loadCertificate();
        }
        
    },[])
    

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

export default Stream;