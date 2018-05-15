import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { loginData } from './loginReducer';

// combine all reducer
const rootReducer = combineReducers({
    form: formReducer,
    loginData
  });

export default rootReducer;