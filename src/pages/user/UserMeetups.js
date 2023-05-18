import React, {useState, useEffect,useContext} from 'react'
import LabeledInput from '../../components/UI/input/LabeledInput'
import StyledButton from '../../components/UI/button/StyledButton'
import LabeledSelect from '../../components/UI/select/LabeledSelect'
import {useNavigate, useLocation} from 'react-router-dom'
import {areEqual} from '../common/Calendar/CalerdarFunctionality'
import * as GoogleAPI from'../../api/GoogleAPI'
import * as MeetupEventAPI from'../../api/MeetupEventAPI.js'
import {TopicsContext} from '../../contexts/TopicsContext'
import { UserContext } from '../../contexts/UserContext'
import {EventContext} from '../../contexts/EventContext'
import '../AllMeetups.css'


var meetups = []

export default function UserMeetups() {
    const navigate = useNavigate()
    const {state} = useLocation();
    const {topics, setTopics} = useContext(TopicsContext);
    const {user, setUser} = useContext(UserContext);
    const {events, setEvents, getSortedByDepartmentEvents} = useContext(EventContext);
    const [filteredMeetups, setFilteredMeetups] = useState(meetups)
    const [date, setDate] = useState(new Date())
    const [searchMeetup, setSearchMeetup] = useState({
        title: '',
        department: '',
        description: '',
        topic: ''
    })

    const [media, setMedia] = useState({
        vertical: true,
        fontSize: ''
    });

    useEffect(()=>{
        GoogleAPI.Init()
        meetups = getSortedByDepartmentEvents(user.department)
            .filter(event=> areEqual(date, new Date(event.start.dateTime)))
            .map(event=>MeetupEventAPI.getMeetupFromEvent(event))
    
        if(state !== null) {
            meetups = getSortedByDepartmentEvents(user.department)
                .filter(event=> areEqual(state.date, new Date(event.start.dateTime)))
                .map(event=>MeetupEventAPI.getMeetupFromEvent(event))
            setFilteredMeetups(meetups)
            setDate(state.date)
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

            meetups = newevents
                .filter( event => 
                    areEqual(date, new Date(event.start.dateTime))
                    &&
                    MeetupEventAPI.getInfoFromDescription('department', event) === user.department
                )
                .map( event => MeetupEventAPI.getMeetupFromEvent(event))
            setFilteredMeetups(meetups)
            console.log(meetups)
        }
    )

    return (
        <div>
            <aside style={media.vertical? {position: 'relative', width: '100%'} : {}}>
                <div className={"add_container " + media.fontSize}>
                    <h1>Search</h1>
                    
                    <LabeledInput
                        value={searchMeetup.title}
                        onChange={(e)=> setSearchMeetup({...searchMeetup, title: e.target.value})}
                        label='title'
                    />
                    <LabeledInput 
                        value={searchMeetup.description}
                        onChange={(e)=> setSearchMeetup({...searchMeetup, description: e.target.value})}
                        label='description'
                    />

                    <LabeledSelect label='topic'
                        onChange = {e =>setSearchMeetup({...searchMeetup, topic: e.target.value})}
                        value={searchMeetup.topic}
                        options={topics.map(topic=>{ return {value: topic.name, id: topic.id, name: topic.name}})}
                    />

                    <StyledButton 
                        text='Find' 
                        onClick={()=>{
                        setFilteredMeetups(meetups
                            .filter(m=> m.title.includes(searchMeetup.title) &&
                                    m.description.includes(searchMeetup.description) &&
                                    searchMeetup.topic === '' ? true : m.topic === searchMeetup.topic
                            ))
                            console.log(meetups)
                        }}
                    />

                    <StyledButton 
                    margin='10px'
                    text='Reset' 
                    onClick={()=>setSearchMeetup({
                        title: '',
                        department: '',
                        description: '',
                        topic: '',
                        toAdd: true
                    })}
                    />
                </div>
            </aside>

            <main 
                className={media.fontSize}
                style={media.vertical? {width: '100%'} : {}}
            >
                <header>
                    <StyledButton onClick={refresh} text='Refresh'/>
                    <StyledButton onClick={()=>navigate('/login')} text='Log out'/>
                </header>

                {filteredMeetups.map(meetup=> 
                    <section 
                        id={meetup.id}
                        className='userMeetup'
                    >
                        <b> title: {meetup.title} </b>
                        <p> topic: {meetup.topic} </p>
                        <p> description: {meetup.description} </p>
                        {/* <p> department: {meetup.department} </p> */}
                        <p> date and time: {meetup.start.replace(/-/g, '.').replace('T', ' ')} </p>
                    </section> 
                )}
            </main>
            
        </div>
    )
}
