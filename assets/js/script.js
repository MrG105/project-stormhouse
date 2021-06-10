var APIKey = "fc68a64d0afee1bc09c4e15296f59f41";



function getCoords(city) {
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey
fetch(queryURL) 
.then(function (response1) {
    return response1.json();
})


$.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=ErpaEawaL6ezuvntLs0ajqdHla2rkqbA",
    async:true,
    dataType: "json",
    data: {
       'city': city,
       
    }
    success: function(json) {
                console.log(json);
                // Parse the response.
                // Do other things.
             },
    error: function(xhr, status, err) {
       // This time, we do not end up here!
      }
   });
   