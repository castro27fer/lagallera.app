const MESSAGE_ERROR_DEFAULT = "Ocurrio un error inesperado.";

const axios_error = (ex)=>{
    return ex !== undefined ? ex.response.data : undefined;

}
const exeption = (ex)=>{

    let errors = { message: MESSAGE_ERROR_DEFAULT };

    switch(ex.name){
        case "AxiosError":{
            errors = axios_error(ex); break;
        }
    }

    return errors;
}

export default exeption