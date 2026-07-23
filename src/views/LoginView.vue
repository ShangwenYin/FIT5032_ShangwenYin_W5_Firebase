<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  if (login(username.value, password.value)) {
    router.push('/')
  } else {
    errorMessage.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Login</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="login-username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="login-username"
              v-model="username"
            />
          </div>
          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="login-password"
              v-model="password"
            />
          </div>
          <div v-if="errorMessage" class="text-danger mb-3">{{ errorMessage }}</div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
