import React from 'react'
import Toggle from './Toggle';

const Tripinfo = (props) => {
  return (
    <>
         <div className='trip-info'> 

            <div className='text-info'>
              <h2>distance</h2>
              <span>{props.distance}{props.mile}</span>
            </div>

            <div className='toogle-box'>
              <div className='toggle-text'>KM</div>
                <Toggle isToggled={props.isToggled} onToggle={() => setIsToggled(!isToggled)}/>
              <div className='toggle-text'>MI</div>
            </div>

            <div className='text-info'>
              <h2>duration</h2>
              <span>{props.duration}</span>
            </div>

           </div>
    </>
  )
}

export default Tripinfo
