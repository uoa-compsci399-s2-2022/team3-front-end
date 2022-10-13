<script setup lang="ts">
import CourseList from '@/components/CourseList.vue'
import {onBeforeMount, ref, watch} from 'vue'
import {get} from "@/utils/request";
import {useAsyncState} from "@vueuse/core";
import {usePermissionStore} from "@/store";
import {Search} from "@element-plus/icons-vue";

const currentTerm = ref()
const currentPosition = ref('All')
const searchCourse = ref('')
const position = ref(['All', 'Tutor', 'Marker'])
const {isLoading: isLoadingTerm, state: stateTerm, isReady: isReadyTerm, execute: executeTerm} = useAsyncState(
    (args) => {
      return get('api/availableTerm')
    },
    {},
    {
      resetOnExecute: false,
      immediate: false,
    },
)

onBeforeMount(() => {
  executeTerm().then(
      () => {
        stateTerm.value.sort((a: Term, b: Term) => {
          return b.termID! - a.termID!
        })
        const localTerm = localStorage.getItem('selectedTerm')
        if (localTerm && stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localTerm!)).length > 0) {
          currentTerm.value = stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localTerm!))[0].termID
        } else {
          currentTerm.value = stateTerm.value[0].termID
        }
      }
  )
})

const courseList = ref()

</script>

<template>
  <div class="page-container">
    <el-row  class="header-container">
      <el-select v-model="currentTerm" placeholder="Select Term" size="large"
                 v-loading="isLoadingTerm" style="margin-right: 15px;" >
        <el-option v-for="item in stateTerm" :key="item.termName" :label="item.termName" :value="item.termID" />
      </el-select>
      <el-select v-model="currentPosition" placeholder="Available Position" size="large" style="margin-right: 30px;"
                 v-loading="isLoadingTerm">
        <el-option v-for="p in position" :key="p" :label="p" :value="p" />
      </el-select>
      <el-input
          v-model="searchCourse"
          placeholder="Search Courses by Course Num"
          :prefix-icon="Search"
          class="input"
          maxlength="20"
      />
    </el-row>

    <CourseList ref="courseList" v-model:termID="currentTerm" v-model:position="currentPosition" v-model:searchCourse="searchCourse"/>


<!--    <div class="course-container" v-if="value === '1'">-->
<!--      <course-card_2 ref="callCourseCardRef"/>-->
<!--    </div>-->


<!--    <div class="course-list" v-else-if="value === '2'">-->
<!--      <course-list ref="callCourseListRef"/>-->
<!--    </div>-->

  </div>
</template>

<style lang="scss" scoped>
.show-style {
  padding-top: 25px;
  /* padding-right: 20px; */
  padding-left: 30px;
  padding-bottom: 10px;
}

.course-list {
  padding-left: 30px;
  padding-top: 15px;
}

.course-list-semester {
  text-align: center;
  padding: 10px;
}

.page-container {
  margin: 30px 30px 0;
}

.header-container{
  display: flex;
  align-items: center;
  row-gap: 10px;
}
.input{
  max-width: 400px;
}
</style>