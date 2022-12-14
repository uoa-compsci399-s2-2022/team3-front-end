<script setup lang="ts">
import LoginBackground from '@/components/backgrounds/LoginBackground.vue'
import {onBeforeMount, reactive, ref} from 'vue';
import {get, post} from '@/utils/request'
import {useUserStore, usePermissionStore} from '@/store'
import {useRouter} from 'vue-router';
import {ElMessage} from "element-plus";


const data = reactive({
  userID: "",
  password: ""
})

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const login = () => {
  post("/api/login", data).then(
      responce => {
        userStore.setToken(responce.token);
      }
  ).then(
      () => {
        get('/api/currentUser').then(
            responce => {
              userStore.setUserId(responce.id);
              permissionStore.setKeyFromGroups(responce.groups);
              sessionStorage.setItem('mtms_keys', JSON.stringify(permissionStore.getKey))
            })
      }
  ).then(() => {
    router.push('/dashboard').then(() => {
      router.go(0)
    })
  }).catch((err) => {
        ElMessage({
          message: err.response.data.message,
          type: 'error'
        })
      }
  )
}

const allowRegister = ref(false)
const getSetting = () => {
  get('api/setting').then((res) => {
    allowRegister.value = res.allowRegister
  }).catch((e) => {
    ElMessage({
      message: e.response.data['message'],
      type: 'error'
    })
  })
}

onBeforeMount(() => {
  getSetting()
})


</script>

<template>
  <LoginBackground/>
  <div class="container">
    <div class="login-window">
      <img src="@/assets/logo/uoa.svg" alt="" class="logo">

      <div class="title">Login</div>
      <form>
        <input type="text" placeholder="Username" v-model="data.userID">
        <input type="password" placeholder="Password" v-model="data.password">
        <div class="keep-login"><input type="checkbox" class="login-options"><span>Keep me logged in</span>
        </div>
        <button type="submit" @click.prevent="login">Login</button>
        <span class="register-prompt" v-if="allowRegister">Don't have an account? Click <router-link
            to="/register">here</router-link> to sign up.</span>
      </form>

    </div>
  </div>
</template>

<style scoped lang="scss">

.register-prompt {
  font-size: 14px;

  a {
    text-decoration: none;
    color: #003867;
    font-size: 18px;
  }

  a:hover {
    text-decoration: underline;
  }
}

.container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
}

.login-window {
  margin-right: 20vw;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;

  img {
    position: absolute;
    width: 160px;
    height: 160px;
    left: 0;
    top: 0;
  }

  .title {
    font-size: 28.83px;
    font-weight: 600;
    letter-spacing: 0px;
    margin: 20px 0;
    /* Primary */
    color: #003867;
  }

  form {
    display: flex;
    flex-direction: column;
    row-gap: 20px;

    input {
      padding-left: 20px;
      font-size: 14px;
      width: 350px;
      height: 45px;
      border-radius: 8px;
      border: none;
      background: rgba(0, 128, 167, 0.2);
    }

    input::placeholder {
      color: #22285E
    }

    input:focus {
      outline: none;
      border: 1px solid #000000;
    }

    .keep-login {
      display: flex;

      span {
        font-size: 14px;
        margin-left: 10px;
      }
    }

    input[type="checkbox"] {
      -webkit-appearance: none;
      border: 1px solid #003867;
      background-color: transparent;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
    }

    input[type="checkbox"]:checked {
      background-color: rgba(0, 128, 167, 0.1);
    }

    input[type="checkbox"]:checked::after {
      content: "???";
      left: 5px;
      top: -1px;
      position: absolute;
    }

    button {
      width: 350px;
      height: 41px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      line-height: 22.5px;
      letter-spacing: 0px;
      /* Background */
      color: #FFFFFF;
      /* Primary */
      background: #003867;
      border: none;
    }

    button:active {
      opacity: 0.5;
    }
  }
}

@media only screen and (max-width: 770px) {

  // ipad mini 768 * 1024
  .container {
    justify-content: center;

    .login-window {
      margin-right: 0;
      margin-top: 10vw;

      img {
        position: static;
        width: 40vw;
        height: 40vw;
      }

      input {
        width: 90vw;
        height: 12vw;
        align-self: center;
        background-color: white;
        border: 1px solid rgb(187, 187, 187);
      }

      input::placeholder {
        font-size: 3.5vw;
        font-weight: 300;
      }

      button {
        width: 90vw;
      }
    }
  }
}
</style>