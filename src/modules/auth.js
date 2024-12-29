
const AUTH = {

    USER                        : "USER",
    TOKEN                       : "TOKEN",
    PHOTO                       : "PHOTO",
    CRIMES_CACHE                : "CRIMES_CACHE",
    MATTERS_CACHE               : "MATTERS_CACHE",
    DISTRICT_CACHE              : "DISTRICT_CACHE",
    SEARCH_JUDGMENTS_CACHE      : "SEARCH_JUDGMENTS_CACHE",
    PUBLICATIONS_CACHE          : "PUBLICATIONS_CACHE",
    REDIRECT_AFTER_AUTHENTICATE :"REDIRECT_AFTER_AUTHENTICATE"
};

export const create = (data) =>{
   
    localStorage.setItem(AUTH.TOKEN,data.token);
    localStorage.setItem(AUTH.USER,JSON.stringify(data.user));
    // localStorage.setItem(AUTH.PHOTO,data.photo)

    return; 
}

export const is_authenticated = () => get_user() !== null && get_token().trim() !== null;

export const auth_delete = () => localStorage.clear();

export const get_token = () => localStorage.getItem(AUTH.TOKEN);

export const get_user = () => localStorage.getItem(AUTH.USER) !== null ? JSON.parse(localStorage.getItem(AUTH.USER)): null;

export const get_photo = () => localStorage.getItem(AUTH.PHOTO);
