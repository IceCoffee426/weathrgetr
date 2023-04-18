import WEATHER_API_KEY from "./config.js";

const weather = {
  fetchWeather: async function (city) {
    try {
      const key = WEATHER_API_KEY;
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`,
        {
          mode: "cors",
        }
      );
      const weatherData = await response.json();
      this.displayWeather(weatherData);
    } catch (err) {
      logError(err);
    }
  },

  displayWeather: function (data) {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".weather").style.visibility = "visible";
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/1600x900/?${data.location.name}")`;
    writeData(".city", data.location.name);
    writeData(".temp", `${data.current.temp_c}\u00b0C`);
    writeData(".icon", data.current.condition.icon);
    writeData(".description", data.current.condition.text);
    writeData(".humidity", `${data.current.humidity}%`);
    writeData(".wind", `${data.current.wind_mph} mph`);
  },
};

const writeData = function (className, data) {
  const element = document.querySelector(className);
  if (element.nodeName === "IMG") {
    element.src = data;
    return;
  }
  element.innerHTML = data;
};

const logError = function (err) {
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".error").style.display = "block";
  console.log(err);
};

document.getElementById("search-btn").addEventListener("click", function (e) {
  e.preventDefault();
  weather.fetchWeather(document.getElementById("search-box").value);
});

window.onload = function () {
  weather.fetchWeather("London");
};
