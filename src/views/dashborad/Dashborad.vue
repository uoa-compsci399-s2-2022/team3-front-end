<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
</script>

<template>
    <div class="course-container">
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        
    </div>
</template>

<style lang="scss" scoped>
    .course-container {
        margin: 20px 30px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        grid-auto-rows: 200px;
        gap: 20px;
    }
</style>