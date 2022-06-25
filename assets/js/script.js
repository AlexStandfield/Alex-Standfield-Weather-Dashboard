let cityDate = document.querySelector("#city-date");
let currentIcon = document.querySelector("#current-icon");
let currentTemp = document.querySelector("#current-temp");
let currentWind = document.querySelector("#current-wind");
let currentHumidity = document.querySelector("#current-humidity");
let currentUvi = document.querySelector("#current-uvi");
let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-btn");
let forecastBox = document.querySelector("#forecast-box");
let searchHistoryList = document.querySelector("#search-history-list");
let searchedCity;
let searchHistoryArr = [];
let sameCityTrue = false;
let sameCityFalse;

let getLatitudeLongitude = function (city) {
    let apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=00e1799fe71ebcf77ac5fe6d10034a44"
    searchedCity = city;
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {    
                    // Get Daily Weather
                    getWeather(data[0].lat, data[0].lon);
                })
            }
        })
}

let searchPreviousCity = function(event) {
    clearForecast();
    getLatitudeLongitude(this.textContent);
};

let getWeather = function (lat, lon) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=00e1799fe71ebcf77ac5fe6d10034a44&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    let date = new Date().toLocaleString("en-US", {timeZone: data.timezone})
                    date = date.split(",");
                    cityDate.textContent = searchedCity + " " + date[0];
                    // Current Temp
                    currentTemp.textContent = data.current.temp;
                    // Current Wind Speed
                    currentWind.textContent = data.current.wind_speed;
                    // Current Humidity
                    currentHumidity.textContent = data.current.humidity;
                    // Current UVI
                    currentUvi.textContent = "UV Index: " + data.current.uvi;
                    currentUvi.className = "";
                    if (data.current.uvi < 3) {
                        currentUvi.classList = "uv-green";
                    } else if (data.current.uvi < 6) {
                        currentUvi.classList = "uv-yellow";
                    } else if (data.current.uvi < 8) {
                        currentUvi.classList = "uv-orange";
                    } else if (data.current.uvi < 10) {
                        currentUvi.classList = "uv-red";
                    } else if (data.current.uvi > 10) {
                        currentUvi.classList = "uv-purple";
                    }
                    // Current Weather Icon
                    currentIcon.src = "http://openweathermap.org/img/wn/"+ data.current.weather[0].icon + ".png";

                    // Create Search History
                    for (let i = 0; i < searchHistoryArr.length; i++) {
                        console.log(searchHistoryArr[i])
                        if (searchedCity === searchHistoryArr[i]) {
                            sameCityTrue = true;
                        } else {
                            sameCityFalse = false;
                        }
                    }
                    if (!sameCityTrue) {
                        let searchHistory = document.createElement("button");
                        searchHistory.classList = "history-box";
                        searchHistory.textContent = searchedCity;
                        searchHistoryList.appendChild(searchHistory);
                        searchHistory.addEventListener("click", searchPreviousCity);
                        searchHistoryArr.push(searchedCity);
                    } 
                    console.log(searchHistoryArr);
                    console.log(searchedCity);
                    
                    // Get 5 Day Forecast
                    for (let i  = 0; i <= 4; i++) {
                        console.log(data);
                        let forecast = document.createElement("div");
                        forecast.classList = "forecast col-1";
                        // Get Date
                        let forecastDate = document.createElement("h5");
                        forecastDate.classList = "forecast-c";
                        forecastDate.textContent = "Date: ";
                        forecast.appendChild(forecastDate);
                        // Get Icon
                        let forecastIcon = document.createElement("img");
                        forecastIcon.classList = "forecast-icon";
                        forecastIcon.setAttribute("src", "http://openweathermap.org/img/wn/"+ data.daily[i].weather[0].icon + ".png");
                        forecast.appendChild(forecastIcon);
                        // Get Temp
                        let forecastTemp = document.createElement("h5");
                        forecastTemp.classList = "forecast-c";
                        forecastTemp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
                        forecast.appendChild(forecastTemp);
                        // Get Wind
                        let forecastWind = document.createElement("h5");
                        forecastWind.classList = "forecast-c";
                        forecastWind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                        forecast.appendChild(forecastWind);
                        // Get Humidity
                        let forecastHumidity = document.createElement("h5");
                        forecastHumidity.classList = "forecast-c";
                        forecastHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
                        forecast.appendChild(forecastHumidity);

                        // Append to 5-Day Weather Forecast
                        forecastBox.appendChild(forecast);
                    }
                });
            }
        })   
}

let clearForecast = () => {
    while (forecastBox.firstChild) {
        forecastBox.removeChild(forecastBox.firstChild);
    }
}

let searchFunction = (event) => {
    if (searchInput) {
        getLatitudeLongitude(searchInput.value);
        console.log("Hits Here");
        clearForecast();
    } else {
        alert("Please enter a city.")
    }
};

searchBtn.addEventListener("click", searchFunction);

// getLatitudeLongitude("Arizona");