import React, { useEffect, useState, useContext } from 'react'
import * as calendar from './CalerdarFunctionality.js'
import './Calendar.css';
import StyledButton from '../../../components/UI/button/StyledButton.js'
import * as GoogleAPI from '../../../api/GoogleAPI.js'
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../../../contexts/UserContext.js'
import {EventContext} from '../../../contexts/EventContext.js';
import * as MeetupEventAPI from '../../../api/MeetupEventAPI.js'



export default function Calendar() {

    const navigate = useNavigate()

    const currentDate = new Date()
    const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const weekDayNames = ['Пн', 'Вт', 'Ср', 'Чт' , 'Пт', 'Сб', 'Вс']

    const [date, SetDate] = useState(new Date()) //mounth info

    const {user, setUser} = useContext(UserContext);
    const {events, setEvents, getSortedByDepartmentEvents} = useContext(EventContext);

    const [currentEvent, SetCurrentEvent] = useState({})
    const [sortedEvents, SetSortedEvents] = useState(events)


    const [media, setMedia] = useState({
        vertical: '',
        fontSize: ''
    });

    let monthData = calendar.getMonthData(date.getFullYear(), date.getMonth())

    useEffect(()=>{
        GoogleAPI.Init()
        !user.isAdmin && SetSortedEvents(getSortedByDepartmentEvents(user.department))

        setMedia({
            vertical: window.matchMedia("(max-width: 550px)").matches ? 'vertical' : 'space_between',
            fontSize: window.matchMedia("(max-width: 450px)").matches ? 'small_font_size' : '',
        })

        window.matchMedia("(max-width: 550px)")
            .addEventListener('change', e => setMedia({...media, vertical: e.matches ? 'vertical' : 'space_between'}))
        window.matchMedia("(max-width: 450px)")
            .addEventListener('change', e => setMedia({...media, fontSize: e.matches ? 'small_font_size' : ''}))

    }, [])
    
    const handlePrevMonthButtonClick = () => {
        SetDate(new Date(date.getFullYear(), date.getMonth() - 1))
        refresh()
    }

    const handleNextMonthButtonClick = () =>  {
        SetDate(new Date(date.getFullYear(), date.getMonth() + 1))
        refresh()
    }

    const handleDayClick = date => {
        user.isAdmin ?
        navigate(
            '/adminMeetups',
            {state: { date: date }}
        )
        :
        navigate(
            '/userMeetups',
            {state: { date: date }}
        )
    }

    const refresh = () => GoogleAPI.AuthenticateAndExecute(async()=>
    {
        const newEvents = await GoogleAPI.GetEvents()
        setEvents(newEvents)
        SetSortedEvents(newEvents)

        console.log(events)
    })

    const DragOverHandler = (e) => {
        e.preventDefault()
        e.target.style.backgroundColor = '#eaeaea'
    }

    const DragLeaveHandler = (e) => {
        e.preventDefault()
        e.target.style.backgroundColor = 'white'
    }

    const DropHandler = (e, date) => {
 
        e.preventDefault()
        setEvents(events.map( event => {
            if(event.id === currentEvent.id){
                const startDate = new Date(event.start.dateTime)
                const endDate = new Date(event.end.dateTime)

                startDate.setDate(date.getDate())
                endDate.setDate(date.getDate())

                event.start.dateTime = startDate.toISOString()
                event.end.dateTime = endDate.toISOString()
                SetCurrentEvent(event)
                return event
            }
            return event
        }))
        SetSortedEvents(events)
        e.target.style.backgroundColor = 'white'

        GoogleAPI.updateEvent({
            id: currentEvent.id,
            title: currentEvent.summary,
            description: currentEvent.description,
            start: currentEvent.start.dateTime,
            end: currentEvent.end.dateTime
        })
    }
    

    return (
        <div className={"calendar" + media.fontSize}>
            <div className="header">
                <div className='vertical'>
                    <StyledButton onClick={()=>navigate('/login')} text='Log out'/>
                    <StyledButton onClick={handlePrevMonthButtonClick} text='<'/>
                </div>
                <div className={media.vertical}>
                    <select
                        value={date.getMonth()}
                        onChange={event => {
                            SetDate(new Date(date.getFullYear(), event.target.value))
                            refresh()
                        }}
                    >
                        {monthNames.map((name, index) =>
                            <option key={name} value={index}>{name}</option>
                        )}
                    </select>

                    <select
                        value={date.getFullYear()}
                        onChange={event => {
                            SetDate(new Date(event.target.value, date.getMonth()))
                            refresh()
                        }}
                    >
                        {years.map(year =>
                            <option key={year} value={year}>{year}</option> 
                        )}
                    </select>
                </div>

                <div className='vertical'>
                    <StyledButton onClick={refresh} text='Refresh'/>
                    <StyledButton onClick={handleNextMonthButtonClick} text='>'/>
                </div>
            </div>

            <table>
                <thead>
                    <tr className="week">
                        {weekDayNames.map(name =>
                            <th className='day' key={name}>{name}</th>    
                        )}
                    </tr>
                </thead>

                <tbody>
                    {monthData.map((week, index) =>
                        <tr key={index} className="week">
                            {week.map((date, index) => date ?
                                <td
                                    key={index}
                                    className={calendar.areEqual(date, currentDate) ? 'day today' : 'day' }
                                    onClick={() => handleDayClick(date)}
                                    onDrop={e => DropHandler(e, date)}
                                    onDragOver={e => DragOverHandler(e, date)}
                                    onDragLeave={e => DragLeaveHandler(e)}
                                >
                                    {date.getDate()}
                                    {sortedEvents.map(event=> 
                                        calendar.areEqual(date, new Date(event.start.dateTime))
                                        ?
                                        <div className='event'
                                            key={event.id}
                                            draggable={user.isAdmin ? true : false}
                                            onDragStart={() => SetCurrentEvent(event)}
                                        >
                                            <p> {event.summary} </p>
                                            <p>{new Date(event.start.dateTime).getHours()}:{new Date(event.start.dateTime).getMinutes()}</p>
                                        </div> 
                                        : undefined
                                    )}
                                </td>
                                :
                                <td className='day' key={index} />
                            )}
                        </tr> 
                    )}
                </tbody>
            </table>
        </div>
    )
}
