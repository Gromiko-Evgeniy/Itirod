import React from 'react'
import '../Labeled.css'

export default function LabeledSelect({label, options, ...props}) {
  return (
    <div className="labeled">
        <label htmlFor="select"> {label}: </label>
        <select  {...props} id="select">
            {options.map(op=>
              <option value={op.value} key={op.id}>{op.name}</option>
            )}
        </select>
    </div>
  )
}
