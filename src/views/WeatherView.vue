<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 10.1.2: 高德开放平台 Web服务 key
const apikey = 'f772d8ffe6aa3bbf93f9f9f302668f33'

const city = ref('')
const weatherData = ref(null)
const weatherIcon = ref('')
const error = ref('')
const isLoading = ref(false)

const iconMap = {
  晴: '☀️',
  多云: '⛅',
  阴: '☁️',
  雨: '🌧️',
  雪: '❄️',
  雾: '🌫️',
  雷: '⛈️',
  风: '💨',
}

const searchByCity = async () => {
  const cityName = city.value.trim()
  if (!cityName) {
    error.value = '请输入城市名称'
    return
  }

  isLoading.value = true
  error.value = ''
  weatherData.value = null

  try {
    // 第 1 步：地理编码——把城市名转成 adcode
    const geoResponse = await axios.get('https://restapi.amap.com/v3/geocode/geo', {
      params: { address: cityName, key: apikey },
    })
    const geo = geoResponse.data

    if (geo.status !== '1' || !geo.geocodes || geo.geocodes.length === 0) {
      error.value = '未找到该城市，请输入中国城市名称'
      return
    }

    const adcode = geo.geocodes[0].adcode

    // 第 2 步：查询实时天气
    const weatherResponse = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo', {
      params: { city: adcode, key: apikey },
    })
    const weather = weatherResponse.data

    if (weather.status !== '1' || !weather.lives || weather.lives.length === 0) {
      error.value = '获取天气失败，请稍后重试'
      return
    }

    const live = weather.lives[0]
    weatherData.value = live
    const iconKey = Object.keys(iconMap).find((k) => live.weather.includes(k))
    weatherIcon.value = iconKey ? iconMap[iconKey] : '🌡️'
  } catch (err) {
    console.error('Error fetching weather data:', err)
    error.value = '网络请求失败，请检查网络后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <div class="container lab-container">
      <header class="page-heading">
        <p class="section-label">API lab</p>
        <h1 class="page-title mb-2">WEATHER APP</h1>
        <p class="text-secondary mb-0">Search weather by city (China). Powered by AMap API.</p>
      </header>

      <section class="content-panel">
        <div class="search-bar">
          <input
            v-model="city"
            type="text"
            placeholder="Enter city name (e.g. 北京)"
            class="form-control search-input"
            @keyup.enter="searchByCity"
          />
          <button class="btn btn-primary search-button" type="button" :disabled="isLoading" @click="searchByCity">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            {{ isLoading ? 'Searching...' : 'Search' }}
          </button>
        </div>
        <p class="text-secondary hint-text">Search Weather by City.</p>

        <p v-if="error" class="alert alert-danger mb-0 mt-3" role="alert">{{ error }}</p>

        <div v-if="weatherData" class="weather-result">
          <h2>{{ weatherData.city }}</h2>
          <div class="weather-main">
            <span class="weather-icon">{{ weatherIcon }}</span>
            <p class="temperature">{{ weatherData.temperature }} C</p>
          </div>
          <p class="description">{{ weatherData.weather }} · {{ weatherData.winddirection }}风 {{ weatherData.windpower }}级</p>
          <p class="text-secondary mb-0">湿度 {{ weatherData.humidity }}% · 更新时间 {{ weatherData.reporttime }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.lab-container {
  max-width: 980px;
}

.page-heading {
  margin-bottom: 1.5rem;
}

.section-label {
  color: #b42318;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.search-bar {
  display: flex;
  gap: 0.75rem;
  max-width: 420px;
}

.search-input {
  flex: 1;
}

.hint-text {
  margin-top: 1rem;
}

.weather-result {
  margin-top: 1.5rem;
}

.weather-result h2 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
}

.weather-main {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.weather-icon {
  font-size: 2.5rem;
}

.temperature {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.description {
  font-size: 1.05rem;
  margin-top: 0.5rem;
}
</style>
