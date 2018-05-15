import React from 'react';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
  import { Field, reduxForm, formValueSelector  } from 'redux-form'
  import { Input } from '../common-component/FormComponent';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { Validation } from '../utility/validationUtility';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

const http = (url, callback) => {
  axios.get(url).then(callback);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var columnDefs = [
  {headerName: "DEPARTMENT", field: "DEPARTMENT", rowGroup:true, visible: false},
  {headerName: "NAME", field: "NAME"},
];



var gridOptions = {
  columnDefs: columnDefs,
  animateRows: true,
  enableRangeSelection: true,
  rowData: null,
  enableSorting:true,
  enableFilter:true
};


// add user component
class Confirugation extends React.Component {
  constructor(props) {
    super(props);
    var columns = [
      ...columnDefs,
      {headerName: "LEADCOUNT", field: "LEADCOUNT"},
    ];
    this.state = {columnDefs: columns, user: [], department : [], lead : [], rowData: [] };
  }
  
  componentWillMount(){
   
  }

  componentWillReceiveProps({change, location, fo}){
    if(!fo.code)
     return;
    
    if(!fo.authtoken) {
      const url = fo.rooturl+`oauth/token/?grant_type=authorization_code&client_id=${fo.clientid}&client_secret=${fo.clientsecret}&scope=application_permissions&code=${fo.code}`;
      http(url, (callback)=>{
           console.log(url)
           change('authtoken', callback.data.access_token);
      })
    }
  }

  buildGroup() {
    const { user, department, lead } = this.state;
    if(user.length > 0 && department.length > 0 && lead.length > 0 ) {
      
      var departmentReducer = {};
      var leadReducer = {};
      var gridData = [];
      department.map(e=>{
        departmentReducer[e.ID+''] = e.NAME;
      })      
      lead.map(e=>{
        var tem = leadReducer[e.ASSIGNED_BY_ID+'']
        if(tem) {
          tem.push(e);
          return;
        }        
        leadReducer[e.ASSIGNED_BY_ID+''] = [e];
      })
      user.map(e=>{
        var led = leadReducer[e.ID+''];        
        gridData.push({
          NAME : e.NAME,
          DEPARTMENT : departmentReducer[e.UF_DEPARTMENT.length>0 ? e.UF_DEPARTMENT[0] : ''] || '',
          LEADCOUNT : led ?  led.length : 0  
        });
      })
      console.log(gridData, lead);
      this.setState({rowData : gridData})
    }
  }

  componentDidMount(){
    const {change, location, fo} = this.props;  
    let it = localStorage.getItem('sec');
    if(it) {
      it = JSON.parse(it);
      change('clientid', it.clientid)
      change('rooturl', it.rooturl)
      change('clientsecret', it.clientsecret)
      const code  = getParameterByName('code', location.search);
      if(code) {
        change('code', code)
        //change('authtoken', '957efa5a00264da8002560f800000004282300ec5992fefaa5c2ede7abe8437c47a73d')
      }
    }
    
  }
  fetchDe({authtoken, rooturl}) {
    let url = rooturl+`rest/department.get.json?auth=${authtoken}&select[]=ID,NAME,PARENT`;
    http(url, (res)=>{
      this.setState({department: res.data.result})
      this.buildGroup();
    })
    url = rooturl+`rest/user.get.json?auth=${authtoken}&select[]=ID,ACTIVE,EMAIL,NAME,LAST_NAME,UF_DEPARTMENT`;
    http(url, (res)=>{
      this.setState({user: res.data.result})
      this.buildGroup();
    })
    url = rooturl+`rest/crm.lead.list.json?auth=${authtoken}`;
    http(url, (res)=>{
      this.setState({lead: res.data.result})
      this.buildGroup();
    })
}

  submitForm(data) {
    let it = localStorage.setItem('sec', JSON.stringify(data));
    const url = data.rooturl+'oauth/authorize/?response_type=code&client_id='+data.clientid+'&redirect_uri=http://localhost:3000/#/admin/config?redmi=2323&';
    window.location.href = url;    
  }

  render() {

    const { handleSubmit, match, fo } = this.props;
    return (
        <div>
         <form onSubmit={handleSubmit(this.submitForm.bind(this))}>
         <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false}>
                    <TableRowColumn><Field name="clientid" label="Client Id" component={Input}  /></TableRowColumn>
                    <TableRowColumn><Field name="rooturl" label="Root URL" component={Input}  /></TableRowColumn>
                    <TableRowColumn><Field name="clientsecret" label="Client Secret" component={Input}  /></TableRowColumn>
                </TableRow>
            </TableBody>            
         </Table>
            <div className="btncontainer">
                <RaisedButton type="submit" label='Fetch Auth Token' primary={true} />
            </div>
            <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false}>
                    <TableRowColumn><Field name="code" label="code" component={Input}  /></TableRowColumn>
                    <TableRowColumn><Field name="authtoken" label="authtoken" component={Input}  /></TableRowColumn>
                </TableRow>
            </TableBody>            
         </Table>
         </form>
         <div className="btncontainer">
                <RaisedButton type="department" disabled={!fo.authtoken} onClick={this.fetchDe.bind(this, fo)} label='Fetch DepartmentData' primary={true} />
            </div>
        
        <div className="ag-theme-balham" style={{  height: '500px' }} >
                    <AgGridReact
                        id="myGrid"
                        columnDefs={this.state.columnDefs}
                        animateRows={true}
                        enableRangeSelection={true}
                        enableSorting={true}
                        enableFilter={true}
                        rowData={this.state.rowData}>
                    </AgGridReact>
                </div>
        </div>
    );
  }
}
// valid user field
const validate = values => {
    const errors = {}
    Validation.required(values, errors, 'firstname');
    Validation.required(values, errors, 'lastname');
    Validation.required(values, errors, 'country');
    Validation.validURL(values, errors, 'linkedinurl');
    Validation.validURL(values, errors, 'portfoliourl');

    const skillArrayErrors = [];
    (values.skills || []).forEach((skill, index) => {
      const skillErrors = {}
      Validation.required(skill, skillErrors, 'skill');    
      Validation.required(skill, skillErrors, 'year');
      Validation.validURL(skill, skillErrors, 'samplecodeurl');
      skillArrayErrors[index] = skillErrors;
    });
    if (skillArrayErrors.length>0) {
        errors.skills = skillArrayErrors
      }
    return errors;
  }


  const selector = formValueSelector('config_form');

  // add user component
  Confirugation = reduxForm({
    form: 'config_form',
    enableReinitialize: true,
    validate
})(Confirugation);

export default connect(state=>({ fo: selector(state, 'rooturl', 'code', 'authtoken', 'clientid', 'clientsecret') }), {})(Confirugation);