import axios from "axios";
import "./style.css";
import API_KEY from "./data/key.js";

const weather = (function () {
  let units = localStorage.getItem("units")
    ? localStorage.getItem("units")
    : "C";
  let currentLocation = "london";

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        weather.currentLocation = `${latitude},${longitude}`;
        weather.fetchWeather(weather.currentLocation);
      },
      () => {
        weather.fetchWeather(weather.currentLocation);
      },
      { enableHighAccuracy: true }
    );
  }

  async function fetchWeather(loc) {
    try {
      const key = API_KEY;
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${loc}&days=3`
      );
      const { data } = response;
      const { forecastday } = response.data.forecast;
      document.querySelector(".buttons-container").style.display = "flex";
      weather.displayWeather(data, forecastday);
    } catch (err) {
      weather.logError();
    }
  }

  function displayWeather(today, future) {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".container").style.display = "block";
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/1600x900/?${today.location.name}")`;

    document.querySelector(".location").textContent = today.location.name;
    document.querySelector(
      ".country"
    ).textContent = `${today.location.region}, ${today.location.country}`;
    weather.writeData(
      ".temp",
      `${
        weather.units === "C"
          ? today.current.temp_c + "\u00b0C"
          : today.current.temp_f + "\u00b0F"
      }`
    );
    weather.writeData(".icon", today.current.condition.icon);
    weather.writeData(".description", today.current.condition.text);
    weather.writeData(
      ".rain",
      `${today.forecast.forecastday[0].day.daily_chance_of_rain}%`
    );
    weather.writeData(".wind", `${today.current.wind_mph} mph`);

    weather.writeData(
      ".temp-tomorrow",
      `${
        weather.units === "C"
          ? future[1].day.avgtemp_c + "\u00b0C"
          : future[1].day.avgtemp_f + "\u00b0F"
      }`
    );
    weather.writeData(".icon-tomorrow", future[1].day.condition.icon);
    weather.writeData(".description-tomorrow", future[1].day.condition.text);
    weather.writeData(
      ".rain-tomorrow",
      `${future[1].day.daily_chance_of_rain}%`
    );
    weather.writeData(".wind-tomorrow", `${future[1].day.maxwind_mph} mph`);

    weather.writeData(
      ".temp-dayafter",
      `${
        weather.units === "C"
          ? future[2].day.avgtemp_c + "\u00b0C"
          : future[2].day.avgtemp_f + "\u00b0F"
      }`
    );
    weather.writeData(".icon-dayafter", future[2].day.condition.icon);
    weather.writeData(".description-dayafter", future[2].day.condition.text);
    weather.writeData(
      ".rain-dayafter",
      `${future[2].day.daily_chance_of_rain}%`
    );
    weather.writeData(".wind-dayafter", `${future[2].day.maxwind_mph} mph`);
  }

  function writeData(className, data) {
    const element = document.querySelector(className);
    if (element.nodeName === "IMG") {
      element.src = data;
      return;
    }
    element.textContent = data;
  }

  function logError() {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".error").style.display = "block";
  }

  function toggleUnits() {
    const toggle = document.getElementById("toggle-units");
    if (localStorage.getItem("units") === "F") {
      toggle.checked = true;
      document.querySelector(".units").innerText = weather.units;
    }
    toggle.addEventListener("click", () => {
      if (toggle.checked) {
        weather.units = "F";
        weather.fetchWeather(weather.currentLocation);
        document.querySelector(".units").innerText = weather.units;
        localStorage.setItem("units", "F");
      } else {
        weather.units = "C";
        weather.fetchWeather(weather.currentLocation);
        document.querySelector(".units").innerText = weather.units;
        localStorage.setItem("units", "C");
      }
    });
  }

  function handleClick(e) {
    if (e.target.classList.contains("active")) return;
    document.querySelectorAll(".toggle-day").forEach((button) => {
      button.classList.remove("active");
      button.disabled = true;
    });
    e.target.classList.add("active");
    document.querySelectorAll(".weather").forEach((box) => {
      if (box.classList.contains(e.target.id)) {
        box.style.display = "block";
        box.classList.add("active");
      } else {
        box.classList.remove("active");
        box.addEventListener("transitionend", () => {
          document.querySelectorAll(".toggle-day").forEach((button) => {
            button.disabled = false;
          });
        });
      }
    });
  }

  document.getElementById("search-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const location = document.getElementById("search-box").value;
    if (location === "") return;
    weather.currentLocation = location;
    weather.fetchWeather(location);
  });

  document.querySelectorAll(".toggle-day").forEach((button) => {
    button.addEventListener("click", handleClick);
  });

  return {
    units,
    currentLocation,
    getLocation,
    fetchWeather,
    displayWeather,
    writeData,
    logError,
    toggleUnits,
  };
})();

const dayAfterDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
document.getElementById("dayafter").textContent =
  dayAfterDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

weather.toggleUnits();
weather.getLocation();
