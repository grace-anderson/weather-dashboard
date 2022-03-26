// search for a city
//element selector for the city search form
var searchFormEl = document.querySelector("#search-form");
var openWeatherAPI = "f22e49aad8438adbd22ac06770e91152";

function callApi(url){
    
  return fetch(url).then(function (response) {
      console.log(response);
    if (!response.ok) {
      throw response.json();
    }
    return response.json();
  })
}

function getCurrentWeather(city){
    var queryString =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    openWeatherAPI;
    return callApi(queryString)
}

function getOneCallApi(lon, lat){
    var queryString = ''
    return callApi(queryString)

}

function getWeatherData(city){

    return getCurrentWeather(city)
        .then(function(data){
            return getOneCallApi(data.coord.lon, data.coord.lat)
        })

}

//function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
  event.preventDefault();

  //create element selector with city entered in "search-input" text field
  var searchInputVal = document.querySelector("#search-input").value;

  //if nothing in the "search-input" text field, then show  error
  //TODO: make a pop up error
  if (!searchInputVal) {
    console.error("Enter a city name");
    return;
  }

  //Update city name to all lowercase
  searchInputVal = searchInputVal.toLowerCase();


  getWeatherData(searchInputVal)
  .then(function(data) {

  })

  // create a API call string searchInputVal

  console.log(queryString);
}

//event listener for search for city submit
//triggers handleSearchFormSubmit
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
