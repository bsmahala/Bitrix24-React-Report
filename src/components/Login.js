import React from 'react';
import { Card, CardActions, CardTitle } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form'
import { Input } from '../common-component/FormComponent';
import { Validation } from '../utility/validationUtility';
import { login, loginAction } from '../actions/loginLogoutActions';
import { saveToken } from '../utility/localStorageUtility';
import { connect } from 'react-redux';

// login compoennt
class Login extends React.Component {

  redirectToHome() {
    this.props.history.replace('/admin')
  }
  // check already login and redirect to admin route
  componentWillMount() {
    const { loginData, history } = this.props;
    if(loginData && loginData.token) {
      history.replace('/admin');
      return;
    }
  }
 // login call
  submitLogin(data) {    
    this.props.loginAction(data, (token)=>{
      saveToken(token);
      this.redirectToHome();
    });
    
  }


  render() {

    const { handleSubmit, loginData } = this.props;

    return (
      <form onSubmit={handleSubmit(this.submitLogin.bind(this))}>
      <Card className="center">
        <CardTitle title="Login" />
        <CardActions>
        <Field name="email" label="UserName" component={Input}  />
        <Field name="password" label="Password" component={Input}  />
          <RaisedButton type="submit" label="Login" primary={true} />
        </CardActions>
      </Card>
      </form>
    );
  }
}

// validation
const validate = values => {
  const errors = {}
  Validation.required(values, errors, 'email');
  Validation.required(values, errors, 'password');
  return errors
}

Login = reduxForm({
  form: 'login_from',
  validate
})(Login);

export default connect(state=>({ loginData: state.loginData }), { login, loginAction })(Login);