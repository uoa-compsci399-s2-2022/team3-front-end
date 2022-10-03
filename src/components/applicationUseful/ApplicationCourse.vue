<template>
  <el-drawer v-model="visible.visible" :show-close="false" size="45%">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Add Prefer Course</h4>
    </template>
    <el-input
        v-model="searchCourseNum"
        size="large"
        placeholder="Please Input Course Number"
        :prefix-icon="Search"
    />
    <br/><br/>
    <el-table
        v-loading="!courseLoaded"
        :ref="courseTableRef"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
    >
      <el-table-column type="expand">
        <template #default="props">

          <div class="courseInformation-container">

            <h2 style="font-size: medium; font-weight: bold">Marker Responsibility</h2>
            <p>{{ props.row.markerResponsibility }}</p>

            <br/>

            <h2 style="font-size: medium; font-weight: bold">Tutor Responsibility</h2>
            <p>{{ props.row.tutorResponsibility }}</p>

            <br/>

            <el-descriptions :column="1" border>
              <el-descriptions-item
                  label="Estimated Number of Students"
                  label-align="center"
                  align="center"
                  label-class-name="my-label"
                  class-name="my-content"
                  width="150px"
              >{{ props.row.estimatedNumOfStudents }}
              </el-descriptions-item>
              <el-descriptions-item label="Currently Number Of Students" label-align="center" align="center">
                {{ props.row.currentlyNumOfStudents }}
              </el-descriptions-item>
              <el-descriptions-item label="Number of Assignments" label-align="center" align="center">
                {{ props.row.numOfAssignments }}
              </el-descriptions-item>
              <el-descriptions-item label="Number of Labs per Week" label-align="center" align="center">
                {{ props.row.numOfLabsPerWeek }}
              </el-descriptions-item>
              <el-descriptions-item label="Number of Tutorials per Week" label-align="center" align="center">
                {{ props.row.numOfTutorialsPerWeek }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-table-column>

      <el-table-column property="courseNum" label="Course Num" width="110"/>
      <el-table-column property="courseName" label="Course Name"/>
    </el-table>

    <el-row style="margin-top: 30px" justify="center">
      <el-popover
          :visible="noCourseSelected"
          placement="bottom"
          title="Tips"
          :width="200"
          content="You must choose a course"
      >
        <template #reference>
          <el-button @click="sendCourse">Confirm</el-button>
        </template>
      </el-popover>
    </el-row>

  </el-drawer>

</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import {ElButton, ElDrawer, ElMessage, ElTable} from 'element-plus'
import {get, post} from "@/utils/request";
import {useRouter, useRoute} from 'vue-router';
import {Search} from '@element-plus/icons-vue'
import dayjs from "dayjs";

const router = useRouter()
const route = useRoute()

type Props = {
  visible: object
  termID: number
}
const props = defineProps<Props>()
const courseLoaded = ref(false);
const searchCourseNum = ref("");
const courseTableRef = ref<InstanceType<typeof ElTable>>()
const tableData: courseList[] = reactive([] as courseList[])
const currentRow = ref()
const emit = defineEmits(['added_course'])
const noCourseSelected = ref(false)
const sendCourse = () => {
  if (currentRow.value) {
    emit('added_course', currentRow.value)
  } else {
    noCourseSelected.value = true
    setTimeout(() => {
      noCourseSelected.value = false
    }, 1000)
  }

}

interface courseList {
  [key: string]: any;
  courseID: number;
  courseNum: string;
  courseName: string;
  estimatedNumOfStudents: number;
  currentlyNumOfStudents: number;
  numOfAssignments: number;
  numOfLabsPerWeek: number;
  numOfTutorialsPerWeek: number;
  tutorResponsibility: string;
  markerResponsibility: string;

}




const handleCurrentChange = (val: courseList | undefined) => {
  currentRow.value = val
}


get('api/getCourseByTerm/' + props.termID).then((res) => {
  res.forEach((item: any) => {
    tableData.push({
      courseID: item.courseID,
      courseNum: item.courseNum,
      courseName: item.courseName,
      estimatedNumOfStudents: item.estimatedNumOfStudents,
      currentlyNumOfStudents: item.currentlyNumOfStudents,
      numOfAssignments: item.numOfAssignments,
      numOfLabsPerWeek: item.numOfLabsPerWeek,
      numOfTutorialsPerWeek: item.numOfTutorialsPerWeek,
      tutorResponsibility: item.tutorResponsibility,
      markerResponsibility: item.markerResponsibility,
    })
  })
  courseLoaded.value = true;
})


</script>

<style scoped>
.courseInformation-container {
  margin-left: 15px;
  margin-right: 15px;
}

</style>