import React, { useState, useEffect, useContext } from 'react'
import MainItem from '../../components/MainItem'
import LabeledInput from '../../components/UI/input/LabeledInput'
import LabeledSelect from '../../components/UI/select/LabeledSelect'
import StyledButton from '../../components/UI/button/StyledButton'
import "../AllMeetups.css"
import * as GoogleAPI from'../../api/GoogleAPI'
import * as MeetupEventAPI from'../../api/MeetupEventAPI.js'
import {useNavigate, useLocation} from 'react-router-dom'
import {areEqual} from '../common/Calendar/CalerdarFunctionality'
import {TopicsContext} from '../../contexts/TopicsContext'
import {DepartmentsContext} from '../../contexts/DepartmentsContext'
import {EventContext} from '../../contexts/EventContext'


export default function AdminMeetups() {
  const navigate = useNavigate()
  const {state} = useLocation();
  const {departments} = useContext(DepartmentsContext);
  const {topics, setTopics} = useContext(TopicsContext);
  const {events, setEvents, getSortedByDepartmentEvents} = useContext(EventContext);
  const [meetups, setMeetups] = useState([])
  const [date, setDate] = useState(new Date())
  
  
  const [meetupData, setMeetupData] = useState({
    id: '',
    title: '',
    department: departments[0].name,
    description: '',
    topic: topics[0].name,
    start: new Date(new Date() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19),
    end: new Date(new Date() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19),
    toAdd: true
  })

  const [media, setMedia] = useState({
    vertical: true,
    fontSize: ''
  });
  
  useEffect(() => {
    GoogleAPI.Init()
    setMeetups(events.filter(event => areEqual(date, new Date(event.start.dateTime)))
                     .map( event => MeetupEventAPI.getMeetupFromEvent(event))
    )
    console.log(events.filter(event => areEqual(date, new Date(event.start.dateTime)))
    .map( event => MeetupEventAPI.getMeetupFromEvent(event)))

    if(state !== null) {
      setDate(state.date)
      setMeetupData({...meetupData, 
        start: new Date(state.date - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19),
        end: new Date(state.date - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19)
      })
      setMeetups(events.filter(event => areEqual(state.date, new Date(event.start.dateTime)))
        .map( event => MeetupEventAPI.getMeetupFromEvent(event))
      )
    }
    
    setMedia({
      vertical: window.matchMedia("(max-width: 700px)").matches,
      fontSize: window.matchMedia("(max-width: 400px)").matches ? '' : 'small_font_size'
    })

    window.matchMedia("(max-width: 700px)")
      .addEventListener('change', e => setMedia({...media, vertical: e.matches}))
    window.matchMedia("(max-width: 400px)")
      .addEventListener('change', e => setMedia({...media, fontSize: e.matches ? 'small_font_size' : ''}))
   }, [])


  const refresh =  () => GoogleAPI.AuthenticateAndExecute(
    async()=>{
      const newevents = await GoogleAPI.GetEvents() 
      setEvents(newevents)
      setMeetups(newevents.filter(event => areEqual(date, new Date(event.start.dateTime)))
                       .map( event => MeetupEventAPI.getMeetupFromEvent(event)))
    }
  )

  const AddMeetup = () => {
    GoogleAPI.createEvent(MeetupEventAPI.formEventData(meetupData))
    setEvents([...events, {
      'summary': meetupData.title,
      'description': MeetupEventAPI.groupDataInDescription(meetupData),
      'start': {
        'dateTime': meetupData.start,
        'timeZone': 'Europe/Minsk'
      },
      'end': {
        'dateTime': meetupData.end,
        'timeZone': 'Europe/Minsk'
      },
      'reminders': { 'useDefault': true }
    }])
    setMeetups([...meetups, meetupData])
  }

  const UpdateMeetup = () => {
    GoogleAPI.updateEvent(MeetupEventAPI.formEventData({
      ...meetupData,
      start: (new Date(meetupData.start)).toISOString(),
      end: (new Date(meetupData.end)).toISOString()
    }))
    setMeetups(meetups.map(m=> m.id === meetupData.id ? meetupData : m))
    setEvents(events.map(e=> e.id === meetupData.id ? 
      {
        'summary': meetupData.title,
        'description': MeetupEventAPI.groupDataInDescription(meetupData),
        'start': {
          'dateTime': meetupData.start,
          'timeZone': 'Europe/Minsk'
        },
        'end': {
          'dateTime': meetupData.end,
          'timeZone': 'Europe/Minsk'
        },
        'reminders': { 'useDefault': true }
      }
      :
      e
    ))
  }

  return (
    <div>
      <aside style={media.vertical? {position: 'relative', width: '100%'} : {}}>
        <div className={"add_container " + media.fontSize}>

          {meetupData.toAdd ? <h1>Add new meetup</h1> : <h1>Update meetup</h1>}
            
          <LabeledInput
            value={meetupData.title}
            onChange={(e)=> setMeetupData({...meetupData, title: e.target.value})}
            label='title'
          />
          <LabeledInput 
            value={meetupData.description}
            onChange={(e)=> setMeetupData({...meetupData, description: e.target.value})}
            label='description'
          />
          <LabeledInput
            value={meetupData.start}
            onChange={(e)=> setMeetupData({...meetupData, start: e.target.value})}
            type="datetime-local"
            label='start time'
          />
          <LabeledInput
            value={meetupData.end}
            onChange={(e)=> setMeetupData({...meetupData, end: e.target.value})}
            type="datetime-local"
            label='end time'
          />

          <LabeledSelect label='topic'
            onChange = {e =>{setMeetupData({...meetupData, topic: e.target.value}); console.log(e.target.value)}}
            value={meetupData.topic}
            options={topics.map(topic=>{ return {value: topic.name, id: topic.id, name: topic.name}})}
         />

          <LabeledSelect label='department' 
            onChange = {e =>setMeetupData({...meetupData, department: e.target.value})}
            value={meetupData.department}
            options={departments.map(department=>{ return {value: department.name, id: department.id, name: department.name}})} 
          /> 

          <StyledButton 
            margin='auto'
            text={meetupData.toAdd ? 'Add' : 'Update'}
            onClick={meetupData.toAdd ? AddMeetup : UpdateMeetup}
          />
          {!meetupData.toAdd && 
            <StyledButton 
              margin='auto'
              text='Back to adding' 
              onClick={()=>setMeetupData({
                title: '',
                department: '',
                description: '',
                topic: '',
                start: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19),
                end: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 19),
                toAdd: true
              })}
            />
          }


          <footer>
            <button 
              className='underline' 
              onClick={()=> navigate('/topicsDepartments')}
            > edit meetup topics and departments list </button>

            <button className='underline' onClick={()=> navigate('/calendar')}>see meetup calendar</button>
          </footer>

        </div>
      </aside>

      <main className={media.fontSize} style={media.vertical? {width: '100%'} : {}}>
        <header>
          <StyledButton onClick={refresh} text='Refresh'/>
          <StyledButton onClick={()=>navigate('/login')} text='Log out'/>
        </header>

        {meetups.map(meetup=> 
          <MainItem
            key={meetup.id} titleName='title'
            title={meetup.title} description={meetup.description}
            editHandler={()=>{setMeetupData({
              id: meetup.id,
              title: meetup.title,
              department: meetup.department,
              description: meetup.description,
              topic: meetup.topic,
              start: meetup.start,
              end: meetup.end,
              toAdd: false  
            })}}
            deleteHandler={()=>{
              GoogleAPI.deleteEvent(meetup.id)
              setMeetups(meetups.filter(m=> m.id !== meetup.id))
              setEvents(events.filter(e=> e.id !== meetup.id))
            }}
          >
            <p> topic: {meetup.topic} </p>
            <p> department: {meetup.department} </p>
            <p> date and time: {meetup.start.replace(/-/g, '.').replace('T', ' ')} </p>
          </MainItem> 
        )}  
      </main>
    </div>
  )
}
