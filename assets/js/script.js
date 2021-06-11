var WeatherKey = "fc68a64d0afee1bc09c4e15296f59f41";
// Test Houston, start and end date
var eventSize = 10;
// var city = 'Houston';
var startDate = '2021-06-12T14:00:00Z';
var endDate =  '2021-06-14T14:00:00Z';
// var searchBtn = document.getElementById("searchBtn");
var searchBar = document.getElementById("searchBar");
var family = 'only';
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var weatherEl = document.getElementById('weather');
var eventEl = document.getElementsByClassName('event1');


// Gives City Coordinates for future weather
function getWeather(lat,lon) {
   $.ajax({
      type:'GET',
      url:"https:https://api.openweathermap.org/data/2.5/onecall?",
      async:true,
      dataType: 'json',
      data: {
         'lat': lat,
         'lon': lon,
         'appid': 'fc68a64d0afee1bc09c4e15296f59f41',
      },
      success: function(json) {
         console.log(json);
         // Parse the response.
         // Do other things.
      },
      error: function(xhr, status, err) {
         // This time, we do not end up here!
      }  
   })
}

// Function to populate the event list
function populateEventList(data) {
   for (i = 0; i <eventEl.length; i++) {
      eventEl[i].innerHTML = '';
      var eventIconURL = data.events[i].images[0].url;
      var EventIcon = document.createElement('img');
      createEventIcon.setAttribute('src', eventIconURL);
      eventEl[i].appendChild(EventIcon)
      var eventTitle = data.events[i].name;
      var createEventTitle = document.createElement('h3');
      createEventTitle.innerHTML = eventTitle;
      eventEl[i].appendChild(eventTitle);
   }
}

//    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + WeatherKey
//    fetch(queryURL) 
//    .then(function (response1) {
//        return response1.json();
//    })
// }

// Ticketmaster API Call
function getEventInfo(city) { 
   $.ajax({
      type:"GET",
      url:"https://app.ticketmaster.com/discovery/v2/events.json?",
      async:true,
      dataType: "json",
      data: {
         'size': eventSize,
         'apikey': 'ErpaEawaL6ezuvntLs0ajqdHla2rkqbA',
         'city': city,
         'startDateTime': startDate,
         'endDateTime': endDate,
         // 'includeFamily': family       
      },
      success: function(json) {
         console.log(json);
         populateEventList(data);
         // Parse the response.
         // Do other things.
      },
      error: function(xhr, status, err) {
         // This time, we do not end up here!
      }  
   })
}

// function init() {
//    getCoords(city);
//    getEventInfo();
// }

// Search Button Event Handler
$('#searchBtn').click(function () {
   console.log(searchBar.value);
   var city = searchBar.value;
   getEventInfo(city);
   searchHistory.push(city);
   localStorage.setItem("search", JSON.stringify(searchHistory))
   // listSearchHistory();
})



// TODO: Event Handlers for search parameters
// Parse Response
// Update HTML based on response

// On page load for test
// init();



// Search Parameters
// city - city
// results per page - size
// start/end date - startDateTime + endDateTime
// family friendly - includeFamily (yes/no/only)
