const cityInPut = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search');
const locationBtn = document.querySelector('.location');
const currentWeatherDiv = document.querySelector('.current-weather');
const weatherCardDiv = document.querySelector('.weather-cards');

//OPENWEATHERAPP-----------------------
const APIkey = '0152f2d8a6931898cd9a7065c98bd01e';

//UNSPLASH-------------------------------
const UNSPLASHAPIkey = 'FyQCcl92qwqnwEgO2pPMtNxRxdUTK1zdci5dfeA-8U0';


const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) { //HTML POUR LE FORECAST D EN TETE
        return `<div class="details">
                    <h2><i class="fa-regular fa-calendar" style="color: #2264ff;"></i>  ${cityName} ${weatherItem.dt_txt.split(" ")[0]}</h2>
                    <h4><i class="fa-solid fa-temperature-quarter" style="color: #ff0000;"></i> ${(weatherItem.main.temp_min - 273.15).toFixed(1)}°C</h4>
                    <h4><i class="fa-solid fa-temperature-full" style="color: #1dae0a;"></i> ${(weatherItem.main.temp_max - 273.15).toFixed(1)}°C</h4> 
                    <h4><i class="fa-solid fa-wind" style="color: #2264ff;"></i> ${(weatherItem.wind.speed * 3.6).toFixed(1)} Km/h</h4>
                    <h4><i class="fa-solid fa-droplet" style="color: #2264ff;"></i> ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else { //HTML POUR LE FORECAST DES 5 PROCHAINS JOURS
        return `<li class="card">
            <h3><i class="fa-regular fa-calendar" style="color: #2264ff;"></i>  ${weatherItem.dt_txt.split(" ")[0]}</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4><i class="fa-solid fa-temperature-quarter" style="color: #ff0000;"></i> ${(weatherItem.main.temp_min - 273.15).toFixed(1)}°C</h4>
            <h4><i class="fa-solid fa-temperature-full" style="color: #1dae0a;"></i> ${(weatherItem.main.temp_max - 273.15).toFixed(1)}°C</h4> 
            <h4><i class="fa-solid fa-wind" style="color: #2264ff;"></i> ${(weatherItem.wind.speed * 3.6).toFixed(1)} Km/h</h4>
            <h4><i class="fa-solid fa-droplet" style="color: #2264ff;"></i> ${weatherItem.main.humidity}%</h4>
        </li>`;
    }
};

const getWeatherDetails = async (cityName, lat, lon) => {
    try {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        const response = await fetch(WEATHER_API_URL);
        const data = await response.json();

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });

        cityInPut.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    } catch (error) {
        alert("Une erreur est survenue !");
    }
};

const getCityCoordinates = async () => {
    try {
        const cityName = cityInPut.value.trim();
        if (!cityName) return;

        const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIkey}`;
        const response = await fetch(GEOCODING_API_URL);
        const data = await response.json();

        if (!data.length) return alert(`Les coordonnées sont inconnues pour ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    } catch (error) {
        alert("Une erreur est survenue !");
    }
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(async position => {
        try {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${APIkey}`;
            const response = await fetch(REVERSE_GEOCODING_URL);
            const data = await response.json();

            const { name } = data[0];
            getWeatherDetails(name, latitude, longitude);
        } catch (error) {
            alert("Une erreur est survenue !");
        }
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert("Geolocalisation refusée par l'utilisateur !");
        }
    });
};




    

// CA NE MARCHE PAS -----------------------------
// https://api.unsplash.com/search/photos?page=${page}&query=${inputVal}&client_id=${UNSPLASHAPIkey}


// &query=${cityName}&${per_page}&${relevance}
// const fetchPhoto = async () => {
//     const url = "https://api.unsplash.com/photos?client_id=2GB3Q5rtkESgtgT08v7GXO7N6iuYb9_92zNz8Nr0s74"
//     const response = await fetch(url);
//     return response.json;
//     }



const getPhotoFromUnsplash = async () => {
    try {                           
        const UNSPLASH_API_URL = `https://api.unsplash.com/photos?page=1&query=${cityInPut}&client_id=${UNSPLASHAPIkey}`;
        const response = await fetch(UNSPLASH_API_URL);
        const data = await response.json();

        let imageUrl;
        if (data && data.results && data.results.length > 0) {
            imageUrl = data.results[0].urls.regular;
        } else {
            // Set a default background image URL
            imageUrl = ''; // Replace with your actual default image URL
        }

        currentWeatherDiv.style.backgroundImage = `url(${imageUrl})`;
        currentWeatherDiv.style.backgroundSize = 'cover'; // To ensure the image covers the div
    } catch (error) {
        alert("Une erreur est survenue lors de la récupération de l'image !");
        // Optionally set the default image in case of an error too
        currentWeatherDiv.style.backgroundImage = 'url(//wsl.localhost/Ubuntu-22.04/home/seaansurf/The-Weather-Application/assets/img/randomWeather.jpg)';
    }
};
// CA NE MARCHE PAS -----------------------------

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInPut.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        getCityCoordinates();
    }
});





