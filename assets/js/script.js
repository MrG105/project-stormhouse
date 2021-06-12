var WeatherKey = "fc68a64d0afee1bc09c4e15296f59f41";
// Test Houston, start and end date
var eventSize = 5;
var startDate = '2021-06-12T14:00:00Z';
var endDate =  '2021-06-14T14:00:00Z';
var searchBar = document.getElementById("searchBar");
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var weatherEl = document.getElementById('weather');
var eventEl = document.getElementsByClassName('eventOne');
var modalEl= document.getElementsByClassName('popUp-modal')

// Function to parse lat/lon from Ticketmaster venue info to get weather info
function getWeather(data) {
   var lon = data._embedded.events[0]._embedded.venues[0].location.longitude;
   var lat = data._embedded.events[0]._embedded.venues[0].location.latitude;
   $.ajax({
      type:'GET',
      url:"https://api.openweathermap.org/data/2.5/onecall?",
      async:true,
      dataType: 'json',
      data: {
         'lat': lat,
         'lon': lon,
         'appid': 'fc68a64d0afee1bc09c4e15296f59f41',
      },
      success: function(json) {
         console.log(json);
         populateWeather(json);
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
   for (i = 0; i <data._embedded.events.length; i++) {
      eventEl[i].innerHTML = '';
      var eventIconURL = data._embedded.events[i].images[0].url;
      var eventIcon = document.createElement('img');
      eventIcon.setAttribute('src', eventIconURL);
      eventEl[i].appendChild(eventIcon);
      var eventTitle = data._embedded.events[i].name;
      var createEventTitle = document.createElement('h3');
      createEventTitle.innerHTML = eventTitle;
      eventEl[i].appendChild(createEventTitle);
   }
}

// Function to pull weather data from JSON
function populateWeather(data) {
   weatherEl.innerHTML = '';
   var weatherIconURL = data.daily[i].weather[0].icon;
   var weatherIcon = document.createElement('img');
   weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIconURL + "@2x.png");
   weatherEl.appendChild(weatherIcon);
   var weatherDescription = data.daily[i].weather[0].description;
   var  weatherInfo = document.createElement('h4');
   weatherInfo.innerHTML = weatherDescription;
   weatherEl.appendChild(weatherInfo);

}

// Ticketmaster API Call, continues functions
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
      },
      success: function(json) {
         console.log(json);
         populateEventList(json);
         populateModal(json);
         getWeather(json);
         // Parse the response.
         // Do other things.
      },
      error: function(xhr, status, err) {
         // This time, we do not end up here!
      }  
   })
}
// Function to populate Modals with info
function populateModal(data) {
   for (i = 0; i <data._embedded.events.length; i++) {
      modalEl[i].innerHTML = '';
      var eventTitleData = data._embedded.events[i].name;
      var eventTitle = document.createElement('h3');
      eventTitle.innerHTML = eventTitleData;
      modalEl[i].appendChild(eventTitle);
      var eventIconURL = data._embedded.events[i].images[1].url;
      var eventIcon = document.createElement('img');
      eventIcon.setAttribute('src', eventIconURL);
      modalEl[i].appendChild(eventIcon);
      var eventTimeData = data._embedded.events[i].dates.start.dateTime;
      var eventTime = document.createElement('p');
      eventTime.innerHTML = eventTimeData;
      modalEl[i].appendChild(eventTime);
      var eventInfoData = data._embedded.events[i].info;
      var eventInfo = document.createElement('p');
      eventInfo.innerHTML = eventInfoData;
      modalEl[i].appendChild(eventInfo);
   }
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
