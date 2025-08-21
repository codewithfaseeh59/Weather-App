const cardContainer = document.querySelector(".cardContainer");
const searchButton = document.querySelector(".searchBox button");
const weatherBox = document.querySelector(".weatherBox");
const weatherDetails = document.querySelector(".weatherDetails");
const welcomeMsg = document.querySelector(".welcomeMsg");

const APIkey = "f638e992d47ad2ea29ab3ce22c733079";

function getWeatherIcon(main) {
    switch (main) {
        case "Clear": return "assets/images/clear.png";
        case "Clouds": return "assets/images/cloud.png";
        case "Rain": return "assets/images/rain.png";
        case "Snow": return "assets/images/snow.png";
        case "Mist": return "assets/images/mist.png";
        default: return "assets/images/404.png";
    }
}

function displayWeather(data) {
    if (data.cod !== 200) {
        weatherBox.innerHTML = `<p style='color: #ffb3b3;'>${data.message}</p>`;
        weatherDetails.innerHTML = "";
        weatherBox.style.display = "block";
        weatherDetails.style.display = "none";
        return;
    }
    const icon = getWeatherIcon(data.weather[0].main);
    weatherBox.innerHTML = `
        <img src="${icon}" alt="weather icon">
        <div class="temperature">${Math.round(data.main.temp)}<span>°C</span></div>
        <div class="description">${data.weather[0].description}</div>
    `;
    weatherDetails.innerHTML = `
        <div class="humidity">
            <i class="fa-solid fa-water"></i>
            <span>${data.main.humidity}%</span>
            <p>Humidity</p>
        </div>
        <div class="wind">
            <i class="fa-solid fa-wind"></i>
            <span>${Math.round(data.wind.speed)} km/h</span>
            <p>Wind</p>
        </div>
    `;
    weatherBox.style.display = "block";
    weatherDetails.style.display = "flex";
    if (welcomeMsg) welcomeMsg.style.display = "none";
}

function showWelcome() {
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    if (welcomeMsg) welcomeMsg.style.display = "block";
}

searchButton.addEventListener("click", () => {
    const city = document.querySelector(".searchBox input").value.trim();
    if (city === "") {
        showWelcome();
        return;
    }
    weatherBox.innerHTML = "Loading...";
    weatherBox.style.display = "block";
    weatherDetails.style.display = "none";
    if (welcomeMsg) welcomeMsg.style.display = "none";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(() => {
            weatherBox.innerHTML = `<p style='color: #ffb3b3;'>Unable to fetch weather data.</p>`;
            weatherDetails.innerHTML = "";
            weatherBox.style.display = "block";
            weatherDetails.style.display = "none";
        });
});

document.querySelector(".searchBox input").addEventListener("keyup", function(e) {
    if (e.key === "Enter") searchButton.click();
});

showWelcome();