import React from "react";
import "../styles/WeatherCard.css"; // Imports the CSS file for WeatherCard

function WeatherCard({date, forecast}) {

    return (
      <div className="forecast-box">
        {/* Only provides average forecasted temp for the day (not min to max as shown in Figma example)
				because min to max temp is not available for all times using the "5 day weather forecast" API;
				the code in line 17 can be substituted for line 12 to display min to max temps, but it will return
				average daily temp for both values if no min and/or max exists
				<span>{Math.round(forecast.main.temp_min)}° to {Math.round(forecast.main.temp_max)}°</span> */}
        {forecast &&
          <>
            <span>{date}</span>
            <img src={require(`../icons/${forecast.weather[0].icon}.svg`)} alt={`${forecast.weather[0].description} icon`}/>
            <span>{Math.round(forecast.main.temp)}°</span>
          </>
          }
      </div>
    );

}

export default WeatherCard;