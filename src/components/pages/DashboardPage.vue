<template>
  <layout-div>
    <div class="row justify-content-md-center">
      <div class="col-12">
        <h3 class="text-center mt-3">
          Welcome,
          <span
            class="spinner-border spinner-border-sm mt-2 mb-1"
            role="status"
            aria-hidden="true"
            v-if="!value"
          ></span>
          <span class="text-primary">{{ user?.name }} </span>
        </h3>
        <h5 class="font-weight-light text-center text-muted mt-1 mb-2">
          Email:
          <span
            class="spinner-border spinner-border-sm mt-2"
            role="status"
            aria-hidden="true"
            v-if="!value"
          ></span>
          <span class="font-weight-light text-primary text-decoration-underline">
            {{ user?.email }}
          </span>
        </h5>
        <p class="text-center text-secondary">You have been logged in using jwt-authenication</p>
        <div class="border-top">
          <p class="text-center mt-2">
            For updating Account details go to <router-link to="/account">Account</router-link>
          </p>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios'
import LayoutDiv from '../LayoutDiv.vue'

export default {
  name: 'DashboardPage',
  components: {
    LayoutDiv
  },
  data() {
    return {
      user: {},
      value: false
    }
  },
  created() {
    if (localStorage.getItem('token') == '' || localStorage.getItem('token') == null) {
      this.$router.push('/')
    } else {
      this.getUser()
    }
  },
  methods: {
    getUser() {
      axios
        .get('/user', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then((r) => {
          this.user = r.data
          console.log(this.user)
          this.value = true
          return r
        })
        .catch((error) => {
          if (error.response.data.error == 'TokenExpired') {
            this.refreshUser()
          } else {
            console.log(error.response.data.error)
            localStorage.clear()
            this.$router.push('/')
          }
          return error
        })
    },
    refreshUser() {
      let data

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/refresh',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('refresh_token')
        },
        data: data
      }

      axios
        .request(config)
        .then((response) => {
          localStorage.setItem('token', response.data.token)
          this.getUser()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
