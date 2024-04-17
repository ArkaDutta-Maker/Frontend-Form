<template>
  <layout-div>
    <div class="row justify-content-md-center">
      <div class="col-12">
        <h3 class="text-center mt-5">
          Welcome,
          <span
            class="spinner-border spinner-border-sm mt-2 mb-1"
            role="status"
            aria-hidden="true"
            v-if="!value"
          ></span
          >{{ user?.name }}!
        </h3>
        <h5 class="text-center mt-5">You have been logged in using jwt-authenication!</h5>
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
    this.getUser()
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
            axios
              .post('/refresh', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('refresh_token') }
              })
              .then((response) => {
                localStorage.setItem('token', response.data.token)
                this.getUser()
                return response
              })
          }
          return error
        })
    }
  }
}
</script>
