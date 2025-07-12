<template>
  <div
    class="bg-gradient-to-b from-gray to-darkgray min-h-[calc(100vh-4rem)] text-white flex items-center justify-center"
  >
    <div class="max-w-md w-full bg-gray p-8 rounded-lg shadow-lg">
      <form class="space-y-6" @submit.prevent="register">
        <h2 class="font-black text-2xl mb-4 border-b border-white pb-2 text-center">Register</h2>
        <div class="flex flex-col space-y-1">
          <label for="username" class="text-sm font-semibold">Username:</label>
          <input
            v-model="username"
            type="text"
            id="username"
            name="username"
            required
            class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="email" class="text-sm font-semibold">Email:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            name="email"
            required
            class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="password" class="text-sm font-semibold">Password:</label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            required
            class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="password2" class="text-sm font-semibold">Confirm password:</label>
          <input
            v-model="password2"
            type="password"
            id="password2"
            name="password2"
            required
            class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in"
        >
          Register
        </button>
        <div v-if="error" class="text-red-400 text-center mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
})

export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      password2: '',
      error: '',
    }
  },
  methods: {
    async register() {
      if (this.password != this.password2) {
        this.error = 'Passwords do not match.'
        return
      }
      try {
        await apiClient.post('/api/register', {
          username: this.username,
          password: this.password,
          email: this.email,
        })
        this.error = ''
        this.$router.push({ name: 'login' })
      } catch (e) {
        this.error = e.response?.data?.error
      }
    },
  },
}
</script>
