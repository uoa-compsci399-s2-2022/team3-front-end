<script setup lang="ts">
import { get } from '@/utils/request';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/header/Header.vue';
get('api/currentUser').then(res => {
    console.log(res);
}).catch((err) => {
    console.log(err)
})
</script>
<template>
    <div class="container">
        <Sidebar />
        <div class="container-main">
            <Header />
            <router-view />
        </div>

    </div>
</template>

<style lang="scss">
@media (max-width: 730px) {
    .container-main {
        margin-left: 50px;
    }
}
@media (max-width: 540px) {
    .container-main {
        margin-left: 0;
    }
}
.container {
    display: flex;
    position: relative;
    align-items: flex-start;

    &-main {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
}
</style>