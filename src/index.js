import axios from "axios";
import "./style.css";
import CODE from "./utils/config.js";

const weather = {
  units: "C",
  currentLocation: "london",

  getLocation: function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        weather.currentLocation = `${latitude},${longitude}`;
        weather.fetchWeather(weather.currentLocation);
        return;
      },
      () => {
        alert("Location permission denied - showing weather in London.");
        weather.fetchWeather("london");
      }
    );
  },

  fetchWeather: async function (loc) {
    try {
      const key = CODE;
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${loc}&days=3`
      );

      const { data } = response;
      const { day } = response.data.forecast.forecastday[1];
      this.displayWeather(data, day);
    } catch (err) {
      this.logError();
      console.log(err);
    }
  },

  displayWeather: function (today, tomorr) {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".weather").style.visibility = "visible";
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/1600x900/?${today.location.name}")`;
    this.writeData(".city", today.location.name);
    this.writeData(
      ".temp",
      `${
        this.units === "C"
          ? today.current.temp_c + "\u00b0C"
          : today.current.temp_f + "\u00b0F"
      }`
    );
    this.writeData(".icon", today.current.condition.icon);
    this.writeData(".description", today.current.condition.text);
    this.writeData(".humidity", `${today.current.humidity}%`);
    this.writeData(".wind", `${today.current.wind_mph} mph`);

    this.writeData(
      ".temp-tomorrow",
      `${
        this.units === "C"
          ? tomorr.avgtemp_c + "\u00b0C"
          : tomorr.avgtemp_f + "\u00b0F"
      }`
    );
    this.writeData(".icon-tomorrow", tomorr.condition.icon);
    this.writeData(".description-tomorrow", tomorr.condition.text);
    this.writeData(".humidity-tomorrow", `${tomorr.avghumidity}%`);
    this.writeData(".wind-tomorrow", `${tomorr.maxwind_mph} mph`);
  },

  writeData: function (className, data) {
    const element = document.querySelector(className);
    if (element.nodeName === "IMG") {
      element.src = data;
      return;
    }
    element.textContent = data;
  },

  logError: function () {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".error").style.display = "block";
  },

  getUnits: function () {
    const toggle = document.getElementById("toggle-units");
    toggle.addEventListener("click", () => {
      if (toggle.checked) {
        this.units = "F";
        this.fetchWeather(this.currentLocation);
        document.querySelector(".units").innerText = "F";
      } else {
        this.units = "C";
        this.fetchWeather(this.currentLocation);
        document.querySelector(".units").innerText = "C";
      }
    });
  },

  search: function () {
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (e.target.value === "") return;
      weather.fetchWeather(document.getElementById("search-box").value);
    });
  },

  toggleDay() {
    const toggleDay = document.getElementById("toggle-day");
    toggleDay.addEventListener("click", function () {
      const today = document.querySelector(".weather");
      const tomorr = document.querySelector(".weather-tomorrow");
      document.querySelector(".weather-tomorrow").style.visibility = "visible";
      today.classList.toggle("active");
      tomorr.classList.toggle("inactive");
      toggleDay.classList.toggle("active");
      if (toggleDay.classList.contains("active"))
        toggleDay.textContent = "Tomorrow";
      else toggleDay.textContent = "Today";
    });
  },
};

weather.getUnits();
weather.search();
weather.toggleDay();
weather.getLocation();
