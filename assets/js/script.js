//element selector for the city search form
var searchFormEl = document.querySelector("#search-form");
//API key
var openWeatherApiKey = "f22e49aad8438adbd22ac06770e91152";
//display elements
var cityTitle = document.querySelector("#city-title");
var cityName;
var weatherIcon = document.querySelector("#big-weather-icon");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumidity = document.querySelector("#city-humidity");
var cityUVindex = document.querySelector("#city-UVindex");
var UVindex = document.querySelector("#UVindex");

//2. function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
  event.preventDefault();
  //clear previous values in html element
  document.querySelector("#city-title").innerHTML = "";
  document.querySelector("#big-weather-icon").innerHTML = "";
  document.querySelector("#city-temp").innerHTML = "";
  document.querySelector("#city-wind").innerHTML = "";
  document.querySelector("#city-humidity").innerHTML = "";
  document.querySelector("#city-UVindex").innerHTML = "";

  //create element selector with city entered in "search-input" text field
  var searchCity = document.querySelector("#search-city").value;

  //if nothing in the "search-input" text field, then show  error
  //TODO: make a pop up error
  if (!searchCity) {
    console.error("Enter a city name");
    return;
  }

  //TODO: manage when more than one city with same name - add country field?

  //Update city name to all lowercase
  searchCity = searchCity.toLowerCase();

  //3. pass city to getWeatherData
  getWeatherData(searchCity);

  //clear search city when next clicked searchCity
  resetform();
}

//3. city is passed to getWeatherData, to get city's current weather data
//4. get longitude and latitude coordinates using getCurrentWeather
//5. to get longitute and latitude from getOneCallApi
function getWeatherData(city) {
  //4. pass city to get lon and lat
  return getCurrentWeather(city).then(function (data) {
    //5. then pass longitute and lattitude One Call API to get uvi data
    displayCityData(data);
    return getOneCallApi(data.coord.lon, data.coord.lat).then(function (data) {
      //6. then
      displayOneCallWeatherData(data);
    });
  });
}

//6. display the city data
function displayCityData(data) {
  var cityText = data;
  //TODO: show error when nothing retrieved - see week 6 mini-project
  console.log("City Text:", cityText);
  //display city name and date
  cityName = data.name;
}

//6. display the one call weather data
function displayOneCallWeatherData(data) {
  var oneCallText = data;
  console.log("OneCallText:", oneCallText);

  // calculate local date using timezone_offset
  //get API city timezone_offset
  var offset = data.timezone_offset;
  var date = new Date();
  var localTime = date.getTime();
  var localOffset = date.getTimezoneOffset() * 60000;
  var utc = localTime + localOffset;
  var targetCityDate = utc + offset * 1000;
  var convertedDate = new Date(targetCityDate);
  convertedDate.toLocaleString();
  cityDate = moment(convertedDate).format("DD/MM/YYYY");
  //append cityName and cityDate to the h3 heading
  cityTitle.append(cityName + " (" + cityDate + ")");

  /// get weather icon
  var cityWeatherIcon = data.current.weather[0].icon;
  //create url for weather icon image
  var weatherIconUrl =
    "http://openweathermap.org/img/wn/" + cityWeatherIcon + "@2x.png";
  weatherIcon.src = weatherIconUrl;

  //TO DO: if / else for when data not retrieved
  //get temperature
  var temp = data.current.temp;
  cityTemp.append("Temp: " + temp + "°C");

  //get wind speed
  var wind = data.current.wind_speed;
  cityWind.append("Wind: " + wind + " km/h");

  //get humidity
  var humidity = data.current.humidity;
  cityHumidity.append("Humidity: " + humidity + " %");

  //get UV index
  var uvi = data.current.uvi;
  var uviDisplay = document.createElement("button");

  cityUVindex.append("UV Index:  ");
  cityUVindex.appendChild(uviDisplay);
  uviDisplay.textContent = uvi;

  if (parseInt(uvi) < 3) {
    uviDisplay.className += "btn btn-success disable-hover";
  } else if (parseInt(uvi) >= 3 && parseInt(uvi) < 6) {
    uviDisplay.className += "btn btn-warning disable-hover";
  } else if (parseInt(uvi) === 6 || parseInt(uvi) === 7) {
    uviDisplay.className += "btn btn-high disable-hover";
  } else if (parseInt(uvi) > 7 && parseInt(uvi) < 12) {
    uviDisplay.className += "btn btn-danger disable-hover";
  } else {
    uviDisplay.className += "btn btn-extreme disable-hover";
  }
}

//4. getCurrentWeather uses passed in city variable
//to create url string and pass url to 6.callApi
function getCurrentWeather(city) {
  //TODO: error when city is not found
  var queryCityString =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    openWeatherApiKey;
  return callApi(queryCityString);
}

//5. getOneCallApi takes the longitute and latitude retrieved by getCurrentWeather(city) call to callApi
//and creates a url string that is passed to callApi
function getOneCallApi(lon, lat) {
  var queryOneCallString =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=metric" +
    "&exclude={part}&appid=" +
    openWeatherApiKey;

  return callApi(queryOneCallString);
}

//callApi takes the url and gets the jason response
function callApi(url) {
  return fetch(url).then(function (response) {
    // console.log(response);
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  });
}

//1. event listener for search for city submit
//triggers handleSearchFormSubmit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);

//reset form (called by handleSearchFormSubmit)
function resetform() {
  document.getElementById("search-form").reset();
}
