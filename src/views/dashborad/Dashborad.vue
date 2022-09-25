<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
import CourseCard_2 from '@/components/cards/CourseCard_2.vue'
</script>

<template>
    <div class="course-container">

        <course-card_2/>
      <course-card_2/>
      <course-card_2/>
      <course-card_2/>
      <course-card_2/>

        
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