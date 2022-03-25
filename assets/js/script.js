//create a element selector variable for the search form
var searchFormEl = document.querySelector('#search-form');

//this function is triggered by the "submit" listener on the search form (i.e. the button used to submit)
function handleSearchFormSubmit(event) {
  //prevent default form behaviour of refreshing the page
  event.preventDefault();

  //create an element selector from text value entered in the "search-input" text field
  var searchInputVal = document.querySelector('#search-input').value;
  //create an element selector from the users selection from the "format-input" drop down
  var formatInputVal = document.querySelector('#format-input').value;

  //if there is nothing in the "search-input" text field, then show the error
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  //otherwise, create the query string using the search-results.html page, the api parameter ?, searchInputVal value, parameter string  &format, and the formatInputVal value
  var queryString = './search-results.html?q=' + searchInputVal + '&format=' + formatInputVal;

  //the document location assigns the created query string
  //i.e. the search results retrieved by the query string display
  location.assign(queryString);
}

//when the (submit) button on the search-form is clicked, run handleSearchFormSubmit
searchFormEl.addEventListener('submit', handleSearchFormSubmit);
