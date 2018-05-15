import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Route from './Route';
// store and reducer 
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// all reducer
import rootReducer from './reducers'
import thunk from 'redux-thunk';
// store with thunk middleware
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);

// boostrap component
class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <MuiThemeProvider>
          <div className="container">
          <Route />        
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}





export default App;
