// script.js

const apiKey = "60cdd44ccd7e42779d63f4fe2da17f97";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const giphyApiKey = "nYtChfHENck0F5WC8GSiDIrY2YXjDn1a";
const giphyUrl = "https://api.giphy.com/v1/gifs/search";

console.log(apiKey);
console.log(giphyApiKey);
console.log(giphyUrl);
console.log(apiUrl);

document
  .getElementById("weather-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const location = document.getElementById("location-input").value;
    fetchWeatherData(location);
  });

async function fetchWeatherData(location) {
  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch(
      `${"https://api.openweathermap.org/data/2.5/weather"}?q=lat=43.34&lon=10.98&appid=${"60cdd44ccd7e42779d63f4fe2da17f97"}&units=metric`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const processedData = processWeatherData(data);
    displayWeather(processedData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather-info").innerHTML =
      "Error fetching weather data.";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function processWeatherData(data) {
  return {
    location: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  };
}

function displayWeather(data) {
  const weatherInfo = `
        <h2>Weather in ${data.location}</h2>
        <p>Temperature: ${data.temperature}°C</p>
        <p>Description: ${data.description}</p>
        <img src="${data.icon}" alt="${data.description}">
    `;
  document.getElementById("weather-info").innerHTML = weatherInfo;
}

class SelectedAreas {
  constructor() {
    this.areas = JSON.parse(localStorage.getItem("selectedAreas")) || [];
  }

  add(area) {
    if (!this.areas.includes(area)) {
      this.areas.push(area);
      this.save();
    }
  }

  remove(area) {
    this.areas = this.areas.filter((a) => a !== area);
    this.save();
  }

  save() {
    localStorage.setItem("selectedAreas", JSON.stringify(this.areas));
  }
}

const selectedAreas = new SelectedAreas();

document
  .getElementById("weather-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const location = document.getElementById("location-input").value;
    fetchWeatherData(location, true);
  });

async function fetchWeatherData(location, isNew = false) {
  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch(
      `${'https://api.openweathermap.org/data/2.5/weather'}?q=$&appid=${'60cdd44ccd7e42779d63f4fe2da17f97'}&units=metric`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const processedData = processWeatherData(data);
    displayWeather(processedData);
    if (isNew) {
      selectedAreas.add(location);
      updateSavedAreas();
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather-info").innerHTML =
      "Error fetching weather data.";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function updateSavedAreas() {
  const savedAreasDiv = document.getElementById("saved-areas");
  savedAreasDiv.innerHTML = "<h2>Saved Areas</h2>";
  selectedAreas.areas.forEach((area) => {
    savedAreasDiv.innerHTML += `
            <div>
                <span>${area}</span>
                <button onclick="fetchWeatherData('${area}')">Update</button>
                <button onclick="removeArea('${area}')">Remove</button>
            </div>
        `;
  });
}

function removeArea(area) {
  selectedAreas.remove(area);
  updateSavedAreas();
}

async function fetchGif(description) {
  try {
    const response = await fetch(
      `${'https://api.giphy.com/v1/gifs/search'}?q=${description}&api_key=${'nYtChfHENck0F5WC8GSiDIrY2YXjDn1a'}&limit=1`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.data[0]?.images?.original?.url;
  } catch (error) {
    console.error("Error fetching GIF:", error);
    return null;
  }
}

async function fetchWeatherData(location, isNew = false) {
  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch(
      `${'https://api.openweathermap.org/data/2.5/weather'}?lat=44.34&lon=10.99&appid=${'60cdd44ccd7e42779d63f4fe2da17f97'}&units=metric`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const processedData = processWeatherData(data);
    const gifUrl = await fetchGif(processedData.description);
    displayWeather(processedData, gifUrl);
    if (isNew) {
      selectedAreas.add(location);
      //updateSavedAreas();
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("weather-info").innerHTML =
      "Error fetching weather data.";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function displayWeather(data, gifUrl) {
  const weatherInfo = `
        <h2>Weather in ${data.location}</h2>
        <p>Temperature: ${data.temperature}°C</p>
        <p>Description: ${data.description}</p>
        <img src="${data.icon}" alt="${data.description}">
        ${gifUrl ? `<img src="${gifUrl}" alt="Weather GIF">` : ""}
    `;
  document.getElementById("weather-info").innerHTML = weatherInfo;
}

updateSavedAreas();
