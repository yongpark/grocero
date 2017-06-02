import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import merge from 'lodash/merge';
import TextField from 'material-ui/TextField';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Card, CardTitle} from 'material-ui/Card';
import {grey50} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

class GItemCreateForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      show: false,
      gitem: props.gitem
    };
    //this.copyState = this.copyState.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.handleDatepickerOnShow = this.handleDatepickerOnShow.bind(this);
    this.handleDatepickerOnClose = this.handleDatepickerOnClose.bind(this);
    this.reset = this.reset.bind(this);
    this.initialState = this.state.gitem;
    this.formatDateString = this.formatDateString.bind(this);
    this.clearDate = this.clearDate.bind(this);
  }

   componentDidMount() {
     document.addEventListener('click',
       this.handleClickOutside, true);
     //this.copyState();
   }

   componentWillUnmount() {
     document.removeEventListener('click',
     this.handleClickOutside, true);
   }

  //  copyState(){
  //    const initialState = this.state;
  //  }

   reset() {
      this.setState({gitem: this.initialState});
    }

   handleClickOutside(event) {
     console.log(this.datepickerOpen);
     if (this.datepickerOpen) {
       return;
     }
     const domNode = ReactDOM.findDOMNode(this);
     if (!domNode || !domNode.contains(event.target)) {
         this.hide();
     }
   }

   componentWillReceiveProps(newProps) {
     this.setState({ gitem: newProps.gitem });
   }

   show(e){
     this.refs.create2.style.display = 'flex';
     e.stopPropagation();
     this.setState({show: true});
   }

   hide(){
     this.refs.create2.style.display = 'none';
     this.setState({
       show: false,
       gitem: this.props.gitem
     });
   }
   //
  //  handleChange = (event, date) => {
  //    this.setState({
  //      controlledDate: date,
  //    });
  //  };

  update(prop){
    return e => {
      const gitem = merge({}, this.state.gitem, {
        [prop]: e.target.value
      });
      this.setState({gitem});
    };
  }

    updateDate(e, date){
      let formattedDate = moment(date).format("YYYY-MM-DD");
      const gitem = merge({}, this.state.gitem, {expire_date: formattedDate});
      this.setState({gitem}).then(() => this.handleDatepickerOnClose());
     //  debugger;
    }

   handleSubmit(e){
     e.preventDefault();
     if(this.state.gitem){
       this.props.createGItem(this.state.gitem).then(this.setState({gitem:this.initialState})).then(this.reset).then(this.clearDate).then(this.hide);
     }
   }

   handleDatepickerOnShow(e){
     this.datepickerOpen = true;
   }

   handleDatepickerOnClose(e){
     this.datepickerOpen = false;
   }

   formatDateString(date){
     let parsedDate = Date.parse(date);
     let newDate = new Date(parsedDate);
     newDate.setHours(0, 0, 0, 0);
     console.log(newDate);
   }

   clearDate (event) {
       event.preventDefault();

       // We manually reach into the composed component and set it's date to null.
       let newDate = null;
       this.refs.datePicker.setState({
           date: newDate
       }, () => {
           this.refs.datePicker.props.onChange(null, newDate);
       });
   }

  //  this.renderCreateForm = this.state.gitem.column_title === 'To Buy' || this.state.gitem.column_title === 'Bought'

   render(){
     if(this.state.gitem.column_title === 'To Buy' || this.state.gitem.column_title === 'Bought'){
     return(
     <ul onClick={this.show} className='gitem-index-container'>
       <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
         <Card className="gitem-create">
           <CardTitle title="Add a Grocery Item..." titleStyle={{ fontSize: 18, color: grey50}}/>
         </Card>
       </MuiThemeProvider>
       <div className="list-create-container" ref='create2'>
         <form onSubmit={this.handleSubmit}>
           <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
             <Card>
               <CardTitle className="card-subtitle" title="Grocery Item" subtitle="Grocery Name" titleStyle={{ fontSize: 18, color: grey50 }}/>
                 <TextField
                   id="titleinput"
                   type="text"
                   placeholder="Add a Grocery Item"
                   onChange={this.update('title')}
                   value={this.state.gitem.title}
                 />
               <DatePicker className="grocery-item-datepicker" onTouchTap={this.handleDatepickerOnShow}
               onChange={this.updateDate}
               ref="datePicker"
               value={this.state.gitem.expire_date ? new Date(this.state.gitem.expire_date) : null}
               onDismiss={this.handleDatepickerOnClose}
               container="inline" mode="landscape"/>
             <RaisedButton ref="button" type="submit" secondary={true} label="Save"/>
           </Card>
           </MuiThemeProvider>
         </form>
       </div>
     </ul>
   );}
   return(
     <ul></ul>
   );
  }
}

export default GItemCreateForm;
