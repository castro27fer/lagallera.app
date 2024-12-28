import React, { useEffect, useState } from 'react'
import Form from './Form'
import { get_municipalities } from '../../api';

function FormProfile({ loader }) {

    const [departments,set_departaments] = useState([]);
    const [municipalities,set_municipalities] = useState([]);
    const [disabled,setDisabled] = useState(true);
 

    const onChangeDepartment = (data) =>{
        get_municipalities(data.value).then(municipalities =>{
            set_municipalities(()=>municipalities.map(municipality => {
                return {
                    value : municipality.id,
                    label : municipality.text,
                }
            }));
        })
    }

    const onsuccess = (response)=>{
        setDisabled(()=>true)
    }

    const changeDisabled = (e) =>{
        setDisabled(()=> false);
    }

    const onCancel = (e)=>{
        setDisabled(()=> true);
    }

    useEffect(()=>{
        set_departaments(()=> loader.data.departments.map(department =>{
            return {
                value : department.id,
                label : department.text,
            }
        }));

        set_municipalities(()=> loader.data.municipalities.map(municipality =>{
            return{
                value : municipality.id,
                label : municipality.text
            }
        }))

    },[loader])

  return (
    <Form 
        url={`user/profile/infoUser`} 
        method='PUT'
        onSuccess = {onsuccess}
    >
        <Form.Input 
            name            =   { "emial" }
            label           =   { 'Correo Electronico' }
            placeholder     =   { 'Escribe tu correo' }
            required        =   { true }
            min             =   { 0 }
            max             =   { 255 }
            cols            =   { 1 }
            value           =   {  loader.data.user.name }
            disabled = { disabled }
        />

        <Form.Input 
            name        = { "lastName" }
            label       = { 'Apellidos' }
            placeholder = { 'Escribe tus apellidos' }
            required    = { true }
            min         = { 0 }
            max         = { 255 }
            cols        =   { 1 }
            value           =   {  loader.data.user.lastName }
            disabled = { disabled }
        />

        <Form.InputDate 
            name            = { "birthday" }
            type            = { 'date' }
            label           = { 'Fecha Nacimiento' }
            placeholder     = { 'Ingrese su fecha de nacimiento' }
            required        = { false }
            max             = { 10 }
            cols            = { 1 }
            value           =   {  loader.data.user.birthday ? loader.data.user.birthday.substring(0,10) : "" }
            disabled = { disabled }
        />

        <Form.InputPhone 
            name            = { "numberPhone" }
            label           = { 'Número Teléfonico' }
            placeholder     = { 'Ingrese su número teléfonico' }
            required        = { false }
            min             = { 8 }
            max             = { 20 }
            cols            =   { 1 }
            value           =   {  loader.data.user.numberPhone }
            disabled = { disabled }
        />

        <Form.Select 
            name            =   { 'departmentId' }
            label           =   { 'Departamento' }
            placeholder     =   { 'Seleccione el departamento' }
            required        =   { false }
            options         =   { departments }
            onChange        =   { onChangeDepartment }
            cols            =   { 1 }
            defaultValue    =   { loader.data.user.departmentLabel }
            disabled = { disabled }
        />

        <Form.Select 
            name            =   { 'municipalityId' }
            label           =   { 'Municipio' }
            placeholder     =   { 'Seleccione el municipio' }
            required        =   { false }
            options         =   { municipalities }
            // onChange        =   { (data) => data }
            cols            =   { 1 }
            defaultValue    =   { loader.data.user.municipalityLabel }
            disabled = { disabled }
        />

        <Form.Textarea 
            name        = { "address" }
            label       = { 'Domicilio' }
            placeholder = { 'Ingrese su domicilio' }
            rows        = { 5 }
            max         = { 255 }
            required    = { false }
            cols            =   { 2 }
            value           =   {  loader.data.user.address }
            disabled = { disabled }
        />

            <Form.Button type='submit' name='save' title='Guardar' variant='success' cols={1} displayBlock={!disabled} />
            <Form.Button type="button" name='cancel' title='Cancelar' variant='danger' cols={1} displayBlock={!disabled} onClick={onCancel}/>
            <Form.Button type='button' name='edit' title='Editar' variant='secondary' cols={1} displayBlock={disabled} onClick={changeDisabled}  />
        
        
    </Form>
  )
}

export default FormProfile