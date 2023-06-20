import { useEffect, useRef, useState , useCallback } from 'react';
import './App.css';

import CarSvg  from './assets/car-front.svg';
import walking  from './assets/walking.svg';
import arrowimg from './assets/arrow.svg'

import Error from './components/error';

import {useJsApiLoader , GoogleMap  , DirectionsRenderer, Marker} from '@react-google-maps/api'
import Forms from './components/forms';
import Toggle from './components/Toggle';
import TravelModeSwith from './components/TravelModeSwith';

function App() {

  
  const {isLoaded , loadError } = useJsApiLoader({
    googleMapsApiKey : process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places']
  })


  const centercordinates = {lat:41.716667 , lng: 44.783333 }

  const directionfrom = useRef()
  const directionto = useRef()
  const [showDirections, setShowDirections] = useState(false);
  
  const [center , setCenter] = useState(centercordinates)

  const [isToggled, setIsToggled] = useState(false);

  const [drivingmode, setdrivingmode] = useState(true);
  const [walkingmode, setwalkingmode] = useState(false);
  
  const [arrow , setarrow] = useState(true);
  const [error , seterror] = useState(false)
  const [errormessage , seterrormessage] = useState('')

  const [map , setmap] = useState(null)
  const [result , setresult] = useState('')
  const [distance , setdistance] = useState('')
  const [mile , setMile] = useState('km')
  const [duration , setduration] = useState('')
  
  const [travelmode , settravelmode] = useState('DRIVING')


  const [locationClicked, setLocationClicked] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      console.log('Loading error');
      return;
    }
  }, []);


  useEffect(() => {
    if (loadError) {
      seterror(true);
      seterrormessage('Failed to load Google Maps API');
    }
  }, [loadError]);

  useEffect(() => {
    if (isLoaded && !window.google) {
      seterror(true);
      seterrormessage('Failed to load Google Maps. Please try again later.');
    }
  }, [isLoaded]);





  useEffect(() => {
    if (isToggled) {
      setdistance(Math.round(result.routes[0].legs[0].distance.value / 1000)/1.6);
      setMile('mi');
    } else if (result && result.routes) {
      setdistance(Math.round(result.routes[0].legs[0].distance.value / 1000));
      setMile('km');
    }
  }, [isToggled, result , distance]);


  const searchhandler = useCallback(async () => {
    setIsToggled(false);
    if (directionfrom.current.value === '' && directionto.current.value === '') {
      return;
    }
  
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: directionfrom.current.value,
        destination: directionto.current.value,
        travelMode: travelmode,
      });
  
      if (results && results.routes && results.routes[0].legs[0].distance.value) {
        setresult(results);
        setdistance(Math.round(results.routes[0].legs[0].distance.value / 1000));
        setduration(results.routes[0].legs[0].duration.text);
        setShowDirections(true);
      }
    } catch (error) {
      seterrormessage('Error:', error);
      seterror(true);
    }
  }, [directionfrom, directionto, travelmode]);
  
  
  useEffect(() => {
    if (travelmode && directionfrom.current.value && directionto.current.value) {
      searchhandler();
    }
  }, [searchhandler, travelmode]);


  const locationhandler = () => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
    

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: center }, async (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const streetName = results[0].formatted_address;
          directionfrom.current.value = streetName;
          setLocationClicked(true)
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });

    map.panTo(center);
  }

  const clearhaldler = () => {
    setShowDirections(false)
    setresult('');
    setdistance('');
    setduration('');
    directionfrom.current.value = '';
    directionto.current.value = '';
    setMile('km');
  }




  return (
  
    <div className="App">
      
      <div className='map'>
        {!isLoaded && <div>...loading</div>}
      {isLoaded && (
        <GoogleMap 
        center={center} 
        zoom={15} 
        mapContainerStyle={{width:'100%' , height:'100%'}}
        options={{
          zoomControl: false,
          fullscreenControl:false,
          mapTypeControl:false,
          streetViewControl:false
           }}
        onLoad={map => setmap(map)}   
           >
            {locationClicked && <Marker position={center}/>}
            {result && <DirectionsRenderer  directions={result}/>}
        </GoogleMap>
      )}
      </div>

      <div className={arrow ? 'main-controller' :'change'}>
        {arrow &&
        <div className='forms'>

          <Forms 
          searchhandler={searchhandler} 
          locationhandler={locationhandler} 
          directionto={directionto} 
          directionfrom={directionfrom}
          clearhaldler={clearhaldler}
          />

           {result && showDirections && 
           <div className='trip-info'> 

            <div className='text-info'>
              <h2>distance</h2>
              <span>{distance}{mile}</span>
            </div>

            <div className='toogle-box'>
              <div className='toggle-text' style={!isToggled? {color:'green'} : {} }>KM</div>
                <Toggle isToggled={isToggled} onToggle={() => setIsToggled(!isToggled)}/>
              <div className='toggle-text' style={isToggled? {color:'green'} : {} }>MI</div>
            </div>

            <div className='text-info'>
              <h2>duration</h2>
              <span>{duration}</span>
            </div>
            
            <div className='travel-Mode'>

              <TravelModeSwith 
              tricon={CarSvg} 
              ischacked={drivingmode} 
              onischacked={() => {
                settravelmode('DRIVING')
                setdrivingmode(true)
                setwalkingmode(false)
              }}
              />

              <TravelModeSwith 
              tricon={walking} 
              ischacked={walkingmode} 
              onischacked={() => {
                settravelmode('WALKING')
                setdrivingmode(false)
                setwalkingmode(true)
              }}/>
            </div>

           </div>
           }
        </div>
        }
        
           <button onClick={()=>{arrow ? setarrow(false) : setarrow(true)}} className={arrow ? 'hide' : 'show'}><img src={arrowimg} alt='arrow'/></button>

      </div>

      {error && <Error closeerror={()=>{seterror(false)}} errormessage={errormessage}/>}
    </div>
  );
}

export default App;
