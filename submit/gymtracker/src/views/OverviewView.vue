<template>
  <div class="bg-gradient-to-b from-gray to-darkgray min-h-[calc(100vh-4rem)] text-white">
    <div class="max-w-lg mx-auto bg-gray p-6 rounded-lg shadow-lg mb-10">
      <form id="add-exercise" class="space-y-4" @submit.prevent="submitExercise">
        <h2 class="font-black text-2xl mb-4 border-b border-white pb-2">Add Exercise</h2>

        <div class="flex flex-col space-y-1">
          <label for="exercise-name" class="text-sm font-semibold">Exercise:</label>
          <select
            class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
            id="exercise-name"
            name="exercise"
            v-model="selectedExercise"
          >
            <option v-for="exercise in exercises" :key="exercise">{{ exercise }}</option>
          </select>
        </div>
        <input
          v-if="selectedExercise === 'Other'"
          type="text"
          id="custom-exercise"
          placeholder="Enter exercise name"
          class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
        />

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col space-y-1">
            <label for="exercise-sets" class="text-sm font-semibold">Sets:</label>
            <input
              type="number"
              id="exercise-sets"
              name="sets"
              min="1"
              step="1"
              required
              class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div class="flex flex-col space-y-1">
            <label for="exercise-weight" class="text-sm font-semibold">Weight:</label>
            <input
              type="number"
              id="exercise-weight"
              name="weight"
              min="1"
              step="0.5"
              required
              class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col space-y-1">
            <label for="exercise-reps" class="text-sm font-semibold">Reps:</label>
            <input
              type="number"
              id="exercise-reps"
              name="reps"
              min="1"
              step="0.5"
              required
              class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div class="flex flex-col space-y-1">
            <label for="exercise-rir" class="text-sm font-semibold">RIR:</label>
            <input
              type="number"
              id="exercise-rir"
              name="rir"
              min="0"
              step="0.5"
              required
              class="bg-zinc-700 text-white p-2 rounded-md transition-all duration-150 ease-in hover:bg-grayhover focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in"
        >
          Add Exercise
        </button>
      </form>
      <button
        @click="getRandomTip"
        class="w-full bg-zinc-700 hover:bg-grayhover text-white font-bold py-2 px-4 rounded transition duration-150 ease-in mt-4 mb-2"
      >
        Get a Random Tip
      </button>
      <div v-if="randomTip" class="text-center text-white mt-2">{{ randomTip }}</div>


    <div class="mt-6 space-y-4">
      <h2 class="font-black text-2xl mb-4 border-b border-white pb-2">Live Activity</h2>
      <div class="max-h-40 overflow-y-auto space-y-2">
        <div
          v-for="activity in liveActivities"
          :key="activity.id"
          class="bg-zinc-700 p-3 rounded-md text-sm"
        >
          <div class="flex justify-between items-center">
            <span class="font-semibold">{{ activity.exercise }}</span>
          </div>
          <div class="text-gray-300">
            {{ activity.sets }} sets × {{ activity.reps }} reps @ {{ activity.weight }}kg
          </div>
        </div>
        <div v-if="liveActivities.length === 0" class="text-center text-gray-400 py-4">
          No recent activity
        </div>
      </div>
    </div>
  </div>
    <div>
      <section class="max-w-5xl mx-auto bg-gray p-6 rounded-lg shadow-lg">
        <h2 class="font-black text-2xl mb-6 border-b border-gray-600 pb-2">Exercise History</h2>
        <div class="flex items-center justify-center mb-4 text-xl">
          <button
            @click="dateBackwards"
            id="go-back"
            class="change-date text-white hover:text-gray-300 px-4 transition-colors cursor-pointer"
          >
            &larr;
          </button>
          <span class="font-medium">{{ date.toISOString().slice(0, 10) }}</span>
          <button
            @click="dateForwards"
            id="go-forward"
            class="change-date text-white hover:text-gray-300 px-4 transition-colors cursor-pointer"
          >
            &rarr;
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-gray-800 rounded-lg">
            <thead class="bg-zinc-700">
              <tr>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Exercise
                </th>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Sets
                </th>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Weight
                </th>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Reps
                </th>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  RIR
                </th>
                <th
                  class="px-1 py-1 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-600 bg-zinc-800">
              <tr
                v-for="item in exerciseList.filter((i) => i[date.toISOString().slice(0, 10)])"
                :key="item._id"
                class="hover:bg-grayhover transition-colors"
              >
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <input
                      v-model="editForm.exercise"
                      class="bg-zinc-700 text-white p-1 rounded w-20"
                    />
                  </template>
                  <template v-else>
                    {{ item[date.toISOString().slice(0, 10)]?.exercise || '' }}
                  </template>
                </td>
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <input
                      v-model="editForm.sets"
                      type="number"
                      class="bg-zinc-700 text-white p-1 rounded w-12"
                    />
                  </template>
                  <template v-else>
                    {{ item[date.toISOString().slice(0, 10)]?.sets || '' }}
                  </template>
                </td>
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <input
                      v-model="editForm.weight"
                      type="number"
                      class="bg-zinc-700 text-white p-1 rounded w-12"
                    />
                  </template>
                  <template v-else>
                    {{ item[date.toISOString().slice(0, 10)]?.weight || '' }}
                  </template>
                </td>
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <input
                      v-model="editForm.reps"
                      type="number"
                      class="bg-zinc-700 text-white p-1 rounded w-12"
                    />
                  </template>
                  <template v-else>
                    {{ item[date.toISOString().slice(0, 10)]?.reps || '' }}
                  </template>
                </td>
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <input
                      v-model="editForm.rir"
                      type="number"
                      class="bg-zinc-700 text-white p-1 rounded w-12"
                    />
                  </template>
                  <template v-else>
                    {{ item[date.toISOString().slice(0, 10)]?.rir || '' }}
                  </template>
                </td>
                <td class="px-1 py-1 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base">
                  <template v-if="editingRowId === item._id">
                    <button
                      @click="editExercise"
                      class="bg-zinc-700 mr-1 hover:bg-grayhover text-white font-bold py-1 px-3 rounded transition duration-150 ease-in text-xs cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      @click="cancelEdit"
                      class="bg-zinc-700 block md:inline hover:bg-grayhover text-white font-bold py-1 px-3 rounded transition duration-150 ease-in text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(item)"
                      class="bg-zinc-700 mr-1 hover:bg-grayhover text-white font-bold py-1 px-3 rounded transition duration-150 ease-in text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteExercise(item._id)"
                      class="bg-zinc-700 block md:inline hover:bg-grayhover text-white font-bold py-1 px-3 rounded transition duration-150 ease-in text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { io } from 'socket.io-client'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
})

const socket = io('http://localhost:3002')

export default {
  data() {
    return {
      //TODO: This should be something like the 3 most common exercises and "Other" at some point.
      exercises: ['Bench Press', 'Squat', 'Deadlift', 'Other'],
      selectedExercise: 'Bench Press',
      exerciseList: [],
      date: new Date(),
      editingRowId: null,
      editForm: {},
      randomTip: '',
      liveActivities: [],
    }
  },
  methods: {
    cancelEdit() {
      this.editingRowId = null
      this.editForm = {}
    },
    startEdit(item) {
      this.editingRowId = item._id
      const dateKey = this.date.toISOString().slice(0, 10)
      this.editForm = {
        _id: item._id,
        date: dateKey,
        exercise: item[dateKey]?.exercise || '',
        sets: item[dateKey]?.sets || '',
        weight: item[dateKey]?.weight || '',
        reps: item[dateKey]?.reps || '',
        rir: item[dateKey]?.rir || '',
      }
    },
    async editExercise() {
      try {
        await apiClient.put('/api/editexercise', this.editForm)
        await this.getExercises()
        this.editingRowId = null
        this.editForm = {}
      } catch (error) {
        await this.getExercises()
        this.editingRowId = null
        this.editForm = {}
        console.log('Error: ' + error)
      }
    },
    async deleteExercise(id) {
      try {
        await apiClient.delete('/api/deleteexercise', { params: { _id: id } })
        await this.getExercises()
      } catch (error) {
        console.log('Error: ' + error)
      }
    },
    dateForwards() {
      this.date = new Date(this.date.setDate(this.date.getDate() + 1))
    },
    dateBackwards() {
      this.date = new Date(this.date.setDate(this.date.getDate() - 1))
    },
    async getExercises() {
      const res = await apiClient.get('/api/exerciselist', {
        params: {
          userid: 'test',
        },
      })

      this.exerciseList = res.data
    },
    async submitExercise(event) {
      const form = event.target
      const exercise = form['custom-exercise']
        ? form['custom-exercise'].value
        : form['exercise-name'].value
      const sets = form['exercise-sets'].value
      const weight = form['exercise-weight'].value
      const reps = form['exercise-reps'].value
      const rir = form['exercise-rir'].value
      const date = this.date.toISOString().slice(0, 10)

      const payload = {
        userid: 'test',
        [date]: {
          exercise: exercise,
          sets: sets,
          weight: weight,
          reps: reps,
          rir: rir,
        },
      }

      form.reset()
      this.selectedExercise = this.exercises[0]

      try {
        await apiClient.post('/api/addexercise', payload)
        this.getExercises()
      } catch (error) {
        console.log('Error: ' + error)
      }
    },
    async getRandomTip() {
      try {
        let res = await apiClient.get('/api/randomtip')
        if (this.randomTip) {
          while (this.randomTip === res.data.tip) res = await apiClient.get('/api/randomtip')
        }
        this.randomTip = res.data.tip
      } catch (e) {
        this.randomTip = 'Could not fetch tip.' + e
      }
    },
    addLiveActivity(activity) {
      const newActivity = {
        ...activity,
        id: Date.now() + Math.random()
      }
      this.liveActivities.unshift(newActivity)
      if (this.liveActivities.length > 10) {
        this.liveActivities = this.liveActivities.slice(0, 10)
      }
    },
  },
  mounted() {
    this.getExercises()
    this.date = new Date()

    socket.emit('joinWorkoutRoom')


    socket.on('newExercise', (exerciseData) => {
      this.addLiveActivity(exerciseData)
    })
  },
}
</script>
