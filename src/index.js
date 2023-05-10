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
        currentLocation = `${latitude},${longitude}`;
        fetchWeather(currentLocation);
      },
      () => {
        fetchWeather(currentLocation);
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
      displayWeather(data);
    } catch (err) {
      logError();
    }
  }

  function displayWeather(data) {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".buttons-container").style.display = "flex";
    document.querySelectorAll(".toggle-day").forEach((button) => {
      button.id === "today"
        ? button.classList.add("active")
        : button.classList.remove("active");
    });

    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/1600x900/?${data.location.name}")`;

    document.querySelector(".location").textContent = data.location.name;
    document.querySelector(
      ".country"
    ).textContent = `${data.location.region}, ${data.location.country}`;

    const weatherContainer = document.querySelector(".weather-container");
    weatherContainer.style.display = "block";

    weatherContainer.innerHTML = writeData(
      data.forecast.forecastday[0].day,
      "today",
      true
    );

    weatherContainer.innerHTML += writeData(
      data.forecast.forecastday[1].day,
      "tomorrow",
      false
    );

    weatherContainer.innerHTML += writeData(
      data.forecast.forecastday[2].day,
      "dayafter",
      false
    );
  }

  function writeData(weatherObj, day, active) {
    return `<div class="weather ${day} ${active === true ? "active" : ""}">
            <div class="flex">
              <img class="icon" src="${weatherObj.condition.icon}" alt="" />
              <h1 class="temp">${
                units === "C"
                  ? Math.round(weatherObj.avgtemp_c) + "\u00b0C"
                  : Math.round(weatherObj.avgtemp_f) + "\u00b0F"
              }</h1>
            </div>
            <div class="grid">
              <i class="fa-solid fa-cloud-sun"></i>
              <p class="description">${weatherObj.condition.text}</p>
            </div>
            <div class="grid">
              <i class="fa-solid fa-droplet"></i>
              <p class="rain">${weatherObj.totalprecip_mm} mm</p>
            </div>
            <div class="grid">
              <i class="fa-solid fa-wind"></i>
              <p class="wind">${weatherObj.maxwind_mph} mph</p>
            </div>`;
  }

  function logError() {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".error").style.display = "block";
  }

  function handleClick(e) {
    if (e.target.classList.contains("active")) return;
    document.querySelectorAll(".toggle-day").forEach((button) => {
      button.classList.remove("active");
      button.disabled = true;
      document.getElementById("toggle-units").disabled = true;
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
            document.getElementById("toggle-units").disabled = false;
          });
        });
      }
    });
  }

  document.getElementById("search-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const location = document.getElementById("search-box").value;
    if (location === "") return;
    currentLocation = location;
    fetchWeather(location);
    document.getElementById("search-box").value = "";
  });

  document.querySelectorAll(".toggle-day").forEach((button) => {
    button.addEventListener("click", handleClick);
  });

  const toggle = document.getElementById("toggle-units");
  if (localStorage.getItem("units") === "F") {
    toggle.checked = true;
    document.querySelector(".units").innerText = units;
  }
  toggle.addEventListener("click", () => {
    if (toggle.checked) {
      units = "F";
      fetchWeather(currentLocation);
      document.querySelector(".units").innerText = units;
      localStorage.setItem("units", "F");
    } else {
      units = "C";
      fetchWeather(currentLocation);
      document.querySelector(".units").innerText = units;
      localStorage.setItem("units", "C");
    }
  });

  const dayAfterDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
  document.getElementById("dayafter").textContent =
    dayAfterDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

  return {
    units,
    currentLocation,
    getLocation,
    fetchWeather,
    displayWeather,
    writeData,
    logError,
  };
})();

weather.getLocation();
