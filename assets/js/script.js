// search for a city
//element selector for the city search form
var searchFormEl = document.querySelector('#search-form');

//function triggered by  "submit" listener on the search form
function handleSearchFormSubmit(event) {
   
    event.preventDefault();
  
    //create element selector with city entered in "search-input" text field
    var searchInputVal = document.querySelector('#search-input').value;
  
    //if nothing in the "search-input" text field, then show the error
    //HOW TO MAKE THIS A POP UP ERROR?
    if (!searchInputVal) {
      console.error('Enter a city name');
      return;
    }

    //HOW TO DO THIS ON SAME PAGE?
    //otherwise, create a query string searchInputVal
    var queryString = './index.html?q=' + searchInputVal;
  
     //DO THIS WHEN ON SAME PAGE?
    //the document location assigns the created query string
    //i.e. the search results retrieved by the query string display
    location.assign(queryString);

    console.log(queryString)
  }

//event listener for search for city submit
//triggers handleSearchFormSubmit
searchFormEl.addEventListener('submit', handleSearchFormSubmit);