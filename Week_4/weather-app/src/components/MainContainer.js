import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer
import WeatherCard from './WeatherCard';

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    // Adds the month after the day of the week to the current date
    if (!daysFromNow) {
      output += ', ' + date.toLocaleString('en-US', { month: 'long'}).toUpperCase()
    }
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */
  
  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */
  

  // State variables that store data from APIs for the weather (current and forecasted) and AQI
  const [weather, setWeather] = useState();
  const [aqi, setAQI] = useState();
  
  /*const [forecastState, setForecastState] = useState();
  let forecastIterations = []
  useEffect(() => {
    if (weather) {
      for (let i = 8; i < weather.list.length; i+=8){
        forecastIterations = [...forecastIterations, i]
      }
      console.log(forecastIterations)
      setForecastState(1);
    }
  }, [weather])*/

  // Array used to generate forecast boxes using map function
  let forecastIterations = [8, 16, 24, 32]
  
  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */

  // useEffect function that calls weather and AQI APIs whenever the city selected in SideContainer changes
  useEffect(() => {
    // APIs are only called once valid city data exists (NOT on initial page render)
    if (props.selectedCity) {
      // Pulls current and forecasted weather data from OpenWeather
      /* Uses OpenWeather's "5 day weather forecast" API instead of One Call API, which results
			in only 4 forecasted (non-current) days instead of 5 as shown in the Figma example because
      the first of the 5 days is the current day */
			let apiWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&appid=${props.apiKey}&units=imperial`;

			fetch(apiWeather)
				.then((response) => response.json())
				.then((data) => {
					// Sets weather variable to pulled data
          setWeather(data);
					console.log("Weather successfully pulled")
				})
        .catch(error => {console.error(error)})
      
      // Pulls AQI data from OpenWeather
      let apiAQI = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${props.selectedCity.lat}&lon=${props.selectedCity.lon}&appid=${props.apiKey}`;

      fetch(apiAQI)
        .then((response) => response.json())
        .then((data) => {
          // Sets aqi variable to pulled data
          setAQI(data);
          console.log("AQI successfully pulled")
        })
        .catch(error => {console.error(error);})
    }
  }, [props.selectedCity])
  
  return (
    <div id="main-container">
      <div id="weather-container">
        {/* 
        STEP 4: Display Weather Data.
        
        With the fetched weather data stored in state, use conditional rendering (perhaps the ternary operator) 
        to display it here. Make sure to check if the 'weather' state has data before trying to access its 
        properties to avoid runtime errors. 

        Break down the data object and figure out what you want to display (e.g., temperature, weather description).
        This is a good section to play around with React components! Create your own - a good example could be a WeatherCard
        component that takes in props, and displays data for each day of the week.
        */}

        {/* Elements are only generated once weather and aqi variables are not null (ie. once API
        calls have been made); renders current weather and AQI data (top left) */}
        {weather && aqi &&
        <>
          <h3>{formatDate()}</h3>
          <h1>Weather for {props.selectedCity.name}, {props.selectedCity.state}</h1>
          <div className="cover">
            <div>
              <h2>{weather.list[0].weather[0].main}</h2>
              <h1 id="current-temp">{Math.round(weather.list[0].main.temp)}°</h1>
              <h3>AQI: {aqi.list[0].main.aqi}</h3>
            </div>
            <img id="cover-visual" src={require(`../icons/${weather.list[0].weather[0].icon}.svg`)} alt={`${weather.list[0].weather[0].description} icon`}/>
          </div>
        </>}

        {/* Forecast boxes are only genereated once weather variable is not null; renders forecast
        boxes by mapping forecastIterations variable to WeatherCard component*/}
        {weather && //forecastState &&
        <>
          <div id="forecast-container">
            {/* Uses forecastIterations array elements and their indices to generate individual
            forecast box data */}
            {forecastIterations.map((iteration, index) => <WeatherCard key={index} date={formatDate(++index)} weather={weather.list[iteration]} />)}
          </div>
        </>}

      </div>
    </div>
  );
}

export default MainContainer;

