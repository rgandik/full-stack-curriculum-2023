import React from "react";
import "../styles/WeatherCard.css"; // Imports the CSS file for WeatherCard

function WeatherCard({date, weather}) {

    return (
      <div className="forecast-box">
        {weather &&
          <>
            <span>{date}</span>
            <img src={require(`../icons/${weather.weather[0].icon}.svg`)} alt={`${weather.weather[0].description} icon`}/>
            <span>{Math.round(weather.main.temp)}°</span>
          </>
          }
      </div>
    );

}

export default WeatherCard;