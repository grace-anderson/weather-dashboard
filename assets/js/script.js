//element selector for the city search form
var searchFormEl = document.querySelector("#search-form");
//API key
var openWeatherApiKey = "f22e49aad8438adbd22ac06770e91152";
//display elements
var bigCard = document.querySelector("#header-card");
var pageRow = document.querySelector("#page-row");
var searchColumn = document.querySelector("#search-column");
var forecastColumn = document.querySelector("#forecast-column");
var cityTitle = document.querySelector("#city-title");
var cityName;
var cityDate;
var weatherIcon = document.querySelector("#big-weather-icon");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumidity = document.querySelector("#city-humidity");
var cityUVindex = document.querySelector("#city-UVindex");
var UVindex = document.querySelector("#UVindex");
var fiveDayHeading = document.querySelector("#five-day");
fiveDayHeading.classList.add("hideFiveDayHeading");

var cityHistory = [];
//limit of five cities saved in local storage
var historyLimit = 5;

//function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
  event.preventDefault();
  //clear previous values in html element
  bigCard.classList.add("hideCard");
  document.querySelector("#city-title").innerHTML = "";
  //TODO: the weather icon is sticking and not clearing until replaced
  document.querySelector("#big-weather-icon").innerHTML = "";
  document.querySelector("#city-temp").innerHTML = "";
  document.querySelector("#city-wind").innerHTML = "";
  document.querySelector("#city-humidity").innerHTML = "";
  document.querySelector("#city-UVindex").innerHTML = "";

  //clear forecast content
  clearForecastContent();

  var searchCity = document.querySelector("#search-city").value;

  if (event.type === "submit") {

    if (searchCity === "") {
      swal("Enter a city name", "Try again", "error");
      return;
    } else {
      //add city to local storage
      searchCity.toLowerCase();
      titleCase(searchCity);
    }

    // if search term already exist in history
    var cityIsThereAlready = cityHistory.includes(searchCity.toLowerCase());
    if (cityIsThereAlready) {
      // move thecity position to the end
      // find the index of target in array
      var cityIndex = cityHistory.findIndex(function (city) {
        return city.toLowerCase() === searchCity.toLowerCase();
      });
      if (cityIndex === -1) {
        swal("City not found", "Try searching again", "error");
        fiveDayHeading.classList.add("hideFiveDayHeading");
        throw "City not found";
      }
      // extract the item out
      var extracted = cityHistory.splice(cityIndex, 1)[0];
      // insert the extracted to the end of the array
    }

    cityHistory.push(searchCity.toLowerCase());

    // if city history is === limit
    if (cityHistory.length >= historyLimit) {
      // we will keep the last 5 items in city history
      cityHistory = cityHistory.slice(-historyLimit);
    }

    localStorage.setItem("city-history", JSON.stringify(cityHistory));
  } else if (event.type === "click") {
    //from create the searched city button
    searchCity = event.target.textContent;
  }
  //if nothing in the "search-input" text field, then show  error

  if (!searchCity) {
    swal("Enter a city name", "Try again", "error");
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

  var cityText = data;
  //Get city name
  cityName = data.name;
  //call function to create the searched city button
  createSearchedCity(cityName);
}

//create the searched city button and make it work
function createSearchedCity(cityName) {
  //save city into searched city block
  var searchedCityDiv = document.createElement("div");
  var searchedCityButton = document.createElement("button");
  searchedCityButton.classList.add(
    "btn",
    "btn-secondary",
    "custom-btn-secondary"
  );
  searchedCityButton.innerHTML = "<h6>" + titleCase(cityName) + "</h6>";

  //   searchColumn.append(searchedCityDiv, searchedCityButton)
  searchColumn.append(searchedCityDiv, searchedCityButton);

  //create event listener for the searched city button
  searchedCityButton.addEventListener("click", handleSearchFormSubmit);

  return searchedCityButton;
}

//display the one call weather API data
function displayOneCallWeatherData(data) {
  var oneCallText = data;

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

  //TO DO: if / else for when data not retrieved - is this necessary, appears the data value is 0 in the apis?
  //display big blue card
  bigCard.classList.remove("hideCard");

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
    uviDisplay.classList.add("btn", "btn-success", "disable-hover");
  } else if (parseInt(uvi) >= 3 && parseInt(uvi) < 6) {
    uviDisplay.classList.add("btn", "btn-warning", "disable-hover");
  } else if (parseInt(uvi) === 6 || parseInt(uvi) === 7) {
    uviDisplay.classList.add("btn", "btn-high", "disable-hover");
  } else if (parseInt(uvi) > 7 && parseInt(uvi) < 12) {
    uviDisplay.classList.add("btn", "btn-danger", "disable-hover");
  } else {
    uviDisplay.classList.add("btn", "btn-extreme", "disable-hover");
  }
}

//getCurrentWeather uses passed in city 
function getCurrentWeather(city) {

  var queryCityString =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    openWeatherApiKey;
  return callApi(queryCityString);
}

// display the 5-day forecast
//call forecast function at same time as calling display of city data
function display5DayForecast(data) {
  //a loop to build array of card objects
  for (var i = 0; i < 5; i++) {
    //"i" is the number of the day in the 5 day forecast
    //create forecast elements
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
    //forecast weather icon
    var forecastIcon = document.createElement("img");
    //forecast card date
    var cardDate = document.createElement("h5");
    cardDate.classList.add("card-title");
    //forecast temp
    var forecastTemp = document.createElement("p");
    forecastTemp.classList.add("card-text", "custom-card-text");
    //forecast wind
    var forecastWind = document.createElement("p");
    forecastWind.classList.add("card-text", "custom-card-text");
    //forecast humidity
    var forecastHumidity = document.createElement("p");
    forecastHumidity.classList.add("card-text", "custom-card-text");

    // calculate city's local date using API timezone_offset
    //ISSUE: some dates are not correct, appears when date is in the future from users timezone
    var offset = data.timezone_offset;
    var date = new Date();
    var localTime = date.getTime();
    var localOffset = date.getTimezoneOffset() * 60000;
    var utc = localTime + localOffset;
    var targetCityDate = utc + offset * 1000;
    var convertedDate = new Date(targetCityDate);
    convertedDate.setDate(date.getDate() + i + 1);

    convertedDate.toLocaleString();
    var forecastDate = moment(convertedDate).format("DD/MM/YYYY");
    // add date to heading element
    cardDate.textContent = forecastDate;

    // get forecast temp
    var temp = data.daily[i].temp.day;
    temp = "Temp: " + temp + "°C";

    // add temp to p element
    forecastTemp.textContent = temp;

    //get forecast img
    var weatherIcon = data.daily[i].weather[0].icon;
    var forecasteIconUrl =
      "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    forecastIcon.src = forecasteIconUrl;

    // get forecast wind
    var wind = data.daily[i].wind_speed;
    wind = "Wind: " + wind + "°C";

    // add temp to p element
    forecastWind.textContent = wind;

    // get forecast humidity
    var humidity = data.daily[i].humidity;
    humidity = "Humidity: " + humidity + " %";

    // add temp to p element
    forecastHumidity.textContent = humidity;

    // append elements
    forecastCardBody.appendChild(cardDate);
    forecastCardBody.appendChild(forecastIcon);
    forecastCardBody.appendChild(forecastTemp);
    forecastCardBody.appendChild(forecastWind);
    forecastCardBody.appendChild(forecastHumidity);
    forecastCard.appendChild(forecastCardBody);
    forecastColumn.appendChild(forecastCard);
  }

  showFiveDayForecastHeading();
}

function showFiveDayForecastHeading() {
  fiveDayHeading.classList.remove("hideFiveDayHeading");
  fiveDayHeading.innerHTML = "<h3>" + "Five Day Forecast:" + "</h>";
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

//callApi takes the url and gets the JSON response
function callApi(url) {
  return fetch(url).then(function (response) {
    if (!response.ok) {
      swal("City not found", "Try searching again", "error");
      fiveDayHeading.classList.add("hideFiveDayHeading");
      console.log("City not found");
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

//clear content of forecast
function clearForecastContent() {
  document.querySelector("#forecast-column").innerHTML = "";
}

//update to title case
function titleCase(str) {
  var result = [];

  var words = str.split(" ");

  for (var i = 0; i < words.length; i++) {
    var word = words[i].split("");

    word[0] = word[0].toUpperCase();

    result.push(word.join(""));
  }

  return result.join(" ");
}

// retrieve stored cities when the page loads
function init() {
  var storedCities = JSON.parse(localStorage.getItem("city-history"));

  if (storedCities !== null) {
    cityHistory = storedCities;
  }

  for (var i = 0; i < cityHistory.length; i++) {
    var city = cityHistory[i];

    createSearchedCity(city);
  }
}

init();
