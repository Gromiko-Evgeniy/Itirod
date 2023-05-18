import React, {useContext, useEffect, useState} from 'react'
import LabeledSelect from '../../components/UI/select/LabeledSelect'
import StyledButton from '../../components/UI/button/StyledButton'
import {UserContext} from '../../contexts/UserContext'
import {DepartmentsContext} from '../../contexts/DepartmentsContext'
import { EventContext } from '../../contexts/EventContext'
import {useNavigate} from 'react-router-dom'
import * as GoogleAPI from'../../api/GoogleAPI'
import { users } from '../../api/AllUsers'
import './Login.css'
import LabeledInput from '../../components/UI/input/LabeledInput'

export default function Login() {

  const navigate = useNavigate()
  const {user, setUser} = useContext(UserContext);
  const [currUser, setCurrUser] = useState({
    email: '',
    password: ''
  });
  const [notFound, setNotFound] = useState(false);
  const {departments, setDepartments} = useContext(DepartmentsContext);
  const {events, setEvents} = useContext(EventContext);
  const [media, setMedia] = useState(
    window.matchMedia("(max-width: 550px)").matches ? '' : 'one_rem');

  useEffect(()=>{
    GoogleAPI.Init()

    window
      .matchMedia("(max-width: 550px)")
      .addEventListener('change', e => setMedia( e.matches ? 'one_rem' : '' ))
  }, [])
  

  return (
    <form className={'centered '+ media}>
      <h1>Log in</h1>   

      {notFound && <p> Not Found </p>}

      <StyledButton 
        margin='20px'
        onClick={e=> {e.preventDefault(); console.log(events) }} 
        text='events'
      />
    
      <LabeledInput 
        value={currUser.email} 
        onChange={e=>setCurrUser({...currUser, email: e.target.value})} 
        label='email'
      />

      <LabeledInput 
        value={currUser.password} 
        onChange={e=>setCurrUser({...currUser, password: e.target.value})} 
        label='password'
      />
                
      {/* <LabeledSelect 
        value={user.isAdmin ? 'admin' : 'user'} 
        onChange={e=>setUser({...user, isAdmin: e.target.value==='admin'})}
        label='role' 
        options={[
          {value:'user', id:'1', name:'user'},
          {value:'admin', id:'2', name:'admin'},
        ]}
      />
    
      {!user.isAdmin && 
        <LabeledSelect 
          label='department'
          options={departments.map(department=>{ return {value: department.name, id: department.id, name: department.name}})}
          value={user.department} 
          onChange={e=>setUser({...user, department: e.target.value})}
        /> 
      } */}
    
      <StyledButton 
          margin='20px'
          onClick = { e => {
            e.preventDefault();
            const userfound = users.find(u=> (u.email === currUser.email) && (u.password === currUser.password))
            if(userfound === undefined) {
              setNotFound(true)
            }
            else {
              if(userfound.department === 'none') setUser({isAdmin: true, department: 'none'})
              else {
                setUser({isAdmin: false, department: userfound.department})
              }
              GoogleAPI.AuthenticateAndExecute( async () => {
              const newevents = await GoogleAPI.GetEvents() 
              setEvents(newevents)
              navigate('/calendar')
              console.log(events)
            })
            }
          }}
          text='Log in'
        />

    </form>
  )
}
