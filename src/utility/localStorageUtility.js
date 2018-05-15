    // key for localstore for token
    const toeknKey = 'TXUb2tbktleQ';
    let token = null;

    // remove all token
    export const removeAll = () => {
        localStorage.removeItem(toeknKey);
        token = undefined;
    }

    // get token
    export const getToken = () => {
            if(token) {
                    return token;
            }
            let dat = localStorage.getItem(toeknKey);
            if(dat)
            token = window.atob(dat);
            console.log(token);
            return token;
    }

    // save token
    export const saveToken = data => {
        token = data;
        localStorage.setItem(toeknKey, window.btoa(data));
    }
    