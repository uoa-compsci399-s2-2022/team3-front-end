<script setup lang="ts">
import CourseCard_detail from '@/components/cards/CourseCard_detail_version.vue'
import CourseCard_sample from '@/components/cards/CourseCard_sample_version.vue'
</script>

<template>
    <div class="course-container">

      <course-card_sample/>
      <course-card_detail/>



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