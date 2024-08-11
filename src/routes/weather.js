const express = require("express");
const axios = require("axios");
const router = express.Router();

const apiKey = process.env.WEATHER_API_KEY;
const baseUrl = process.env.BASE_URL;

const cache = {};
const cacheDuration = 5 * 60 * 1000; // 5 minutes

// Base endpoint
router.get("/", (req, res) => {
  res.json({
    title: "Weather API Wrapper",
    message: "Welcome to the Weather API Wrapper!",
    current: "/current?q=city",
    forecast:
      "/forecast?q=city?alerts=true?airquality=true (Alerts and air quality are optional)",
    history: "/history?q=city&date=YYYY-MM-DD",
    marine: "/marine?q=city",
    future: "/future?q=city",
  });
});

// Current weather endpoint
router.get("/current", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query is required" });
  }

  const cacheKey = `current:${q}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    console.log("Returning cached data");
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(`${baseUrl}/current.json`, {
      params: {
        key: apiKey,
        q: q,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forecast weather endpoint
router.get("/forecast", async (req, res) => {
  const { q, alerts, airquality } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query is required" });
  }

  const cacheKey = `forecast:${q}:${alerts}:${airquality}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    console.log("Returning cached data");
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(`${baseUrl}/forecast.json`, {
      params: {
        key: apiKey,
        q: q,
        alerts: alerts,
        aqi: airquality,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// History weather endpoint
router.get("/history", async (req, res) => {
  const { q, date } = req.query;

  if (!q || !date) {
    return res.status(400).json({ message: "Query and date are required" });
  }

  const cacheKey = `history:${q}:${date}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    console.log("Returning cached data");
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(`${baseUrl}/history.json`, {
      params: {
        key: apiKey,
        q: q,
        dt: date,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Marine weather endpoint
router.get("/marine", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query is required" });
  }

  const cacheKey = `marine:${q}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    console.log("Returning cached data");
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(`${baseUrl}/marine.json`, {
      params: {
        key: apiKey,
        q: q,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Future weather endpoint
router.get("/future", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query are required" });
  }

  const cacheKey = `future:${q}`;

  if (
    cache[cacheKey] &&
    Date.now() - cache[cacheKey].timestamp < cacheDuration
  ) {
    console.log("Returning cached data");
    return res.json(cache[cacheKey].data);
  }

  try {
    const response = await axios.get(`${baseUrl}/forecast.json`, {
      params: {
        key: apiKey,
        q: q,
      },
    });

    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
