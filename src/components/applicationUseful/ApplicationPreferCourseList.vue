<template>
  <h3>Prefer Courses List</h3>
  <SlickList axis="y" v-model:list="value" class="list-container" @update:list="changePreference" distance="10">
    <SlickItem v-for="(c, i) in value" :key="c.courseID" :index="i" class="list-item">
      <el-icon><DCaret /></el-icon>
      {{ c.courseNum }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Preference: {{ c.preference}}
        <el-button @click="deleteCourse" class="delete-button" type="danger">
          Delete
        </el-button>
    </SlickItem>
  </SlickList>
</template>

<script setup lang="ts">
import { SlickList, SlickItem } from 'vue-slicksort';
import {computed, ref, toRef, watch} from "vue";
import {DCaret, Delete} from "@element-plus/icons-vue";

type preferCourse = {
  courseID: number;
  courseNum: string;
  courseName: string;
  hasLearned: boolean;
  grade: string;
  preExperience: string;
  preference: number;
}


const props = defineProps(['preferCourseList'])
const emit = defineEmits(['update:preferCourseList'])


const value = computed({
  get() {
    return props.preferCourseList as preferCourse[]
  },
  set(value) {
    emit('update:preferCourseList', value)
  }
})


const changePreference = (array: preferCourse[]) => {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i].preference)
    array[i].preference = i + 1;
  }
}

const deleteCourse = (index: number) => {
  value.value.splice(index, 1);
  for (let i = 0; i < value.value.length; i++) {
    value.value[i].preference = i + 1;
  }
}

</script>

<style scoped>

h3{
  margin: 0;
  padding: 0;
  font-size: large;
  font-weight: bold;
}

.list-container{
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

}
.list-item{
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: 4px;
  background-color: rgba(176, 201, 227, 0.22);
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
}

.delete-button{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}


</style>