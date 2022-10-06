<script setup lang="ts">
import { ref } from 'vue';
import { get } from '@/utils/request'

const name = ref<string>();
const email = ref<string>();

async function getUserProfile() {
    let user = await get(`api/currentUser`);
    name.value = user.name;
    email.value = user.email;
}

getUserProfile()
</script>

<template>
    <!-- below are presented using Mock data -->
    <div class="profile-container">
        <div class="profile-avatar">
            <img src="@/assets/avatar.svg" alt="avatar" />
        </div>

        <div class="profile-info">
            <div class="profile-info-general">
                <div>{{ name }}</div>
                <div>{{email}}</div>
            </div>

            <div class="profile-info-details">
                <h2>Infomation</h2>
                <pre>UPI:                      zwan669</pre>
                <pre>AUID:                   226537590</pre>
                <pre>Preferred Email:   zixunqwq@gamil.com</pre>
            </div>
        </div>

        <div class="profile-download">
            <p>Personal documents</p>
            <div>visa.pdf</div>
            <div>cv.pdf</div>
            <div>transcript.pdf</div>
        </div>
    </div>
    
    <el-button class="profile-update">Update profile</el-button>

    
</template>

<style scoped lang="scss">
.profile-update{
    padding: 20px 60px;
    font-size: 20px;
    width: 160px;
    margin-left: 180px;
}
.profile-container {
    margin: 40px 60px;
    display: flex;
    .profile-avatar {
        width: 80px;
        margin-right: 40px;
    }

    .profile-info {
        &-general {
            font-size: 25px;
            font-weight: 600;
            :last-child {
                font-size: 20px;
                font-weight: 500;
            }
        }

        &-details {
            margin-top: 30px;
            h2 {
                font-size: 20px;
            }

            pre {
                padding-left: 10px;
                font-size: 16px;
                color: #aaa;
            }
        }
    }

    .profile-download {
        margin-left: auto;
        align-self: flex-start;
        p {
            font-size: 20px;
            border-bottom: 1px solid rgb(233, 233, 233);
        }

        div {
            font-size: 16px;
            margin-left: 20px;
            color:rgb(160, 211, 253);
            cursor:pointer;
        }
        div:hover {
            color:rgb(109, 189, 254);
        }
    }

}
</style>