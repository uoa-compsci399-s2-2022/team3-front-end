<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
import CourseCard_2 from '@/components/cards/CourseCard_2.vue'
import {ref} from 'vue'
import CourseList from '@/components/cards/CourseList.vue'
const value = ref('')
const options =[
  {
    value : '1',
    label : 'Course Card'
  },
  {
    value: '2',
    label: 'Course List'
  },
]

</script>

<template>
   <div class="show-style">
     <el-select  placeholder="Select" v-model="value">
       <el-option
           v-for="item in options"
           :key="item.value"
           :label="item.label"
           :value="item.value"
      />
     </el-select>
   </div>

    <div class="course-container"  v-if="value === '1'">
<!--      {{value}}-->
      <course-card_2/>
      <course-card_2/>
      <course-card_2/>
      <course-card_2/>
      <course-card_2/>
    </div>


  <div class="course-list" v-else-if="value === '2'">
    <course-list/>

  </div>


</template>

<style lang="scss" scoped>
    .course-container {
        margin: 20px 30px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        grid-auto-rows: inherit;
        gap: 20px;
    }
    .show-style{
      padding-top: 25px;
      /* padding-right: 20px; */
      padding-left: 30px;
      padding-bottom: 10px;
    }

    .course-list{
      padding-left: 30px;
      padding-top: 15px;
    }
</style>