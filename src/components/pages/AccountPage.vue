<template>
  <layout-div>
    <div class="content-section">
      <div class="media-body">
        <legend class="border-bottom mb-2">Account Info</legend>

        <h6 class="mt-3">
          Name:
          <span
            class="spinner-border spinner-border-sm mt-2 mb-1"
            role="status"
            aria-hidden="true"
            v-if="!value"
          ></span
          >{{ current_user?.name }}
        </h6>
        <h6 class="mb-3">
          Email:
          <span
            class="spinner-border spinner-border-sm mt-2 mb-1"
            role="status"
            aria-hidden="true"
            v-if="!value"
          ></span
          ><span class="text-primary text-decoration-underline">{{ current_user?.email }}</span>
        </h6>
      </div>
    </div>
    <form @submit.prevent="updateAction">
      <div class="form-group">
        <div class="content-section">
          <fieldset class="form-group">
            <legend class="border-bottom mb-4">Update Account Details</legend>
            <div class="form-group mb-3">
              <label htmlFor="username" class="form-label">Name </label>
              <input
                v-model="username"
                type="username"
                class="form-control"
                id="username"
                name="username"
              />
              <span class="text-muted mt-1">*Keep this empty if you donot want to change this</span>
            </div>
            <div class="form-group mb-3">
              <label htmlFor="email" class="form-label"> Email address </label>

              <input v-model="email" type="email" class="form-control" id="email" name="email" />
              <span class="text-muted mt-1">*Keep this empty if you donot want to change this</span>
              <p v-if="validationErrors.length != 0" class="text-center">
                <div v-for="validation in validationErrors">
                    <small class="text-danger">{{ validation }}</small>
                </div>
              </p>
            </div>

            <!-- <div class="invalid-feedback">
            <span></span>
          </div> -->
          </fieldset>
          <div class="form-group">
            <button :disabled="isSubmitting" class="btn btn-outline-info mb-2">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-if="isSubmitting"
              ></span>
              Update
            </button>
          </div>
          <div class="border-top mt-3 mb-3 pt-3">
            <p class="text-center">
              No Changes? Go back to
              <router-link to="/dashboard">Dashboard </router-link>
              Page
            </p>
          </div>
        </div>
      </div>
    </form>
  </layout-div>
</template>
<script>
import axios from 'axios'
import LayoutDiv from '../LayoutDiv.vue'
export default {
  name: 'AccountPage',
  components: {
    LayoutDiv
  },
  data() {
    return {
      current_user: {},
      value: false,
      isSubmitting: false,
      validationErrors: new Set(),
      username: '',
      email: ''
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
          this.current_user = r.data
          console.log(this.current_user)
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
    },
    updateAction() {
      this.isSubmitting = true
      let data = JSON.stringify({
        name: this.username,
        email: this.email
      })

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: '/user/update',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        data: data
      }

      axios
        .request(config)
        .then((response) => {
          this.isSubmitting = false
          this.$router.push('/dashboard')
          return response
        })
          .catch((error) => {
            this.isSubmitting = false
            if (error.response.data.error != undefined) {
                this.validationErrors.add(error.response.data.error)
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
