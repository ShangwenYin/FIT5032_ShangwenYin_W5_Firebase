<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref('')
const isLoading = ref(false)

// 阿里云 FC 云函数 countBooks 的公网访问地址（Web 函数，香港区域）
const FUNCTION_URL = 'http://countbooks-exbheqqacb.cn-hongkong.fcapp.run/'

const getBookCount = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await axios.get(FUNCTION_URL)
    count.value = response.data.count
  } catch (err) {
    console.error('Error fetching book count:', err)
    error.value = 'Error: Unable to fetch the book count.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <div class="container lab-container">
      <header class="page-heading">
        <p class="section-label">Cloud Functions lab</p>
        <h1 class="page-title mb-2">Book Counter</h1>
        <p class="text-secondary mb-0">Count the number of books stored in Firestore via a cloud function.</p>
      </header>

      <section class="content-panel">
        <button class="btn btn-primary" type="button" :disabled="isLoading" @click="getBookCount">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          {{ isLoading ? 'Loading...' : 'Get Book Count' }}
        </button>

        <p v-if="count !== null" class="count-result" role="status">
          Book count: <strong>{{ count }}</strong>
        </p>
        <p v-else-if="error" class="alert alert-danger mb-0 mt-3" role="alert">
          {{ error }}
        </p>
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

.count-result {
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}
</style>
