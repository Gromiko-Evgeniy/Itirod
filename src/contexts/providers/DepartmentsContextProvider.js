import React, {useState} from 'react'
import {DepartmentsContext} from "../DepartmentsContext";

export default function DepartmentsContextProvider({ children }) {

    const [departments, setDepartments] = useState([
        {name: 'developers', description: 'developers', id:'1'},
        {name: 'QA', description: 'QA', id:'2'},
        {name: 'managers', description: 'managers', id:'3'},
        {name: 'designers', description: 'designers', id:'4'},
    ]);

  return (
    <DepartmentsContext.Provider value={{departments, setDepartments}}>
        {children}
    </DepartmentsContext.Provider>
  )
}
