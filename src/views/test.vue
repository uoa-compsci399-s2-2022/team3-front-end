<script setup lang="ts">

import CourseCard_lecturer from '@/components/cards/CourseCard_lecturer.vue'
</script>

<template>
    <div class="course-container">

      <courseCard_lecturer/>



    </div>
</template>

<style lang="scss" scoped>
    .course-container {
      margin: 20px 30px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
      grid-auto-rows: inherit;
      gap: 20px;
    }
</style>