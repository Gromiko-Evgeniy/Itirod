import React from 'react'
import './StyledButton.css'

export default function StyledButton({text, ...props}) {
  return (
    <button className='styledButton' {...props}>{text}</button>
  )
}
