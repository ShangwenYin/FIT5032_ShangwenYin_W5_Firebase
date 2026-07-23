import { ref } from 'vue'

const HARDCODED_USERNAME = 'admin'
const HARDCODED_PASSWORD = 'password123'

const isAuthenticated = ref(false)
const registeredUsers = ref([])

export function useAuth() {
  const register = (username, password) => {
    registeredUsers.value.push({ username, password })
  }

  const login = (username, password) => {
    // check hardcoded credentials first
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      isAuthenticated.value = true
      return true
    }
    // then check registered users
    const match = registeredUsers.value.find(
      (u) => u.username === username && u.password === password
    )
    if (match) {
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    registeredUsers,
    register,
    login,
    logout
  }
}
