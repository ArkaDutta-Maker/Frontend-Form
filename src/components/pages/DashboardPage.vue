<template>
  <layout-div>
    <div class="row justify-content-md-center">
      <div class="col-12">
        <h2 class="text-center mt-5">Welcome, {{ user?.name }}!</h2>
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
      user: {}
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
