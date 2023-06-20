import React from 'react'

const TravelModeSwith = (props) => {
  return (
    <>
    <label className='travelmode-switch'>
        <input type="checkbox" checked={props.ischacked} onChange={props.onischacked}/>
        <span className="travelmode" ><img src={props.tricon} alt='trip'/></span>
    </label>
    </>
  )
}

export default TravelModeSwith
