<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid ml-4">
      <a class="navbar-brand" href="/">IEEE-JU</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-lg-0" v-if="isLogged === true">
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/register">Register</a>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-lg-0" v-else>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/dashboard">Dashboard</a>
          </li>
          <li class="nav-item">
            <a @click="logoutAction()" class="nav-link" aria-current="page" href="#">
              Logout
              <span
                class="spinner-border spinner-border-sm ml-1"
                role="status"
                aria-hidden="true"
                v-if="logged"
              ></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container pt-3">
    <slot></slot>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LayoutDiv',
  data() {
    return {
      isLogged: this.checkIfIsLogged(),
      logged: false
    }
  },
  created() {
    this.isLogged = !(
      localStorage.getItem('token') != '' &&
      localStorage.getItem('token') != null &&
      localStorage.getItem('token') != 'undefined'
    )
  },
  methods: {
    logoutAction() {
      this.logged = true
      axios
        .all([
          axios.delete('/logout', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          }),
          axios.delete('/logout', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('refresh_token') }
          })
        ])
        .then(
          axios.spread((obj1, obj2) => {
            localStorage.setItem('token', '')
            localStorage.setItem('refresh_token', '')
            this.isLogged = true
            this.logged = false
            this.$router.push('/')
          })
        )
    },
    checkIfIsLogged() {
      let token = localStorage.getItem('token')
      if (token != '' && token != null && token != 'undefined') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
