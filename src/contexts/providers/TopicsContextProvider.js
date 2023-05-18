import React, {useState} from 'react'
import { TopicsContext } from '../TopicsContext'

export default function TopicsContextProvider({children}) {

    const [topics, setTopics] = useState([
        {name: 'tasks', description: 'tasks', id:'1'},
        {name: 'problems', description: 'problems', id:'2'},
        {name: 'events', description: 'events', id:'3'},
    ]);

    return (
        <TopicsContext.Provider value={{topics, setTopics}}>
            {children}
        </TopicsContext.Provider>
    )
}
