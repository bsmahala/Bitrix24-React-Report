import axios from 'axios';
import { dispatchLogout } from '../actions/loginLogoutActions'
import { getToken } from '../utility/localStorageUtility';
// http client interceptor request and set header
class HTTPActionResponse {
    constructor(req) {
        this.req = req;
    }
    // public function avalibale after get and post
    then(call) {
        return dispatch => {
            this.dispatch = dispatch;
            this.okCall = data => {
                call(dispatch, data);
            }
            this.hit();
        };
    }
    // middle ware to check request , intercept request
    middleWare({ headers, config, data }) {
        const { statusCode, result, error } = data;
        try {
            if (statusCode + "" !== "200") {
                this.statusCodeHandler(statusCode, error);
            } else if (statusCode + "" === "200") {
                this.okCall(result);
            }
        } catch (e) {
            console.error(e);
        }
    }
   // set error code for unauth
    statusCodeHandler(status, error) {
        console
        if (error) {
            if(error === 'UserNotAuthrize') {
                alert("User not Authrize")
                dispatchLogout(this.dispatch);
            }
        }
    }

    middleWareError(response) {
            alert( "Network Unreachable" );
            return;
    }
   // call api 
    hit() {
        this.req
            .then((this.middleWare.bind(this)))
            .catch(this.middleWareError.bind(this));
    }
    // public function avalibale after get and post
    ok(actionName, success) {
        return dispatch => {
            this.dispatch = dispatch;
            this.okCall = data => {
                dispatch({ type: actionName, payload: data });
                if (success)
                success(data);
            }
            this.hit();
        };
    }
}

// interface class with defination
class HttpClient {
    get(url) {
        var headers = { headers: { Authorization: getToken() } };
        return new HTTPActionResponse(axios.get(url, headers));
    }
    post(url, data) {
        var headers = { headers: { Authorization: getToken() } };       
        return new HTTPActionResponse(axios.post(url, data, headers));
    }
}


// singleton instace for http client
const httpClient = new HttpClient();
//exported
export { httpClient };