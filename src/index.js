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
      const { forecast } = response;
      this.displayWeather(data);
    } catch (err) {
      this.logError();
      console.log(err);
    }
  },

  displayWeather: function (data) {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".weather").style.visibility = "visible";
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/1600x900/?${data.location.name}")`;
    this.writeData(".city", data.location.name);
    this.writeData(
      ".temp",
      `${
        this.units === "C"
          ? data.current.temp_c + "\u00b0C"
          : data.current.temp_f + "\u00b0F"
      }`
    );
    this.writeData(".icon", data.current.condition.icon);
    this.writeData(".description", data.current.condition.text);
    this.writeData(".humidity", `${data.current.humidity}%`);
    this.writeData(".wind", `${data.current.wind_mph} mph`);
  },

  writeData: function (className, data) {
    const element = document.querySelector(className);
    if (element.nodeName === "IMG") {
      element.src = data;
      return;
    }
    element.innerHTML = data;
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
      } else {
        this.units = "C";
        this.fetchWeather(this.currentLocation);
      }
    });
  },
};

document.getElementById("search-btn").addEventListener("click", function (e) {
  e.preventDefault();
  weather.fetchWeather(document.getElementById("search-box").value);
});

weather.getLocation();
weather.getUnits();
