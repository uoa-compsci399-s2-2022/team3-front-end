<script setup lang="ts">
import CourseCard_form from '@/components/cards/CourseCard_Form.vue'
import {get} from "@/utils/request";


</script>

<template>
<CourseCard_form/>
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