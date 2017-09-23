
import React from 'react';
import PropTypes from 'prop-types'; 
var createReactClass = require('create-react-class');

const CInput = createReactClass({
    propTypes: {
        placeHolder: PropTypes.string,
        iStyle: PropTypes.object,
        error: PropTypes.string,
        OnChange: PropTypes.func.isRequired,
        type: PropTypes.string,
        showError: PropTypes.bool,
        regexType: PropTypes.string,
        value: PropTypes.string,
        clear: PropTypes.bool,
        disabled: PropTypes.bool,
        setValue: PropTypes.string,
        OnKeyPress: PropTypes.func,
        ClassName: PropTypes.string
    },
    getInitialState(){
        return{
            placeHolder: this.props.placeHolder || '',
            iStyle: this.props.iStyle ,
            required: this.props.required || false,
            error: this.props.error || 'Field cannot be blank',
            onChange: this.props.OnChange,
            type: this.props.type || 'text',
            isError: false,
            showError: false,
            value: this.props.value || '',
            oldValue: '',
            regexType: this.props.regexType || '',
            errorCopy: this.props.error || 'Field cannot be blank',
            disabled: this.props.disabled || false,
            setValue: this.props.setValue || '',
            clear: false,
            onKeyPress: this.props.OnKeyPress,
            ClassName: this.props.ClassName || ''
        };
    },
    componentWillReceiveProps(newprops){
        if(!this.state.value.length){
            this.setState({ showError: newprops.showError , isError: newprops.showError });
        }
        if(typeof(newprops.disabled) !== 'undefined'){
            this.setState({ disabled : newprops.disabled });
        }
        if(newprops.setValue && newprops.setValue.length){
            this.setState({ value : newprops.setValue });
        }
        if(newprops.clear === true){
            this.setState({value: ''});
            this.setState({clear:false});
        }
    },
    testPattern: function(value){
        let regexParser;
        switch(this.state.regexType.toLowerCase()){
            case 'fullname':
                regexParser = new RegExp(/^[a-zA-Z]+['\s]?[a-zA-Z ]+$/);
                return regexParser.test(value);
            case 'email':
                regexParser = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|io|info|mobi|name|aero|jobs|museum|in)\b/);
                return regexParser.test(value);
            case 'number':
                regexParser = new RegExp(/^\d+$/);
                return regexParser.test(value);
            case 'mobile':
                regexParser = new RegExp(/^(?:(?:\+|0{0,2})91(\s*\s*)?|[0]?)?[789]\d{9}$/);
                return regexParser.test(value);
            default:
            return false
        }
    },
    onEnterPress(event){
        console.log(this.state.value);
        console.log(event.charCode);
        if(event.charCode === 13){
            console.log('enter pressed');
        }
    },
    validate: function(event) {
        const value = event.target.value;
        this.setState({ value: value });
        if(this.props.required){
            if(this.state.regexType.length){
                console.log("this.testPattern(value)",this.testPattern(value));
                if(this.state.regexType === 'password'){
                    if(value.length < 8){
                        this.setState({ isError: true , error : `Password should be minimum 8 characters` });
                        this.state.onChange( { isValid: false, value: value } );
                    } else{
                        this.setState({ isError: false , error: this.state.errorCopy, oldValue: value });
                        this.state.onChange( { isValid: true, value: value } );
                    }
                }else{
                    if(this.testPattern(value)){
                        this.setState({isError: false});
                        //this.setState({ isError: false , error: this.state.errorCopy, oldValue: value });
                        this.state.onChange( { isValid: true, value: value } );
                    } else{
                        this.setState({isError: true});
                        //this.setState({ isError: true , error : `Not an valid ${this.state.regexType} format` });
                        this.state.onChange( { isValid: false, value: value } );
                    }
                }
               
            } else if(value && value.length){
                this.setState({ isError : false , showError: false, oldValue: value  });
                if(typeof this.state.onChange === 'function'){
                    this.state.onChange( { isValid: true, value: value } );
                }
            } else{
                this.setState({ isError : true , showError: true });
                if(typeof this.state.onChange === 'function'){
                    this.state.onChange( { isValid: false, value: value } );
                }
            }
        }else{
            if(typeof this.state.onChange === 'function'){
                this.state.onChange( { isValid: true, value: value } );
            }
        }
    },
    render(){
        //const container = {  position: 'relative', color: '#9b9b9b', fontSize: '12px' }
        const input = { border: '0', borderBottom : this.state.isError ? '1px solid rgb(156, 81, 71)' : 'solid 1px #dedede' }
        let style = this.state.ClassName.length ? {} : input;
        
        return(
            <div className="pos-rel">
                <input className={this.state.ClassName} disabled={this.state.disabled} clear={this.state.clear} value={this.state.value} type={this.state.type} placeholder={this.state.placeHolder}
                style={ input } onBlur={this.validate} onChange={(event) => this.validate(event)} onKeyPress={(event)=>this.onEnterPress(event)}/>
                                
                {(this.state.regexType === 'password' && this.state.isError)&&
                    <span className="cinput-span-error" >{ this.state.error }</span>
                }
            </div>
        );
    }
});

export default CInput;