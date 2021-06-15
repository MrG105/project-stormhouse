var WeatherKey = "fc68a64d0afee1bc09c4e15296f59f41";
// Test Houston, start and end date
var eventSize = 5;
var searchBar = document.getElementById("searchBar");
var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
var weatherEl = document.getElementById('weather');
var eventEl = document.getElementsByClassName('event');
var recentHistory = document.getElementById('history');
var ticketmasterEvents = [];  
var weatherData = [];
var startDatePicked = document.querySelector('#datePicker1','input[type="date"]');
var endDatePicked = document.querySelector('#datePicker2','input[type="date"]');

// var startDate = selectedDate.value;
// var endDate =  moment(datePicker.value).add(7,'d').toISOString();


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
         weatherData = json.daily.map(function(day) {
            return {
               dt: moment.unix(day.dt).format('LLLL'),
               id: day.weather[0].id,
               desc: day.weather[0].description,
               icon: day.weather[0].icon, 
            }
         })
         ticketmasterEvents = data._embedded.events.map(function(event) {
            return {
               name: event.name,
               image: event.images[1].url,
               date: moment(event.dates.start.dateTime).format('LLLL'),
               info: event.info,
               url: event.url,
               weatherDescription: weatherData.filter(function(weather) {
                  var weatherDate = moment(weather.dt)
                  var eventDate = moment(event.dates.start.dateTime)
                  return weatherDate.isSame(eventDate, 'day')
                  
               })[0]
            }
         })
         console.log(weatherData)
         console.log(ticketmasterEvents)
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
   for (i = 0; i <eventEl.length; i++) {
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
   // console.log(startDate)
   var startDate = moment(startDatePicked.value).format('YYYY-MM-DDTHH:mm:ssZ');
   var endDate = moment(endDatePicked.value).format('YYYY-MM-DDTHH:mm:ssZ')
   console.log(startDate);
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
         'sort': 'date,desc'
        
      },
      success: function(json) {
         console.log(json);
         getWeather(json);
         populateEventList(json);
         // populateModal(json);
         // Parse the response.
         // Do other things.
      },
      error: function(xhr, status, err) {
         // This time, we do not end up here!
      }  
   })
}

// Function to populate Modals with info
function populateModal(eventIndex) {      
   var modalEl = document.getElementById(`popUp-modal-${eventIndex}`);
   modalEl.innerHTML = '';

   var eventTitleData = ticketmasterEvents[eventIndex].name;
   var eventTitle = document.createElement('h3');
   eventTitle.innerHTML = eventTitleData;
   modalEl.appendChild(eventTitle);

   var eventIconURL = ticketmasterEvents[eventIndex].image;
   var eventIcon = document.createElement('img');
   eventIcon.setAttribute('src', eventIconURL);
   modalEl.appendChild(eventIcon);

   var weatherIconURL = ticketmasterEvents[eventIndex].weatherDescription.icon;
   var weatherIcon = document.createElement('img');
   weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherIconURL + ".png");
   modalEl.appendChild(weatherIcon);

   var weatherDesc = ticketmasterEvents[eventIndex].weatherDescription.desc;
   var weatherInfo = document.createElement('h4');
   weatherInfo.innerHTML = weatherDesc;
   modalEl.appendChild(weatherInfo);

   var eventTimeData = ticketmasterEvents[eventIndex].date;
   var eventTime = document.createElement('p');
   eventTime.innerHTML = eventTimeData;
   modalEl.appendChild(eventTime);

   var eventInfoData = ticketmasterEvents[eventIndex].info;
   var eventInfo = document.createElement('p');
   eventInfo.innerHTML = eventInfoData;
   modalEl.appendChild(eventInfo);
   
   var eventURLData = ticketmasterEvents[eventIndex].url;
   var eventURL = document.createElement('a');
   eventURL.setAttribute('href', eventURLData);
   eventURL.innerHTML = eventURL;
   modalEl.appendChild(eventURL);
}

// Loads search history on page start
function init() {
   listSearchHistory();
}

// Search Button Event Handler
$('#searchBtn').click(function () {
   console.log(searchBar.value);
   var city = searchBar.value;
   getEventInfo(city);
   searchHistory.push(city);
   localStorage.setItem("search", JSON.stringify(searchHistory))
   listSearchHistory();
   console.log(ticketmasterEvents)
   
})

// Recent Search History
function listSearchHistory() {
   recentHistory.innerHTML = '';
   for (let i = searchHistory.length-5; i < searchHistory.length; i++) {
      if (searchHistory[i]) {
       var recentCity = document.createElement('button');
       recentCity.setAttribute('class', 'row text-center d-block button secondary');
       recentCity.setAttribute('value', searchHistory[i]);
       recentCity.innerText = recentCity.value;
       recentCity.addEventListener('click', function () {
           getEventInfo(this.value);
       })
       recentHistory.appendChild(recentCity)
      }
   }  
}

// Event Handler for 'Clear Recent Searches' Button
$('#clearBtn').click(function () {
   localStorage.clear();
   searchHistory = [];
   listSearchHistory();
})

// Search Parameters
// city - city
// results per page - size
// start/end date - startDateTime + endDateTime

// Eventhandlers for Modals
$(document).on('open.zf.reveal', '#popUp-modal-0', function() {
   populateModal(0)
});

$(document).on('open.zf.reveal', '#popUp-modal-1', function() {
   populateModal(1)
});

$(document).on('open.zf.reveal', '#popUp-modal-2', function() {
   populateModal(2)
});

$(document).on('open.zf.reveal', '#popUp-modal-3', function() {
   populateModal(3)
});

$(document).on('open.zf.reveal', '#popUp-modal-4', function() {
   populateModal(4)
});

// On page load
init();
