<script setup>
import { onMounted, ref } from 'vue'
// 直接导入 JSON（Vite 打包时内联，部署后路径不失效）
import authorsData from '../assets/json/authors.json'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)
const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null
  try {
    authors.value = authorsData
    calculateStats()
  } catch (err) {
    error.value = 'Error loading authors data: ' + err.message
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }
  apiResponse.value = {
    success: true,
    data: {
      authorsCount: authorsCount.value,
      totalBooks: totalBooks.value,
      authors: authors.value.map((author) => ({
        name: author.name,
        bookCount: author.famousWorks.length,
      })),
    },
    timestamp: new Date().toISOString(),
  }
}

onMounted(() => {
  getApiData()
})

defineExpose({
  getApiData,
})
</script>

<template>
  <main class="page-shell">
    <div class="container lab-container">
      <header class="page-heading">
        <p class="section-label">API lab</p>
        <h1 class="page-title mb-2">Count Book API</h1>
        <p class="text-secondary mb-0">Display local authors.json data as a JSON API response.</p>
      </header>

      <section class="content-panel">
        <p v-if="loading" class="text-secondary mb-0">Loading...</p>
        <p v-else-if="error" class="alert alert-danger mb-0" role="alert">{{ error }}</p>
        <div v-else-if="apiResponse" class="api-response">
          <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
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

.api-response pre {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 0;
  max-height: 480px;
  overflow: auto;
  padding: 1rem;
  white-space: pre-wrap;
}</style>
