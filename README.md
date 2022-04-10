# Weather Dashboard

## Purpose
The Weather Dashboard app enables a user to retrieve weather information for a selected city. The Weather Dashboard displays the city's current weather and a five day forecast. 

[Deployed Weather Dashboard app](https://grace-anderson.github.io/weather-dashboard/)

## Features and Technology

The Weather Dashboard uses the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api) to retrieve weather data for searched cities. 

The app runs in the browser using dynamically updated HTML and CSS powered by jQuery.  [Moment.js](https://momentjs.com/) is used to work with date and time. Local storage saves the five most recent searched cities. [SweetAlert](https://sweetalert.js.org/) generates formatted warning and error alerts. 

The application code is available on [GitHub](https://github.com/grace-anderson/weather-dashboard). 

## Usage
Travellers, such as people flying from one city to another, can use the Weather Dashboard app to check on the weather at their destination. People planning events in advance can use the forecast data to determine the weather for the date of their future event. 

After the user submits their search, they are presented with the city name, the date and information about the current weather conditions: an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index. The user is also shown future weather conditions for that city as a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity for each of the five days.

Weather icons display the weather visually, so users in a hurry can glance at the icons to confirm the current or forecast weather. In addition, the UV Index is colour coded so that the user can see, at a glance, the UV risk and take appropriate actions such as covering up when the UVI is high or extreme. UVI colour codes are green (no risk), yellow (low), orange (moderate), red (high), and purple (extreme).

The app retains the last five cities searched for after the user refreshes or reopens the app. The user can click on a previously searched city to display that city's current and forecast weather information, minimising the need to execute a new search when the city was recently searched for. 

## Issues
Four issues are unresolved at this time, and will be addressed in the future. More information about each issue is available on [GitHub](https://github.com/grace-anderson/weather-dashboard/issues)

## Mock-Up

The gif demonstrates the Weather Dashboard's appearance and functionality

![A user searches for a city and retrieves current and forecast weather information. The user then searches using a saved city. Finally the user refreshes the browser, showing the list of five retained cities](./assets/weather-dashboard.gif)
