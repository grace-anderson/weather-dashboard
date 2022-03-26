//element selector for the city search form
var searchFormEl = document.querySelector("#search-form");
//API key
var openWeatherApiKey = "f22e49aad8438adbd22ac06770e91152";
//display elements
var cityTitle = document.querySelector("#cityTitle");

//2. function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
  event.preventDefault();
  //create element selector with city entered in "search-input" text field
  var searchCity = document.querySelector("#search-city").value;

  //if nothing in the "search-input" text field, then show  error
  //TODO: make a pop up error
  //TODO: manage when more than one city - add country field?
  if (!searchCity) {
    console.error("Enter a city name");
    return;
  }
  //Update city name to all lowercase
  searchCity = searchCity.toLowerCase();

  //3. pass city to getWeatherData
  getWeatherData(searchCity);
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

    console.log("City Text:", cityText)

  console.log("city data:", data);
  console.log("city name:", data.name);
  var cityName = data.name;
  console.log("cityName: ", cityName);

  cityTitle.append(cityName);
  
} 

//6. display the one call weather data
function displayOneCallWeatherData(data) {
//TODO: uvindex
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
    "&exclude={part}&appid=" +
    openWeatherApiKey;
  return callApi(queryOneCallString);
}

//callApi takes the url and gets the jason response
function callApi(url) {
  return fetch(url).then(function (response) {
    console.log(response);
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  });
}

//1. event listener for search for city submit
//triggers handleSearchFormSubmit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
