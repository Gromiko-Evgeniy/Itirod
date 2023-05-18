import React from 'react'
import './StyledButton.css'

export default function StyledButton({text, borderColor = 'none', margin = '0px', ...props}) {
  return (
    <button 
      className='styledButton' 
      style={{
        border: borderColor == 'none' ? 'none' : 'solid 1px ' + borderColor,
        margin: margin,
      }}
      {...props}
    >
      {text}
    </button>
  )
}
