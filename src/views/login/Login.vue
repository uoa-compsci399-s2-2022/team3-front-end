<script setup lang="ts">
import LoginBackground from '@/components/backgrounds/LoginBackground.vue'
</script>

<template>
    <LoginBackground />
    <div class="container">
        <div class="login-window">
            <img src="@/assets/logo/logo.svg" alt="" class="logo">

            <div class="title">Login</div>
            <form>
                <input type="text" placeholder="Username">
                <input type="password" placeholder="Password">
                <div class="keep-login"><input type="checkbox" class="login-options"><span>Keep me logged in</span>
                </div>
                <button type="submit" @click.prevent="">Login</button>
                <div class="login-with"></div>
            </form>

        </div>
    </div>
</template>

<style scoped lang="scss">
@media only screen and (max-width: 600px) {
    .container {
        min-height: 900px;

        .login-window {
            margin-left: 0;
            margin-top: 0;

            img {
                width: 300px;
                height: 300px;
            }

            .title {
                font-size: 128.83px;
                font-weight: 600;
                margin: 30px 0;
                /* Primary */
                color: #003867;
            }

            form {
                row-gap: 50px;

                input {
                    padding-left: 40px;
                    font-size: 44px;
                    width: 850px;
                    height: 105px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid #003867;
                    
                }

                input::placeholder {
                    color: inherit;
                }

                input:focus {
                    outline: none;
                    border: none;
                    background: rgba(0, 128, 167, 0.2);
                }

                .keep-login {
                    display: flex;
                    align-items: center;
                    span {
                        display: block;
                        font-size: 40px;
                        margin-left: 40px;
                    }
                }

                input[type="checkbox"] {
                    -webkit-appearance: none;
                    border: 1px solid #003867;
                    background-color: transparent;
                    width: 50px;
                    height: 50px;
                    border-radius: 16px;
                    box-sizing: border-box;
                    position: relative;
                }


                input[type="checkbox"]:checked::after {
                    top:-10px;
                    position: absolute;
                }

                button {
                    width: 850px;
                    height: 100px;
                    border-radius: 16px;
                    font-family: Poppins-SemiBold;
                    font-size: 56px;
                    font-weight: 600;
                }

                
            }
        }
    }
}

.container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.login-window {
    margin-left: 400px;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-items: center;

    img {
        width: 71px;
        height: 82px;
    }

    .title {
        font-family: Poppins-SemiBold;
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
            top:-1px;
            position: absolute;
        }

        button {
            width: 350px;
            height: 41px;
            border-radius: 8px;
            font-family: Poppins-SemiBold;
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
</style>