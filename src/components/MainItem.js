import React from 'react'
import './MainItem.css'
import StyledButton from './UI/button/StyledButton'

export default function MainItem({titleName, title, description, children, isLight=true, editHandler, deleteHandler}) {
  return (
    <div className={isLight ? "light" :"dark"}>
        <div className="space-between">
          <strong>{titleName}: {title} </strong>
          <p>description: {description}</p>
          {children}
        </div>
        <div className='side_buttons'>
          <StyledButton 
            text='edit'
            margin='auto'
            onClick={editHandler}
          />
          <StyledButton 
            text='delete'
            margin='auto'
            onClick={deleteHandler}
          />
        </div>
    </div>
  )
}
