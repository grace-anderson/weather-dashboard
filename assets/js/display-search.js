//the display-search.js is opened by the loading of
//location.assign(queryString), triggered by submitting the form

//element selector for the h2 heading that updates with the search term
var resultTextEl = document.querySelector("#result-text");
//element selector for the div that holds each record retrieved by the search
var resultContentEl = document.querySelector("#result-content");
//element selector that holds the search form
var searchFormEl = document.querySelector("#search-form");

//1. FIRST FUNCTION to run - getParams is run by page loading (see bottom of the page)
function getParams() {
  // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split("&");

  // Get the query and format values
  //this is words used in the search
  var query = searchParamsArr[0].split("=").pop();
  //this is the format chosen by the user
  var format = searchParamsArr[1].split("=").pop();

  //trigger searchAPI, pass in variables query and format
  searchApi(query, format);
}

//3.THIRD FUNCTION  PrintResults
//printing out results into the resultContentEl.textContent
//nb resultObj = locRes.results[i] (created by searchApi)
function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  //create all the elements in the div to hold the content
  var resultCard = document.createElement("div");
  resultCard.classList.add("card", "bg-light", "text-dark", "mb-3", "p-3");

  var resultBody = document.createElement("div");
  resultBody.classList.add("card-body");
  resultCard.append(resultBody);

  var titleEl = document.createElement("h3");
  titleEl.textContent = resultObj.title;

  var bodyContentEl = document.createElement("p");
  bodyContentEl.innerHTML =
    "<strong>Date:</strong> " + resultObj.date + "<br/>";

  if (resultObj.subject) {
    bodyContentEl.innerHTML +=
      "<strong>Subjects:</strong> " + resultObj.subject.join(", ") + "<br/>";
  } else {
    bodyContentEl.innerHTML +=
      "<strong>Subjects:</strong> No subject for this entry.";
  }

  if (resultObj.description) {
    bodyContentEl.innerHTML +=
      "<strong>Description:</strong> " + resultObj.description[0];
  } else {
    bodyContentEl.innerHTML +=
      "<strong>Description:</strong>  No description for this entry.";
  }

  var linkButtonEl = document.createElement("a");
  linkButtonEl.textContent = "Read More";
  linkButtonEl.setAttribute("href", resultObj.url);
  linkButtonEl.classList.add("btn", "btn-dark");

  // append the content to the created elements
  //result body is the card content that appends to the resultContentEl
  //titleE1 is the h3 heading
  //bodyContentEl is Date, Subjects, Description (note that each uses if/else to manage if there is no content)
  //linkButtonEl - creates the Read More button, which links to the retrieved object's url (which is logged in the console log)
  resultBody.append(titleEl, bodyContentEl, linkButtonEl);
  //appent resultBody to resultCard
  resultContentEl.append(resultCard);
}

//2. SECOND FUNCTION to run
// searchAPI is triggered by getParams()
// query is the search term entered by the user
// format is the format selected by the user
function searchApi(query, format) {
  //declare the first part of the api url
  var locQueryUrl = "https://www.loc.gov/search/?fo=json";

  //if a format was selected by the user, then add the format to the url
  if (format) {
    locQueryUrl = "https://www.loc.gov/" + format + "/?fo=json";
  }
  // add the query term to the concatenated url
  locQueryUrl = locQueryUrl + "&q=" + query;

  //fetch the concatenated url
  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      //if response ok, return json data
      return response.json();
    })
    /// what is this????
    // the returned data?
    .then(function (locRes) {
      // write query to page so user knows what they are viewing
      //add retrieved data to the resultTextEl element h2 heading
      resultTextEl.textContent = locRes.search.query;
      //then log it
      console.log(locRes);
      // if there are no results, log no results found heading in the resultContentEl div
      if (!locRes.results.length) {
        console.log("No results found!");
        resultContentEl.innerHTML = "<h3>No results found, search again!</h3>";
      } else {
        //otherwise add loop through retrieved records, printing out each retrieved record into the resultContentEl div using
        // 3.third function PrintResults
        resultContentEl.textContent = "";
        for (var i = 0; i < locRes.results.length; i++) {
          printResults(locRes.results[i]);
        }
      }
    })
    //show error if something earlier in function goes wrong
    .catch(function (error) {
      console.error(error);
    });
}
//function for handling search using the form created on the search-results.html page
function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector("#search-input").value;
  var formatInputVal = document.querySelector("#format-input").value;

  if (!searchInputVal) {
    console.error("You need a search input value!");
    return;
  }
// triggers searchApi, with values inputted on form
  searchApi(searchInputVal, formatInputVal);
}
//listening for submit on the search form
searchFormEl.addEventListener("submit", handleSearchFormSubmit);

//get params is triggered by the page loading
getParams();
