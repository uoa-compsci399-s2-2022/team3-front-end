<script setup lang="ts">
import { get } from '@/utils/request';
import Sidebar from '@/components/Sidebar.vue';
get('api/currentUser').then(res => {
    console.log(res);
}).catch((err) => {
    console.log(err)
})
</script>
<template>
    <div class="container">
        <Sidebar />
        Home

        <router-view />
    </div>
</template>

<style lang="scss">
    .container {
        display: flex;
        position:relative;
        align-items: flex-start;  
    }


</style>