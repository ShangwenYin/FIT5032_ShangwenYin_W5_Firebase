<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Create an Account</h1>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="register-email" class="form-label">Email</label>
            <input
              type="text"
              class="form-control"
              id="register-email"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <label for="register-password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="register-password"
              v-model="password"
            />
          </div>
          <div v-if="errorMessage" class="text-danger mb-3">{{ errorMessage }}</div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Save to Firebase</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Firebase Register Successful!')
      router.push('/FireLogin')
    })
    .catch((error) => {
      console.log(error.code)
      errorMessage.value = 'Registration failed. Please try again.'
    })
}
</script>
