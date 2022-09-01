<script setup lang="ts">
import { get } from '@/utils/request'
const logout = () => {
    get('/api/logout').then(res => {
        console.log(res);
    })
}
</script>

<template>
    <div class="qwq">
        <el-button @click="logout">Logout</el-button>
    </div>

</template>

<style scoped lang="scss">
.el-button {
    font-size: 16px !important;
}
</style>

<style>
.el-button {
    font-size: 16px;
}
</style>