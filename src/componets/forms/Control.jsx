import React,{ useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Select2 from 'react-select'

export class Control extends React.Component{

    validations = []

    constructor(props){

        super(props);

        const { 
            name,label,value,maxLength,minLength,disabled,errorMessage,isInvalid,isValid,
            onChange,onValid,onBlur,required,rows,defaultValue,options,placeholder
        } = props;

       this.state = {
            name,label,value,disabled,errorMessage,isInvalid,isValid,
            onChange,onValid,required,onBlur,options,maxLength,minLength,
            rows,defaultValue,placeholder 
        };

        this.validations.push({ id : 1, conditional: (value) => value.trim() !== "", message:"Campo requerido."});
    }

    validate(){

        //validar el maximo sin importar si el campo es requerido o no
        if(this.state.value){
            
            if(this.state.value.length > this.state.maxLength){
                // valid = false;
                this.setState({
                    isInvalid: true,
                    isValid: false,
                    errorMessage: `Maximo ${this.state.maxLength} carácteres`
                },()=>{
                    this.state.onValid({ name : this.state.name,valid : false});
                });
                return;
            }
        }
        
        if(this.state.required){

            let valid = true;
            let message = "";

            for(let i = 0; i < this.validations.length; i++){
                if(!this.validations[i].conditional(this.state.value)){
                    valid = false;
                    message = this.validations[i].message;
                    break;
                }
            }

            this.setState({ 
                isInvalid: !valid,
                isValid: valid,
                valid:valid,
                errorMessage : message 
            },()=>{
                this.state.onValid({ name : this.state.name,valid : valid});
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        
        let changeDetect = {};

        const validProp = (json,prevProps,state,namevalue) =>{
            if (prevProps[namevalue] !== undefined && prevProps[namevalue] !== state[namevalue]) {
                json[namevalue] = prevProps[namevalue];
            }
            return json;
        }

        changeDetect = validProp(changeDetect,prevProps,this.state,"isInvalid");
        changeDetect = validProp(changeDetect,prevProps,this.state,"isValid");
        changeDetect = validProp(changeDetect,prevProps,this.state,"errorMessage");
        changeDetect = validProp(changeDetect,prevProps,this.state,"disabled");
        changeDetect = validProp(changeDetect,prevProps,this.state,"options");
        changeDetect = validProp(changeDetect,prevProps,this.state,"defaultValue");
        

        if(Object.keys(changeDetect).length > 0){
            this.setState(changeDetect);
        }
    }
    
    onBlur = (e) => this.validate();

    onChange = (e) => {
        this.setState({ value: e.target.value },()=>{
            this.validate();
            this.state.onChange({ name: e.target.name, value: e.target.value }); 
        });
    }

    groupControl(callback){
        return (
            <span className="form-group has-float-label">
                
                {callback()}
                <Form.Label htmlFor={this.state.name}>{this.state.label} <span style={{color:"red"}}>{this.state.required ? "*" : ""}</span></Form.Label>    
                <Form.Control.Feedback id={`err_${this.state.name}`} type='invalid' style={{"fontSize":"12px",}}>{ this.state.errorMessage }</Form.Control.Feedback>
                <Form.Control.Feedback type='valid' style={{"fontSize":"12px"}}>{ "Correcto" }</Form.Control.Feedback>
            
            </span>
        )
    }

    control = (type,as) =>{
        return this.groupControl(() =>{
            return(
                <Form.Control 
                    id          =   {`${this.state.name}` } 
                    as          =   {as}
                    type        =   { type }
                    name        =   { this.state.name } 
                    placeholder =   { this.state.placeholder } // Agregado para mostrar el placeholder
                    disabled    =   { this.state.disabled }
                    value       =   { this.state.value ? this.state.value : ""}
                    required    =   { this.state.required }
                    isInvalid   =   { this.state.isInvalid }
                    isValid     =   { this.state.isValid }
                    minLength   =   { this.state.minLength }
                    onChange    =   { this.onChange }
                    onBlur      =   { this.onBlur } 
                    rows        =   { this.state.rows }
                />
            ) 
        })
    }
}

export class InputText extends Control{
    render(){
        return this.control("text","input");
    }
}

export class InputDate extends Control{
    render(){
        this.validations.push({ id : 4, conditional: (value) => {
            //yyyy-mm-dd
            if(!(/^\d{4}-\d{2}-\d{2}$/.test(value))){ return false; }
            const dateArray = value.split("-");
            if(parseInt(dateArray[0]) < 1900 || parseInt(dateArray[0]) > 3000){ return false; }
            return true
        },message:"Fecha Invalida"});

        return this.control("date","input");
    }
}

export class InputPhone extends Control{
    render(){
        this.validations.push({ id : 5, conditional: (value) => {

            let valid = true;
            const phoneArray = value.split("");
            phoneArray.forEach(digit => {
                if(isNaN(Number(digit))){
                    valid = false; return;
                }
            });

            return valid
        },message:"Teléfono Invalido"})

        return this.control("number","input");
    }
}

export class InputPassword extends Control{
    render(){
        // this.validations.push({ id : 6, conditional: (value) => {

        //     let valid = true;
           
        //     const password = document.getElementById("confirmPassword");
        //     valid = value === password.value.trim();

        //     return valid
        // },message:"La contraseña no coincide."})

        return this.control("password","input");
    }
}

export class InputEmail extends Control{
    render(){
        this.validations.push({ id : 7, conditional: (value) => {

            let valid = true;
           
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valid = regexCorreo.test(value);

            return valid

        },message:"Correo Invalido"})

        return this.control("email","input");
    }
}

export class TextArea extends Control{
    render(){
        return this.control("text","textarea");
    }
}

export class Select extends Control{

    STATUS = {
        SUCCESS: {border:"solid 0.25px green",borderRadius:"5px"},
        DANGER: {border:"solid 0.25px red",borderRadius:"5px"}
    };

    disabled = false;

    componentDidUpdate(prevProps, prevState) {
        
        let changeDetect = {};

        const validProp = (json,prevProps,state,namevalue) =>{
            if (prevProps[namevalue] !== undefined && prevProps[namevalue] !== state[namevalue]) {
                json[namevalue] = prevProps[namevalue];
            }
            return json;
        }

        changeDetect = validProp(changeDetect,prevProps,this.state,"isInvalid");
        changeDetect = validProp(changeDetect,prevProps,this.state,"isValid");
        changeDetect = validProp(changeDetect,prevProps,this.state,"errorMessage");
        changeDetect = validProp(changeDetect,prevProps,this.state,"disabled");
        changeDetect = validProp(changeDetect,prevProps,this.state,"options");
        changeDetect = validProp(changeDetect,prevProps,this.state,"defaultValue");
        

        if(Object.keys(changeDetect).length > 0){
            this.setState(changeDetect);
        }
    }

    constructor(props){
        super(props)

        const {
            id              = "",
            name            = "",
            label           = "",
            placeholder     = "",
            required        = false,
            disabled        = false,
            defaultValue    = "",
            errorMessage    = "Campo Requerido",
            options         = [],
            onChange        = (e) => e,
            onValid         = (e) => e,
            isInvalid       = false,
            isValid         = false,
            styleValid= {}
        } = props;
        
       this.state = { id, name,label,placeholder,required,disabled,errorMessage,onChange,onValid,options,defaultValue, isInvalid,isValid,styleValid };

    }

    onChange = (data,name) => {
        this.setState({ value: data.value },()=>{
            this.state.onChange({name: name,value: data.value}); 
            this.validate();
        });
    }

    onBlur = () => this.validate()

    selectState = (isInvalid,isValid) => {
        if(isInvalid !== undefined && isValid !== undefined){
            if(!isInvalid && isValid) return  this.STATUS.SUCCESS;
            else if (isInvalid && !isValid) return this.STATUS.DANGER;
        }
        return {};
    }



    // defaultInputValue = (defaultInputValue)=>{
        
    //     if(this.state.options.length > 0){
    //         const selected = this.state.options.filter(x=> x.value === defaultInputValue);
    //         console.log(selected[0]);
    //         return selected[0].label;
    //     }
    //     return "";
    // }

    
    render(){
        return this.groupControl(() =>{
            return(
                <div style={this.selectState(this.state.isInvalid,this.state.isValid)}>
                    <Select2 
                        id                  =   { `ddl${this.state.name}` }
                        name                =   { this.state.name } 
                        placeholder         =   { this.state.placeholder }
                        required            =   { this.state.required }
                        onChange            =   { (data) => this.onChange(data,this.state.name) } 
                        isDisabled          =   { this.state.disabled }
                        escapeClearsValue   =   { true }
                        tabSelectsValue     =   { true }
                        // defaultInputValue   =   { this.state.defaultValue }//{ this.state.defaultValue === null ? "" : this.state.defaultValue }
                        defaultValue = {this.state.defaultValue}
                        // value={this.state.defaultValue}
                        options             =   { this.state.options }
                        onBlur              =   { this.onBlur }

                    />
                </div>
            ) 
        })
    }
}
