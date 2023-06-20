import React from 'react'

const Toggle = (props) => {
  return (
    <label className='toggle-switch'>
        <input type="checkbox" checked={props.isToggled} onChange={props.onToggle}/>
        <span className="switch" />
    </label>
  )
}

export default Toggle
