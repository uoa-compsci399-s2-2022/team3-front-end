<script setup lang="ts">
import { get } from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref<string>();
const email = ref<string>();

const logout = () => {

    ElMessageBox.confirm(
        'Are you sure you want to logout?',
        'Confirm',
        {
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(() => {
            get('/api/logout').then(() => {
                ElMessage({
                    type: 'success',
                    message: 'Logout success',
                })
                router.push('/login');
            }).catch(() => {
                ElMessage({
                    type: 'error',
                    message: 'Please Check your internect connection.',
                })
            })

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Canceled',
            })
        })
}

async function getUserProfile() {
    let user = await get(`api/currentUser`);
    name.value = user.name;
    email.value = user.email;
    
}

getUserProfile()



</script>

<template>
    <section>
        <div class="title">
            {{$route.meta.title}}
        </div>

        <div class="info-card">
            <!-- mock data -->
            <div class="info-card-avatar">
                <el-dropdown :hide-on-click="false">
                    <img src="@/assets/avatar.svg" alt="">
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="$router.push('/profile')">Profile</el-dropdown-item>
                            <el-dropdown-item divided @click="logout">logout</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>
            <div class="info-card-general">
                <div>{{name}}</div>
                <div>{{email}}</div>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
section {
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
    margin-right: 30px;
    padding: 0px 10px 10px 10px;
    border-bottom: 1px solid rgb(210, 210, 210);

    .title {
        font-size: $fs-title;
        color: $uoa-dark;
        font-weight: bold;
    }

    .info-card {
        margin-left: auto;

        display: flex;

        &-avatar {
            margin-right: 20px;

            img {
                border-radius: 100px;
                border: 1px solid rgb(210, 210, 210);
                width: 45px;
                height: 45px;
            }

            width: 45px;
            height: 45px;
        }

        &-general {}
    }
}
</style>