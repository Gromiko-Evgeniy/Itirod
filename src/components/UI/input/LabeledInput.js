import React from 'react'
import '../Labeled.css'

export default function LabeledInput({label, ...props}) {
  return (
    <div className="labeled">
        <label htmlFor="input">{label}:</label>
        <input {...props} id="input" name="input"/>
    </div>
  )
}
