<script setup lang="ts">
import LoginBackground from '@/components/backgrounds/LoginBackground.vue'
import { reactive, ref } from 'vue';
import { get, post } from '@/utils/request'
import { useUserStore, usePermissionStore } from '@/store/index'
import { useRouter } from 'vue-router';


const data = reactive({
    userID: "admin",
    password: "admin"
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
                }
            )
            
        }
    ).then( () => {
        router.push('/dashboard')
    })
    .catch(
        err => console.error(err)
    )
}
</script>

<template>
    <LoginBackground />
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
            </form>
            <div class="register-prompt">
                <span>Don't have an account? Click </span><router-link to="/register">here</router-link><span> to create one</span>
            </div>
            
        </div>
    </div>
</template>

<style scoped lang="scss">
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
            caret-color: transparent;
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
            content: "✓";
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

    .register-prompt {
        align-self: flex-start;
        span {
            font-size: 12px;
        }

        a {
            text-decoration: none;
            color:#003867;
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