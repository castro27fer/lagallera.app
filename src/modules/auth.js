
const AUTH = {

    USER                        : "USER",
    TOKEN                       : "TOKEN",
    PHOTO                       : "PHOTO",
    REDIRECT_AFTER_AUTHENTICATE : "REDIRECT_AFTER_AUTHENTICATE",
    STREAMING                   : "STREAMING"
};

export const create = (data) =>{
   
    localStorage.clear();
    localStorage.setItem(AUTH.TOKEN,data.token);
    localStorage.setItem(AUTH.USER,JSON.stringify(data.user));
    localStorage.setItem(AUTH.STREAMING,JSON.stringify(data.streaming));
    // localStorage.setItem(AUTH.PHOTO,data.photo)

    return; 
}

export const is_authenticated = () => get_user() && get_token();

export const auth_delete = () => localStorage.clear();

export const get_token = () => localStorage.getItem(AUTH.TOKEN);

export const get_user = () => localStorage.getItem(AUTH.USER) !== null ? JSON.parse(localStorage.getItem(AUTH.USER)): null;

export const get_photo = () => localStorage.getItem(AUTH.PHOTO);

export const get_streaming = () => localStorage.getItem(AUTH.STREAMING) !== null ? JSON.parse(localStorage.getItem(AUTH.STREAMING)): null;

export const set_streaming = (streaming) => localStorage.setItem(AUTH.STREAMING,JSON.stringify(streaming));
