<template>
  <el-drawer v-model="visible.visible" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Add Prefer Course</h4>
    </template>


    <el-input
        v-model="searchCourseNum"
        size="large"
        placeholder="Please Input Course Number"
        :prefix-icon="Search"
    />
    <br /><br />
    <el-table
        ref="courseTableRef"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
    >
      <el-table-column type="index"/>
      <el-table-column property="courseNum" label="Course Num"/>
      <el-table-column property="courseName" label="Course Name"/>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent(tableData[1])">Select second row</el-button>
      <el-button @click="setCurrent()">Clear selection</el-button>
    </div>


  </el-drawer>

</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import {ElButton, ElDrawer, ElMessage, ElTable} from 'element-plus'
import {get} from "@/utils/request";
import {useRouter, useRoute} from 'vue-router';
import {Search} from '@element-plus/icons-vue'
import dayjs from "dayjs";

const router = useRouter()
const route = useRoute()

const searchCourseNum = ref("");

const courseTableRef = ref<InstanceType<typeof ElTable>>()

const tableData: courseList[] = reactive([] as courseList[])
interface courseList {
  [key: string]: any;
  courseNum: string;
  courseName: string;
}



type Props = {
  visible: object
  termID: number
}
const props = defineProps<Props>()

const value = ref()
onBeforeMount(() => {



})

const addCourse = () => {

}



get('api/getCourseByTerm/' + props.termID).then((res) => {
  console.log(res)
  res.forEach((item: any) => {
    tableData.push({
      courseNum: item.courseNum,
      courseName: item.courseName,
    })
  })
})





</script>

<style scoped>


</style>