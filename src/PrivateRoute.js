import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';



// validation login for route
let PrivateRoute = ({ loginData, component: Component, ...rest }) => {
 

  return <Route {...rest} render={(props) => {
        if(loginData && loginData.token) {
          return <Component {...props} />;
        } else {
          return <Redirect to='/login' />;
        }
    }} />
  }

// connect with redux
  PrivateRoute = connect((state)=>({loginData : state.loginData}))(PrivateRoute);

export default PrivateRoute;