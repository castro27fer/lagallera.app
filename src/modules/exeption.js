
const STATUS = {
    BAD_REQUEST:400,
    ERROR:500
};

const MESSAGE_ERROR_DEFAULT = "Ocurrio un error inesperado.";
const MESSAGE_BAD_REQUEST_GENERY = "Existen campos vacíos.";

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