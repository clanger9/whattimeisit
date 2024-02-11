// this function will be called every WEATHER_MINUTES minutes
// it should return a Promise that resolves to a string describing
// the weather at the target location.

// default - no weather information
//function itisnow_weather() {
//    return new Promise( resolve => {
//        resolve(null)
//    })
//}

// here's an example using Open Weather Map

const weatherLocation = "Chester,uk"; // your location
const weatherAPIKey = ""; // your Open Weather Map API key 

// delete the function above and rename this one 'itisnow_weather'
async function itisnow_weather() {
    console.log("Fetching weather", new Date())
    return fetch(
        `//api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&units=metric&APPID=${weatherAPIKey}`
    ).then(response => response.json().then(format_weather))
}

function format_weather(response) {
    return `${Math.round(response.main.temp)}&#176;C`
}
