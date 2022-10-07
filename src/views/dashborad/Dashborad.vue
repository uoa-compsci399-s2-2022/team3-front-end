<script setup lang="ts">

import CourseCard from '@/components/cards/CourseCard.vue'


const value = ref('1')
const value_semester = ref('')

import {onBeforeMount, ref} from "vue";
import {get} from "@/utils/request";
import {useAsyncState} from "@vueuse/core";


const {isLoading: isLoadingTerm, state: stateTerm, isReady: isReadyTerm, execute: executeTerm} = useAsyncState(
    (args) => {
      return get('api/getCurrentUserTerm')
    },
    {},
    {
      resetOnExecute: false,
    },
)


const {
  isLoading: isLoadingCurrentTerm,
  state: stateCurrentTerm,
  isReady: isReadyCurrentTerm,
  execute: executeCurrentTerm
} = useAsyncState(
    (args) => {
      return get('api/getTermNow')
    },
    {},
    {
      resetOnExecute: false,
    },
)


const courseList = ref([] as Object[])

async function GetCourse(termID: String) {
  get('/api/getCurrentUserEnrollByTerm/' + termID).then(res => {
    courseList.value = []
    res.forEach((item: any) => {
      if (item.roleName === 'courseCoordinator') {
        item.path = `course-coordinator/${item.courseID}`
        courseList.value.push(item)
      }else{
        item.path = `/`
        courseList.value.push(item)
      }

    })
  })
}

onBeforeMount(() => {
  executeCurrentTerm().then(() => {
    value_semester.value = stateCurrentTerm.value[0].termID
    GetCourse(value_semester.value)
  })
  executeTerm()
})


</script>
<template>

  <div class="page-container">
    <div>
      <el-select placeholder="Select Term" v-model="value_semester" v-loading="isLoadingTerm">
        <el-option-group label="Current Terms">
          <el-option
              v-for="item in stateCurrentTerm"
              :key="item.termID"
              :label="item.termName"
              :value="item.termID"
              @click="GetCourse(value_semester)"
          />
        </el-option-group>
        <el-option-group label="Your Terms">
          <el-option
              v-for="item in stateTerm"
              :key="item.termID"
              :label="item.termName"
              :value="item.termID"
              @click="GetCourse(value_semester)"/>
        </el-option-group>

      </el-select>
    </div>

    <div class="course-container">
      <div v-for="item in courseList">
        <router-link :to="item.path">
          <CourseCard :course="item"/>
        </router-link>

      </div>
    </div>

  </div>


</template>

<style scoped lang="scss">

.page-container {
  margin: 30px 30px 30px 30px;
}


.course-container {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 210px;
  gap: 10px;

}

a{
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

</style>
