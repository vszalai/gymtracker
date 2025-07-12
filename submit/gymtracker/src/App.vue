<template>
  <header>
    <nav class="hidden md:flex">
      <ul class="flex items-center text-white list-none h-16 bg-gray min-w-full">
        <li>
          <RouterLink
            to="/"
            class="flex items-center h-16 px-4 hover:bg-grayhover transition-colors"
            id="logo"
            ><img class="max-w-12 max-h-12" src="../logo.png" />GymTracker</RouterLink
          >
        </li>
        <li>
          <RouterLink
            v-if="isLoggedIn"
            to="/overview"
            class="flex items-center h-16 px-4 hover:bg-grayhover transition-colors"
            >Overview</RouterLink
          >
        </li>
        <li class="ml-auto">
          <RouterLink
            v-if="!isLoggedIn"
            to="/login"
            class="flex items-center h-16 px-4 hover:bg-grayhover transition-colors"
            >Login</RouterLink
          >
          <RouterLink
            v-if="isLoggedIn"
            to="/profile"
            class="flex items-center h-16 px-4 hover:bg-grayhover transition-colors"
            >Profile</RouterLink
          >
        </li>
      </ul>
    </nav>

    <nav class="flex md:hidden relative">
      <div class="flex items-center text-white list-none h-16 bg-gray min-w-full">
        <li>
          <button
            class="flex items-center h-16 px-4 hover:bg-grayhover ease-in duration-75 text-2xl text-white focus:outline-none"
            @click="toggleMenu"
            id="logo"
          >
            <img class="max-w-12 max-h-12" src="../logo.png" />
            <span class="ml-2">&#9776;</span>
          </button>
        </li>
      </div>
      <transition name="fade">
        <ul
          v-if="showMobileMenu"
          class="absolute top-16 left-0 w-full bg-gray text-white flex flex-col z-50 shadow-lg"
        >
          <li>
            <RouterLink
              to="/"
              class="block px-4 py-3 hover:bg-grayhover transition-colors"
              @click="closeMenu"
              >Home</RouterLink
            >
          </li>
          <li v-if="isLoggedIn">
            <RouterLink
              to="/overview"
              class="block px-4 py-3 hover:bg-grayhover transition-colors"
              @click="closeMenu"
              >Overview</RouterLink
            >
          </li>
          <li v-if="!isLoggedIn">
            <RouterLink
              to="/login"
              class="block px-4 py-3 hover:bg-grayhover transition-colors"
              @click="closeMenu"
              >Login</RouterLink
            >
          </li>
          <li v-if="isLoggedIn">
            <RouterLink
              to="/profile"
              class="block px-4 py-3 hover:bg-grayhover transition-colors"
              @click="closeMenu"
              >Profile</RouterLink
            >
          </li>
        </ul>
      </transition>
    </nav>
  </header>
  <div class="">
    <RouterView />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      showMobileMenu: false,
    }
  },
  created() {
    window.addEventListener('storage', this.syncLoginState)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncLoginState)
  },
  methods: {
    syncLoginState() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    },
    toggleMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    closeMenu() {
      this.showMobileMenu = false
    },
  },
  watch: {
    $route() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      this.showMobileMenu = false
    },
  },
}
</script>
