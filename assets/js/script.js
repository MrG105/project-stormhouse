var APIKey = "fc68a64d0afee1bc09c4e15296f59f41";
// Test Houston, start and end date
var eventSize = 5;
var city = 'Houston';
var startDate = '2021-06-12T14:00:00Z';
var endDate =  '2021-06-14T14:00:00Z';

// Gives City Coordinates for future weather
function getCoords(city) {
   var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey
   fetch(queryURL) 
   .then(function (response1) {
       return response1.json();
   })
}
// Ticketmaster API Call
function getEventInfo() { 
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
         'endDateTime': endDate       
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
function init() {
   getCoords(city);
   getEventInfo();
}

// Search Button Event Handler
$('#searchBtn').click(function () {
   var city = $( ":input" ).val();
   getCoords(city);
   searchHistory.push(city);
   localStorage.setItem("search", JSON.stringify(searchHistory))
   listSearchHistory();
})

// TODO: Event Handlers for search parameters
// Parse Response
// Update HTML based on response

// On page load for test
init();