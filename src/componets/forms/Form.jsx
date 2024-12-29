import React, { useEffect, useState, Children } from 'react'
import { InputDate, InputText, InputPhone, InputPassword,TextArea, Select, InputEmail } from './Control';
import axios from '../../axiosInterceptor';
import { Alert, Button } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap'

function Form({
    children,
    method      = "POST",
    url         = "/",
    name        = "",
    className   = "",
    cols        = 2,
    onSuccess   = (result) => result,
    onError     = (err) => err,

}) {

    const [message_invalid,set_message_invalid] = React.useState({show:false,message:""});

    const [valid,set_valid] = useState(false);

    const [form,set_form] = useState([]);

    const columnaMax = 12;
    const sizeColumn = columnaMax/cols;

    const handleSubmit = (event) => {

        const form2 = event.currentTarget;
        
        event.preventDefault();
        event.stopPropagation();
    
        if (form2.checkValidity() && valid){
          
          let data = {};
          
          form.forEach(field =>{ data[field.name] = field.value });

          axios({ method: method, url : url, data: data }).then((result) => {
            
            set_form((prev_form)=>{
              return prev_form.map(input =>{
                input.isInvalid = false;
                input.isValid = true;
                return input;
              });
            });

            set_message_invalid({show:false,message:""})

            onSuccess(result);
          })
          .catch(err =>{

              set_message_invalid({show:true,message:err.message})

              set_form((prev_form)=> {
                
                let form_aux = [...prev_form];

                err.validations.forEach((validation) =>{

                  const index = form_aux.findIndex(x=> x.name === validation.name);
                  let input = {...form_aux[index]};

                  input.isInvalid = true;
                  input.isValid = false;
                  input.valid = false;
                  input.errorMessage = validation.message;
                  console.log(validation.message);

                  form_aux[index] = input;

                })

                return form_aux;
              });

              onError(err)
          })
         
        }
    };

    const onValid = ({name,valid})=>{

      set_form(prev_form =>{
        const index = prev_form.findIndex(x => x.name === name);
        const update_form = [...prev_form];
        const field = {...update_form[index]};

        field.valid = valid;
        field.isInvalid = !valid;
        field.isValid = valid;

        update_form[index] = field;
        return update_form;
      });
    }

    const onchange = ({name,value}) =>{
      set_form(prev_form =>{
        const index = prev_form.findIndex(x =>x.name === name);
        const update_form = [...prev_form];
        const filed = {...update_form[index]};
        filed.value = value;
        update_form[index] = filed;
        return update_form;
      });
    }

    useEffect(()=>{
      if(Children.count(children) > 0){
        
        const fileds = Children.toArray(children.filter(x=>x.type !== Form.Button));
       
        if(form.length === 0){

          set_form(()=> fileds.map(input => {
            const field = input.props;
            return {
              name        : field.name,
              valid       : !field.required ? true : field.value !== "",
              value       : field.value,
              required    : field.required,
              minLength   : field.min,
              maxLength   : field.max,
              errorMessage: "Campo requerido",
              isInvalid   : field.isInvalid,
              isValid     : field.isValid,
              type        : input.type,
              cols        : field.cols,
              placeholder : field.placeholder,
              label       : field.label,
              options     : field.options,
              type        : field.type
            }
          }));

        }
        else{

          set_form((prev_form)=>{

            let formAux = [...prev_form];

            Children.forEach(fileds,(child,index) =>{

              let childAux = {...formAux[index]};
  
              // childAux.name = child.props.name;
              // childAux.required = child.props.required;
              // childAux.minLength = child.props.min;
              // childAux.maxLength = child.props.max;
              // childAux.cols = child.props.cols;
              // childAux.placeholder = child.props.placeholder;
              // childAux.label = child.props.label;
              childAux.options = child.props.options;
              childAux.isInvalid = child.props.isInvalid;
              childAux.isValid = child.props.isValid;

              formAux[index] = childAux;
              
            });

            return formAux;
          })
          

        }
      }
    // eslint-disable-next-line
    },[children]);

    useEffect(()=>{
      const valid_fields = form.filter(x=>x.valid === true);
      const count_fields = form.length;
      set_valid(valid_fields.length === count_fields);
    },[form]);

  return (
    <>
      <form id={name} method={method} className={className} onSubmit={handleSubmit}>
        <Row>
        {
          form.map(child =>{
            
            const input = child;
            if(child.type === "text"){
              return (
                <Col 
                  key={input.name} 
                  // xs={`${sizeColumn}`} 
                  sm={`${sizeColumn * input.cols}`} 
                  md={`${sizeColumn * input.cols}`} 
                  lg={`${sizeColumn * input.cols}`} 
                  xl={`${sizeColumn * input.cols}`} 
                  xxl={`${sizeColumn * input.cols}`} 
                  className={`mb-4`}
                >
                  <InputText 
                      key             = { input.name } 
                      id              = { `txt${input.name}` }
                      name            = { input.name } 
                      label           = { input.label } 
                      placeholder     = { input.placeholder } 
                      required        = { input.required } 
                      minLength       = { input.min }
                      maxLength       = { input.max }
                      disabled        = { input.disabled }
                      errorMessage    = { input.errorMessage }
                      isInvalid       = { input.isInvalid }
                      isValid         = { input.isValid }
                      onChange        = { (data) => onchange(data) }
                      onValid         = { onValid }
                      value           = { input.value }
                    />
                </Col>
              )
            }
            else if(child.type === Form.InputDate){
        
              return (
                <Col 
                  key={input.name} 
                  // xs={`${sizeColumn}`} 
                  sm={`${sizeColumn * input.cols} `} 
                  md={`${sizeColumn * input.cols}`} 
                  lg={`${sizeColumn * input.cols}`} 
                  xl={`${sizeColumn * input.cols}`} 
                  xxl={`${sizeColumn * input.cols}`} 
                  className={`mb-4`}
                >
                  <InputDate
                    key             = { input.name } 
                    id              = { `txt${input.name}` }
                    name            = { input.name } 
                    label           = { input.label } 
                    placeholder     = { input.placeholder } 
                    required        = { input.required } 
                    minLength       = { input.min }
                    maxLength       = { input.max }
                    disabled        = { input.disabled }
                    errorMessage         = { input.message }
                    isInvalid       = { input.isInvalid }
                    isValid         = { input.isValid }
                    onChange        = { (data) => onchange(data) }
                    onValid         = { onValid }
                    value           = { input.value }
                  />
                </Col>)
            }
            else if(child.type === Form.InputPhone){
              
              return (
                  <Col key={input.name} 
                    // xs={`${sizeColumn}`} 
                    sm={`${sizeColumn * input.cols}`} 
                    md={`${sizeColumn * input.cols}`} 
                    lg={`${sizeColumn * input.cols}`} 
                    xl={`${sizeColumn * input.cols}`} 
                    xxl={`${sizeColumn * input.cols}`} 
                    className={`mb-4`}
                  >
                    <InputPhone
                        key             = { input.name } 
                        id              = { `txt${input.name}` }
                        name            = { input.name } 
                        label           = { input.label } 
                        placeholder     = { input.placeholder } 
                        required        = { input.required } 
                        minLength       = { input.min }
                        maxLength       = { input.max }
                        disabled        = { input.disabled }
                        errorMessage    = { input.message }
                        isInvalid       = { input.isInvalid }
                        isValid         = { input.isValid }
                        onChange        = { (data) => onchange(data) }
                        onValid         = { onValid }
                        value           = { input.value }
                    />
                  </Col>)
            }
            else if(child.type === "password"){
              return (<Col key={input.name} 
                      // xs={`${sizeColumn}`} 
                      sm={`${sizeColumn * input.cols}`} 
                      md={`${sizeColumn * input.cols}`} 
                      lg={`${sizeColumn * input.cols}`} 
                      xl={`${sizeColumn * input.cols}`} 
                      xxl={`${sizeColumn * input.cols}`} 
                      className={`mb-4`}
                    >
                
                <InputPassword
                        key             = { input.name } 
                        id              = { `txt${input.name}` }
                        name            = { input.name } 
                        label           = { input.label } 
                        placeholder     = { input.placeholder } 
                        required        = { input.required } 
                        minLength       = { input.min }
                        maxLength       = { input.max }
                        disabled        = { input.disabled }
                        errorMessage    = { input.errorMessage }
                        isInvalid       = { input.isInvalid }
                        isValid         = { input.isValid }
                        onChange        = { (data) => onchange(data) }
                        onValid         = { onValid }
                        value           = { input.value }
                    />

            
              </Col>)
            }
            else if(child.type === "email"){
              return (<Col key={input.name} 
                      // xs={`${sizeColumn}`} 
                      sm={`${sizeColumn * input.cols}`} 
                      md={`${sizeColumn * input.cols}`} 
                      lg={`${sizeColumn * input.cols}`} 
                      xl={`${sizeColumn * input.cols}`} 
                      xxl={`${sizeColumn * input.cols}`} 
                      className={`mb-4`}
                    >
                
                <InputEmail
                        key             = { input.name } 
                        id              = { `txt${input.name}` }
                        name            = { input.name } 
                        label           = { input.label } 
                        placeholder     = { input.placeholder } 
                        required        = { input.required } 
                        minLength       = { input.min }
                        maxLength       = { input.max }
                        disabled        = { input.disabled }
                        errorMessage    = { input.errorMessage }
                        isInvalid       = { input.isInvalid }
                        isValid         = { input.isValid }
                        onChange        = { (data) => onchange(data) }
                        onValid         = { onValid }
                        value           = { input.value }
                    />

            
              </Col>)
            }
            else if(child.type === Form.Textarea){

              return (<Col key={input.name} 
                        // xs={`${sizeColumn}`} 
                        sm={`${sizeColumn * input.cols}`} 
                        md={`${sizeColumn * input.cols}`} 
                        lg={`${sizeColumn * input.cols}`} 
                        xl={`${sizeColumn * input.cols}`} 
                        xxl={`${sizeColumn * input.cols}`} 
                        className={`mb-4`}
                      >
                <TextArea
                    key             = { input.name } 
                    id              = { `txt${input.name}` }
                    name            = { input.name } 
                    rows            = { input.rows }
                    label           = { input.label } 
                    placeholder     = { input.placeholder } 
                    required        = { input.required } 
                    minLength       = { input.min }
                    maxLength       = { input.max }
                    disabled        = { input.disabled }
                    errorMessage         = { input.message }
                    isInvalid       = { input.isInvalid }
                    isValid         = { input.isValid }
                    onChange        = { (data) => onchange(data) }
                    onValid         = { onValid }
                    value           = { input.value }
                  />
                </Col>)
            }
            else if(child.type === Form.Select){
              
              // const input = child.props; 
              return (<Col key={input.name} 
                        // xs={`${sizeColumn}`} 
                        sm={`${sizeColumn * input.cols}`} 
                        md={`${sizeColumn * input.cols}`} 
                        lg={`${sizeColumn * input.cols}`} 
                        xl={`${sizeColumn * input.cols}`} 
                        xxl={`${sizeColumn * input.cols}`} 
                        className={`mb-4`}
                      >
                <Select
                    name            = { input.name } 
                    label           = { input.label } 
                    placeholder     = { input.placeholder } 
                    defaultValue    = { input.defaultValue }
                    required        = { input.required } 
                    disabled        = { input.disabled }
                    isInvalid       = { input.isInvalid }
                    isValid         = { input.isValid }
                    options         = { input.options }
                    onChange        = { (data) => { 
                      onchange(data); 
                      if(input.onChange !== undefined){
                        input.onChange(data)
                      }
                    }}
                    onValid         = { onValid }
                    
                  />
                </Col>)
            }
            else{
              return <p>Control not found...</p>
            }

          })
        }

        </Row>

        <Row hidden={!message_invalid.show}>
          <Alert variant='danger'>
            {message_invalid.message}
          </Alert>
        </Row>

        <Row className='justify-content-center'>
          {Children.map(children.filter(x=>x.type === Form.Button),control =>{
            
              const input = control.props;
              return (
                <Col 
                  style={{display: input.displayBlock || input.displayBlock === undefined ? "block" : "none"}}
                  sm={`${sizeColumn * input.cols}`} 
                  md={`${sizeColumn * input.cols}`} 
                  lg={`${sizeColumn * input.cols}`} 
                  xl={`${sizeColumn * input.cols}`} 
                  xxl={`${sizeColumn * input.cols}`} 
                >
                  <Button 
                    id        = { `btn${input.name}` } 
                    className = { 'w-100 mb-2' }
                    type      = { input.type } 
                    variant   = { input.variant }
                    onClick   = { input.onClick }
                  >
                    {input.title}
                  </Button>
                </Col>
              )
            
          })}
        </Row>
        
    
      </form>

    </>
  )
}

Form.Input = ({ 
    name, 
    type          = "text",
    placeholder   = "",
    label         = "",
    required      = false,
    min           = 0,
    max           = 1024,
    cols          = 1,
    value         = "",
    isInvalid     = false,
    isValid       = false

}) => {
  return { name, type, placeholder, label, required, min, max, cols, value, isInvalid, isValid };
  // return <p>probando</p>
};

Form.InputDate = ({ 
  name, 
  placeholder   = "",
  label         = "",
  required      = false,
  min           = 0,
  max           = 1024,
  cols          = 1,
  isInvalid     = false,
  isValid       = false,
  value = ""

}) => {
  return  {  name, placeholder, label, required, min, max, cols, isInvalid, isValid, value };
};

Form.InputPhone = ({ 
  name, 
  placeholder   = "",
  label         = "",
  required      = false,
  min           = 0,
  max           = 1024,
  cols          = 1,
  isInvalid     = false,
  isValid       = false,
  value = ""
}) => {
  return  { name, placeholder, label, required, min, max, cols, isInvalid, isValid,value };
};

Form.InputPassword = ({ 
  name, 
  placeholder   = "",
  label         = "",
  required      = false,
  min           = 0,
  max           = 1024,
  cols          = 1,
  isInvalid     = false,
  isValid       = false,
  value = ""
}) => {
  return  { name, placeholder, label, required, min, max, cols, isInvalid, isValid,value };
};

Form.InputEmail = ({ 
  name, 
  placeholder   = "",
  label         = "",
  required      = false,
  min           = 0,
  max           = 1024,
  cols          = 1,
  isInvalid     = false,
  isValid       = false,
  value = ""
}) => {
  return  { name, placeholder, label, required, min, max, cols, isInvalid, isValid,value };
};

Form.Textarea = ({ 
  name, 
  placeholder = "",
  label       = "",
  required    = false,
  cols        = 1,
  isInvalid     = false,
  isValid       = false,
  value = "",
  rows = 3

}) =>{
  return { name, placeholder, label, required, cols, isInvalid, isValid, value,rows }
}

Form.Select = ({ 
  name, 
  placeholder       = "",
  label             = "",
  required          = false,
  disabled          = false,
  escapeClearsValue = false,
  tabSelectsValue   = false,
  isInvalid         = false,
  isValid           = false,
  options           = [],
  onChange          = (data)=> data,
  cols              = 1,
  defaultValue = "",
  changeStatus = null,
  value = ""

}) => {
  return  { 
      name, placeholder, label, required, disabled, escapeClearsValue, tabSelectsValue, isInvalid, 
      isValid, options,onChange,cols,defaultValue,changeStatus, value 
    };
};

Form.Button = ({
  name = "",
  variant = "primary",
  title = "button",
  cols = 1,
  displayBlock = true,
  type = "button",
  onClick = (event) => event
})=>{
  return { name,variant,title,displayBlock,onClick }
}

export default Form