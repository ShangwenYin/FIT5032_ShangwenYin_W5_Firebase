<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Sign in</h1>
        <form @submit.prevent="signin">
          <div class="mb-3">
            <label for="firebase-email" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="firebase-email"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <label for="firebase-password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="firebase-password"
              v-model="password"
            />
          </div>
          <div v-if="errorMessage" class="text-danger mb-3">{{ errorMessage }}</div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Sign in via Firebase</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '../Firebase/init.js'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Firebase Login Successful!')
      router.push('/')
      console.log(auth.currentUser)
    })
    .catch((error) => {
      console.log(error.code)
      errorMessage.value = 'Login failed. Please check your email and password.'
    })
}
</script>
