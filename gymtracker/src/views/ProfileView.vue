<template>
  <div
    class="bg-gradient-to-b from-gray to-darkgray min-h-[calc(100vh-4rem)] text-white flex items-center justify-center"
  >
    <div class="max-w-md w-full bg-gray p-8 rounded-lg shadow-lg flex flex-col items-center">
      <h2 class="font-black text-2xl mb-4 border-b border-white pb-2 text-center w-full">
        Profile
      </h2>
      <div class="mb-6 w-full text-center">
        <p class="text-lg font-semibold">Username:</p>
        <p class="text-xl">test</p>
      </div>
      <button
        @click="logout"
        class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in mt-4"
      >
        Logout
      </button>
      <button
        @click="deleteAllExercises"
        class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in mt-4"
      >
        Delete all exercises
      </button>
      <button
        @click="getStats"
        class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in mt-4"
      >
        Show My Stats
      </button>
      <div v-if="stats" class="w-full mt-4 bg-zinc-800 rounded p-4 text-center">
        <p class="mb-2">
          <span class="font-semibold">Total exercises:</span> {{ stats.totalExercises }}
        </p>
        <p class="mb-2">
          <span class="font-semibold">Most common exercise:</span>
          {{ stats.mostCommonExercise || 'Not found' }}
        </p>
        <p>
          <span class="font-semibold">Total weight lifted:</span> {{ stats.totalWeightLifted }} kg
        </p>
      </div>
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
      stats: null,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn')
      this.$router.push({ name: 'login' })
    },
    async deleteAllExercises() {
      try {
        await apiClient.delete('api/deleteallexercises', { params: { userid: 'test' } })
      } catch (e) {
        console.log('Error' + e)
      }
    },
    async getStats() {
      try {
        const res = await apiClient.get('/api/stats', { params: { userid: 'test' } })
        this.stats = res.data
      } catch (e) {
        this.stats = { totalExercises: 0, mostCommonExercise: 'Not found', totalWeightLifted: 0 }
      }
    },
  },
}
</script>
