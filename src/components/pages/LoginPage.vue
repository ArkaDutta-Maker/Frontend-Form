<template>
  <layout-div>
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-md-4">
          <div class="content-section">
            <form @submit.prevent="loginAction">
              <fieldset class="form-group">
                <legend class="border-bottom mb-4">Sign In</legend>
                <div class="form-group mb-3">
                  <label htmlFor="email" class="form-label"> Email address </label>
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label htmlFor="password" class="form-label">Password </label>
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    required
                  />
                </div>
                <p v-if="Object.keys(validationErrors).length != 0" class="text-center">
                  <small class="text-danger">Incorrect Email or Password</small>
                </p>
              </fieldset>
              <div class="form-group text-center">
                <button :disabled="isSubmitting" class="btn btn-outline-dark">Login</button>
                <div class="border-top mt-3 mb-3 pt-3">
                  <p class="text-center">
                    Don't have account?
                    <router-link to="/register">Register here </router-link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios'
import LayoutDiv from '../LayoutDiv.vue'

export default {
  name: 'LoginPage',
  components: {
    LayoutDiv
  },
  data() {
    return {
      email: '',
      password: '',
      validationErrors: [],
      isSubmitting: false
    }
  },
  created() {
    if (
      localStorage.getItem('token') != '' &&
      localStorage.getItem('token') != null &&
      localStorage.getItem('token') != 'undefined'
    ) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    loginAction() {
      this.isSubmitting = true
      let payload = {
        email: this.email,
        password: this.password
      }
      axios
        .post('/login', payload)
        .then((response) => {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('refresh_token', response.data.refresh_token)
          this.$router.push('/dashboard')
          return response
        })
        .catch((error) => {
          this.isSubmitting = false
          if (error.response.data.error != undefined) {
            this.validationErrors.push(error.response.data.error)
          }
          console.log(error.response.data.error)
          return error
        })
    }
  }
}
</script>
<style scoped>
body {
  background: #fafafa;
  color: #333333;
  margin-top: 5rem;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #444444;
}

.bg-steel {
  background-color: #5f788a;
}

.site-header .navbar-nav .nav-link {
  color: #cbd5db;
}

.site-header .navbar-nav .nav-link:hover {
  color: #ffffff;
}

.site-header .navbar-nav .nav-link.active {
  font-weight: 500;
}

.content-section {
  background: #ffffff;
  padding: 10px 20px;
  border: 1px solid #dddddd;
  border-radius: 3px;
  margin-bottom: 20px;
}

.article-title {
  color: #444444;
}

a.article-title:hover {
  color: #428bca;
  text-decoration: none;
}

.article-content {
  white-space: pre-line;
}

.article-img {
  height: 65px;
  width: 65px;
  margin-right: 16px;
}

.article-metadata {
  padding-bottom: 1px;
  margin-bottom: 4px;
  border-bottom: 1px solid #e3e3e3;
}

.article-metadata a:hover {
  color: #333;
  text-decoration: none;
}

.article-svg {
  width: 25px;
  height: 25px;
  vertical-align: middle;
}

.account-img {
  height: 125px;
  width: 125px;
  margin-right: 20px;
  margin-bottom: 16px;
}

.account-heading {
  font-size: 2.5rem;
}
</style>
