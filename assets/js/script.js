//element selector for the city search form
var searchFormEl = document.querySelector("#search-form");
//API key
var openWeatherApiKey = "f22e49aad8438adbd22ac06770e91152";
//display elements
var pageRow = document.querySelector("#page-row");
var searchColumn = document.querySelector("#search-column");
var cityTitle = document.querySelector("#city-title");
var cityName;
var cityDate;
var weatherIcon = document.querySelector("#big-weather-icon");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumidity = document.querySelector("#city-humidity");
var cityUVindex = document.querySelector("#city-UVindex");
var UVindex = document.querySelector("#UVindex");

//function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
  console.log("event", event);
  console.log("event.target", event.target);
  console.log("event.type", event.type);
  event.preventDefault();
  //clear previous values in html element
  document.querySelector("#city-title").innerHTML = "";
  //TODO: the weather icon is sticking and not clearing until replaced
  document.querySelector("#big-weather-icon").innerHTML = "";
  document.querySelector("#city-temp").innerHTML = "";
  document.querySelector("#city-wind").innerHTML = "";
  document.querySelector("#city-humidity").innerHTML = "";
  document.querySelector("#city-UVindex").innerHTML = "";
  //TODO - try updating the big teal card to display none 
  //-> will need to reverse appending elements 

  //TODO: create if/else statement so to assign variable from event of either Submit button (submit) or SavedCity button(click) to searchCity. Use event.target to find the savedCity label value
  var searchCity;

  if (event.type === "submit") {
    //create element selector with city entered in "search-input" text field
    searchCity = document.querySelector("#search-city").value;
    console.log("submit searchCity", searchCity);
  } else if (event.type === "click") {
    //from 6.a create the searched city button
    searchCity = event.target.textContent;
    console.log("click searchCity", searchCity);
  }
  //if nothing in the "search-input" text field, then show  error
  //TODO: make a pop up error
  if (!searchCity) {
    console.error("Enter a city name");
    return;
  }

  //TODO: manage when more than one city with same name - add country field?

  //Update city name to all lowercase
  searchCity = searchCity.toLowerCase();

  //pass city to getWeatherData
  getWeatherData(searchCity);

  //clear search city text when next submitted
  resetform();
}

//city is passed to getWeatherData, to get city's current weather data
//get longitude and latitude coordinates using getCurrentWeather
//to get longitute and latitude from getOneCallApi
function getWeatherData(city) {
  //pass city to get lon and lat
  return getCurrentWeather(city).then(function (data) {
    //then pass longitute and lattitude One Call API to get uvi data
    displayCityData(data);
    return getOneCallApi(data.coord.lon, data.coord.lat).then(function (data) {
      //then
      displayOneCallWeatherData(data);
      //call to function to display 5 day forecast
      //pass oneCallApi data to display5DayForecast
      //NB no requirement to display city name on forecast
      display5DayForecast(data);
    });
  });
}

//display the city API data
function displayCityData(data) {
  //TO DO - hide card which will hold city data
  var cityText = data;
  //TODO: show error when nothing retrieved - see week 6 mini-project
  console.log("City Text:", cityText);
  //Get city name
  cityName = data.name;

  //call function to create the searched city button
  createSearchedCity(cityName);
}

//create the searched city button and make it work
function createSearchedCity(cityName) {
  //save city into searched city block
  //TODO: limit of number of searched cities listed
  var searchedCityDiv = document.createElement("div");
  var searchedCityButton = document.createElement("button");
  searchedCityButton.classList.add(
    "btn",
    "btn-secondary",
    "custom-btn-secondary"
  );
  searchedCityButton.innerHTML = "<h6>" + cityName + "</h6>";

  //   searchColumn.append(searchedCityDiv, searchedCityButton)
  searchColumn.append(searchedCityDiv, searchedCityButton);

  //create event listener for the searched city button
  searchedCityButton.addEventListener("click", handleSearchFormSubmit);
  //TODO: is this return needed?
  return searchedCityButton;
  //TODO: order cities by descending order
  //TODO: stop cities duplicating
  //TODO: cannot get searchedCity button same width as above column
}

//display the one call weather API data
function displayOneCallWeatherData(data) {
  var oneCallText = data;
  console.log("OneCallText:", oneCallText);

  //get date
  // calculate local date using API timezone_offset
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

  //TO DO: if / else for when data not retrieved - is this necessary, appears the data entry value is 0 in the apis? To confirm
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

  //TODO: update to normal classList.add format (below syntax was from trying to fix bg colour-fixed now in CSS)
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

//getCurrentWeather uses passed in city variable
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

// display the 5-day forecast
//TODO: reduce repetition
//call forecast function at same time as calling displays of city data (teal-coloured card)
//function called to getWeatherData(city) - done
function display5DayForecast(data) {
  // confirm function called
  console.log("Hello display5DayForecast was called");
  //create forecast element selectors
  //forecast dark-grey card
  var forecastCard = document.createElement("div");
  forecastCard.classList.add(
    "card",
    "custom-card",
    "text-white",
    "bg-primary",
    "mb-3"
  );
  //forecast card body
  var forecastCardBody = document.createElement("div");
  forecastCardBody.classList.add("card-body");
  //forecast card date
  var cardDate = document.createElement("h5");
  cardDate.classList.add("card-title");
  //forecast weather icon
  var forecastIcon = document.createElement("image");
  // TODO: how to add src onto a created image element???
  // var forecastrIconUrl =
  //     "http://openweathermap.org/img/wn/" + cityWeatherIcon + ".png";
  //forecastIcon.src = forecastrIconUrl;
  //forecast temp
  var forecastTemp = document.createElement("p");
  forecastTemp.classList.add("card-text", "custom-card-text");
  //forecast wind
  var forecastWind = document.createElement("p");
  forecastWind.classList.add("card-text", "custom-card-text");
  //forecast humidity
  var forecasthumidity = document.createElement("p");
  forecasthumidity.classList.add("card-text", "custom-card-text");
  //create a loop that builds array of objects
  for (var i = 0; i < 5; i++) {
    //"i" is the number of the day in the 5 day forecast
    //use "i" to select the day from the "daily" array in OneCall data
    //create day[i]
    //get date from API
    //OR (easier) do cityDate plus 1

    //TO DO - variable for the day which will be used to get data

    const date = new Date();
    date.setDate(date.getDate() + i+1);
    var dateString = JSON.stringify(date);
    dateString = dateString.substring(0, 11);
    console.log("date substring : " + dateString);
    // next step = cobble together the date string to make it in the right order
    // then append it to the card


  }
}

//getOneCallApi takes the longitute and latitude retrieved by getCurrentWeather(city)
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

//event listener for search for city submit
//triggers handleSearchFormSubmit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);

//reset form (called by handleSearchFormSubmit)
function resetform() {
  document.getElementById("search-form").reset();
}
