import React from 'react'
import close from '../assets/x-circle.svg'

const Error = (props) => {
  return (
    <div className='errorbox'>
        <div className='error'>
            <div className='close-error'><button onClick={props.closeerror}><img src={close} alt='arrow'/></button></div>
            <div className='error-content'>{props.errormessage}</div>
        </div>
    </div>
  )
}

export default Error
