import { loginActions } from '../actions/actionNames';
// login data reducer
export const loginData = (state={}, action) => {

    switch (action.type) {
        case loginActions.LOGIN:
            return action.payload;
        default:
            return state;
    }
}