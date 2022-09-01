<script setup lang="ts">
console.log(document.documentElement.clientWidth)
console.log(window.innerWidth)
</script>

<template>
<router-view/>
</template>

<style lang="scss">
@import '@/styles/scrollbar.scss'; // set the scrollbar style

</style>
