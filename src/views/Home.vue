<script setup lang="ts">
import { get } from '@/utils/request';
get('api/currentUser').then(res => {
    console.log(res);
})
</script>
<template>
    qwq

    <router-view />
</template>