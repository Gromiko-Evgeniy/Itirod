import React, {useState} from 'react'
import { UserContext } from '../UserContext';

export default function UserContextProvider({ children }) {
    const [user, setUser] = useState({isAdmin: false, department: 'developers'});
    
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
