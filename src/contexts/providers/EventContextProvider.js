import React, {useState} from 'react'
import { EventContext } from '../EventContext';
import { getInfoFromDescription } from '../../api/MeetupEventAPI';

export default function EventContextProvider({children}) {

    const [events, setEvents] = useState([]);

    const getSortedByDepartmentEvents = (department) => 
        events.filter(event => getInfoFromDescription('department', event) === department)

    return (
        <EventContext.Provider value={{events, setEvents, getSortedByDepartmentEvents}}>
            {children}
        </EventContext.Provider>
    )
}
