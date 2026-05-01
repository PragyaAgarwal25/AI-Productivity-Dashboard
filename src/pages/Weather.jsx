import { useState, useEffect, useCallback } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"

function getWeatherEmoji(code) {
  if (code >= 200 && code < 300) return "⛈"
  if (code >= 300 && code < 400) return "🌦"
  if (code >= 500 && code < 600) return "🌧"
  if (code >= 600 && code < 700) return "❄️"
  if (code >= 700 && code < 800) return "🌫"
  if (code === 800) return "☀️"
  if (code === 801) return "🌤"
  if (code === 802) return "⛅"
  if (code >= 803) return "☁️"
  return "🌤"
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Weather() {
  const [unit, setUnit]         = useState("C")
  const [search, setSearch]     = useState("")
  const [weather, setWeather]   = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const conv = (t) => unit === "C" ? Math.round(t) : Math.round(t * 9 / 5 + 32)

  const fetchWeather = useCallback(async (cityName) => {
    if (!API_KEY) {
      setError("API key missing. Add VITE_WEATHER_API_KEY in your .env file and restart dev server.")
      return
    }
    setLoading(true)
    setError("")
    try {
      // Current weather
      const res = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      )
      if (!res.ok) throw new Error("City not found. Please check the name and try again.")
      const data = await res.json()

      setWeather({
        city:       data.name,
        country:    data.sys.country,
        temp:       data.main.temp,
        feels:      data.main.feels_like,
        condition:  data.weather[0].description,
        humidity:   data.main.humidity,
        wind:       Math.round(data.wind.speed * 3.6),
        visibility: Math.round((data.visibility || 10000) / 1000),
        emoji:      getWeatherEmoji(data.weather[0].id),
      })

      // 5-day forecast
      const fRes  = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      )
      const fData = await fRes.json()

      const daily = {}
      fData.list.forEach((item) => {
        const date   = new Date(item.dt * 1000)
        const dayKey = date.toDateString()
        if (!daily[dayKey]) {
          daily[dayKey] = {
            day:  DAY_NAMES[date.getDay()],
            high: item.main.temp_max,
            low:  item.main.temp_min,
            icon: getWeatherEmoji(item.weather[0].id),
          }
        } else {
          if (item.main.temp_max > daily[dayKey].high) daily[dayKey].high = item.main.temp_max
          if (item.main.temp_min < daily[dayKey].low)  daily[dayKey].low  = item.main.temp_min
        }
      })
      setForecast(Object.values(daily).slice(0, 5))

    } catch (err) {
      setError(err.message || "Failed to fetch weather data.")
    }
    setLoading(false)
  }, [])

  // Fetch New Delhi on mount
  useEffect(() => {
    fetchWeather("New Delhi")
  }, [fetchWeather])

  function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    fetchWeather(search.trim())
    setSearch("")
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>Weather</h2>
        <div style={{ display: "flex", gap: 4 }}>
          {["C", "F"].map((u) => (
            <Button key={u} variant={unit === u ? "primary" : "ghost"} onClick={() => setUnit(u)} style={{ padding: "6px 14px", fontSize: 13 }}>
              °{u}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 8, marginBottom: 20 }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={15} color="var(--text-muted)" />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any city…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--input-bg)", color: "var(--text)",
              fontSize: 14, fontFamily: "inherit", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <Button variant="primary" onClick={handleSearch} style={{ padding: "9px 20px" }}>
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 10,
          background: "#FEF2F2", border: "1px solid #FCA5A5",
          color: "#EF4444", fontSize: 13, marginBottom: 16,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🌤</div>
          Fetching weather data…
        </div>
      )}

      {/* Weather display */}
      {!loading && weather && (
        <>
          {/* Hero */}
          <div style={{
            borderRadius: 16, padding: 24, marginBottom: 16,
            background: "linear-gradient(135deg, #6C63FF, #06B6D4)",
            color: "#fff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 6 }}>
                  {weather.city}, {weather.country}
                </div>
                <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
                  {conv(weather.temp)}°
                </div>
                <div style={{ fontSize: 16, marginTop: 10, opacity: 0.9, textTransform: "capitalize" }}>
                  {weather.condition}
                </div>
                <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                  Feels like {conv(weather.feels)}°
                </div>
              </div>
              <div style={{ fontSize: 88 }}>{weather.emoji}</div>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 20, borderTop: "1px solid #ffffff30", paddingTop: 16 }}>
              {[
                { label: "Humidity",   value: `${weather.humidity}%`    },
                { label: "Wind",       value: `${weather.wind} km/h`    },
                { label: "Visibility", value: `${weather.visibility} km` },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{s.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5-day forecast */}
          {forecast.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
                5-Day Forecast
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                {forecast.map((f, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "14px 8px", borderRadius: 12, background: "var(--bg)" }}>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{f.day}</div>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{conv(f.high)}°</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{conv(f.low)}°</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 10 }}>
            Powered by OpenWeatherMap API
          </p>
        </>
      )}
    </div>
  )
}