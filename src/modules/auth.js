
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
    localStorage.setItem(AUTH.PHOTO,data.photo)

    return; 
}

export const is_authenticated = () => get_user() !== null && get_token().trim() !== null;

export const auth_delete = () => localStorage.clear();

export const get_token = () => localStorage.getItem(AUTH.TOKEN);

export const get_user = () => localStorage.getItem(AUTH.USER) !== null ? JSON.parse(localStorage.getItem(AUTH.USER)): null;

export const get_photo = () => localStorage.getItem(AUTH.PHOTO);

export const get_matters_cache = ()=> JSON.parse(localStorage.getItem(AUTH.MATTERS_CACHE));

export const set_matters_cache = (data) => localStorage.setItem(AUTH.MATTERS_CACHE,JSON.stringify(data));

export const set_crimes_cache = (matter,data) => localStorage.setItem(`${AUTH.CRIMES_CACHE}_${matter}`,JSON.stringify(data));

export const get_crimes_cache = (matter) => JSON.parse(localStorage.getItem(`${AUTH.CRIMES_CACHE}_${matter}`));

export const set_district_cache = (data) => localStorage.setItem(AUTH.DISTRICT_CACHE,JSON.stringify(data));

export const get_district_cache = () => JSON.parse(localStorage.getItem(AUTH.DISTRICT_CACHE));

export const set_search_judgments_cache = (data) => localStorage.setItem(AUTH.SEARCH_JUDGMENTS_CACHE,JSON.stringify(data));

export const get_search_judgments_cache = () => JSON.parse(localStorage.getItem(AUTH.SEARCH_JUDGMENTS_CACHE));

export const get_publications_cache = (type,pag) => JSON.parse(localStorage.getItem(`${AUTH.PUBLICATIONS_CACHE}_${type}_${pag}`));

export const set_publications_cache = (type,pag,data) => localStorage.setItem(`${AUTH.PUBLICATIONS_CACHE}_${type}_${pag}`,JSON.stringify(data));

export const get_redirect_after_authenticate_cache = () => localStorage.getItem(AUTH.REDIRECT_AFTER_AUTHENTICATE);

export const set_redirect_after_authenticate_cache = (url) => localStorage.setItem(AUTH.REDIRECT_AFTER_AUTHENTICATE,url);

export const remove_redirect_after_authenticate_cache = () => localStorage.removeItem(AUTH.REDIRECT_AFTER_AUTHENTICATE);