import React from 'react'
import search from '../assets/search.svg'
import location from '../assets/location.svg'
import clear from '../assets/x-circle.svg'


const Forms = (props) => {


  return (
    <>
      <div className='form'>

<div className='input'>
  <label for='from'>from</label>
  <input type='text' id='from' placeholder='Location from'  ref={props.directionfrom}/>
</div>

<div className='input'>
  <label for='to'>to</label>

  <input type='text' id='to' placeholder='Location to'  ref={props.directionto}/>
</div>

<div className='buttons'>

<div className='btn1 button'>
<button onClick={props.searchhandler} name='search'><img src={search} alt='search'/></button>
</div>

<div className='btn3 button'>
<button onClick={props.clearhaldler} name='search'><img src={clear} alt='search'/></button>
</div>

<div className='btn2 button'>
<button onClick={props.locationhandler} name='location'><img src={location} alt='loaction'/></button>
</div>

</div>

</div>
    </>
  )
}

export default Forms
