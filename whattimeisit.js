// update every UPDATE milliseconds
const UPDATE = 60000
const WEATHER_MINUTES = 15  // see ./itsnow_weather.js

ZONES = new Array(  // first is primary, others are for reference
    {name: "London", zone: "Europe/London", hemisphere: 'N'}
)

const HOUR = new Array(
    "midnight",  // 0
    "small hours",  // 1
    "small hours",  // 2
    "small hours",  // 3
    "small hours",  // 4
    "early morning",  // 5
    "early morning",  // 6
    "morning",  // 7
    "morning",  // 8
    "morning",  // 9
    "morning",  // 10
    "late morning",  // 11
    "midday",  // 12
    "early afternoon",  // 13
    "afternoon",  // 14
    "afternoon",  // 15
    "early evening",  // 16
    "evening",  // 17
    "evening",  // 18
    "evening",  // 19
    "evening",  // 20
    "night",  // 21
    "night",  // 22
    "night",  // 23
)

const SEASON = {
    N: ["Winter","Winter","Spring","Spring","Spring","Summer",
        "Summer","Summer","Autumn","Autumn","Autumn", "Winter"],
    S: ["Summer","Summer","Autumn","Autumn","Autumn","Winter",
        "Winter","Winter","Spring","Spring","Spring", "Summer"],
}


// for testing
// time run started
const START_TIME = new Date()
// time (seconds) to advance per update, 0 => use real time
// you probably want to set UPDATE to a low (300) value too
const TIME_INCREMENT = 0
// the timestep we're on now, in TIME_INCREMENT != 0
TIME_STEP = 0

function getTime(offset=0) {
    // get time with offset (for tomorrow's events) and acceleration for
    // debugging
    let date = new Date()
    if (TIME_INCREMENT != 0) {  //debugging acceleration
        date.setSeconds(START_TIME.getSeconds() + TIME_INCREMENT * TIME_STEP)
        TIME_STEP += 1
    }
    date.setSeconds(date.getSeconds()+offset)
    return date
}

function getpart() {
    // get DOM elements that receive changing values
    return {
        main: document.getElementById("main_box"),
	day_name: document.querySelector(".day_name"),
        time_name: document.querySelector(".time_name"),
        time: document.querySelector("#main_box .time"),
        date: document.querySelector(".date"),
	month: document.querySelector(".month"),
        season: document.querySelector(".season"),
        year: document.querySelector(".year"),
        weather: document.querySelector(".weather"),
    }
}

function getEvents() {
    // get events for today / tomorrow
//    let events = []
//    for (let day_offset=0; day_offset < 2; day_offset++) {
//        let day = day_offset == 0 ? "Today" : "Tomorrow"
//        let time = getZones(offset=24*60*60*day_offset).shift()
//        EVENTS.forEach((event_) => {
//           if (event_.day_name == time.day_name) {
//                events.push(`${day}: ${event_.text}`)
//            }
//            else if (event_.date == time.date) {
//                events.push(`${day}: ${event_.text}`)
//            }
//        })
//    }
//    return(events)
}

function setContent(part) {     
    // put changing values into DOM
    let zones = getZones()
    let time = zones.shift()
    part.day_name.innerHTML =  time.day_name
    part.time_name.innerHTML =  time.time_name
    part.time.innerHTML = time.time
    part.date.innerHTML = time.date
    part.month.innerHTML = time.month
    part.season.innerHTML = time.season
    part.year.innerHTML = time.year
}

function getdims(part) {
    // calculate sizes
    let body_width = window.innerWidth
    let body_height = window.innerHeight
    let main_width = body_width  
    let main_height = body_height 
    let main_left = 0
    let main_top = 0

    return {
        // for logging
        body_width: body_width,
        body_height: body_height,
        main_width: main_width,
        main_height: main_height,

        main_left: main_left,
        main_top: main_top,
    }
}

function update() {
    // move to new part of screen every minute
    let part = getpart()
    setContent(part)
    if (i == WEATHER_MINUTES) {
	i = WEATHER_MINUTES
	itisnow_weather().then(set_weather)
    }
    i = i--
    let dim = getdims(part)
    part.main.style.left = `${dim.main_left}vw`
    part.main.style.top = `${dim.main_top}vh`
}

function getZones(offset=0) {
    // get descriptive text for each zone
    let zones = new Array()
    let now = getTime(offset=offset)
    ZONES.forEach((z) => {
        zones.push({
            name: z.name,
            zone: z.zone,
            day_name: now.toLocaleString("en-GB", {timeZone:z.zone, weekday: 'long'}),
            time_name: HOUR[parseInt(now.toLocaleString("en-US", {timeZone:z.zone, hourCycle: 'h23', hour: 'numeric'}).replace(/ [AP]M/, ''))],
            time: now.toLocaleString("en-US", {timeZone:z.zone, hour: 'numeric', minute: 'numeric'}),
            date: now.toLocaleString("en-GB", {timeZone:z.zone, day: 'numeric'}) + nthNumber(now.toLocaleString("en-GB", {timeZone:z.zone, day: 'numeric'})),
            month: now.toLocaleString("en-GB", {timeZone:z.zone, month: 'long'}),
            year: now.toLocaleString("en-GB", {timeZone:z.zone, year: 'numeric'}),
	    season: SEASON[z.hemisphere][now.getMonth()],
        })
    })
    return zones
}

function nthNumber(number) {
  if (number > 3 && number < 21) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function set_weather(response) {
    if (response == null) {
        return
    }
    getpart().weather.innerHTML = `, ${response}`
}

// set content so width is right for moveit()
setContent(getpart())

// allow time for positioning / sizing
// also adjust to put updates close to actual minute changes
let delay = Math.max(0.5, 60 - new Date().getSeconds() % 60)
if (TIME_INCREMENT != 0) {
    delay = 0.5  // don't wait when testing
}



//setTimeout(() => {moveit(); setInterval(moveit, UPDATE)}, delay * 1000)
//itisnow_weather().then(set_weather)
//setInterval(() => {itisnow_weather().then(set_weather)}, WEATHER_MINUTES*60*1000)
i = WEATHER_MINUTES
setInterval(update, UPDATE)
