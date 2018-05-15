import React from 'react';
import TextField from 'material-ui/TextField';

// resuable input field for redux field component
export const Input = ({
    input,
    label,
    type = 'text',
    meta: { touched, error, warning }
  }) => (
    <TextField
    hintText={`Enter your ${label}`}
    floatingLabelText={label}
    {...input}
    type={type}
    fullWidth={true}
    errorText={touched && error ?  error : null}
     />
  )