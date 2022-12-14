<template>
  <el-drawer v-model="visible.visible" title="Add Prefer Course" :size="drawerSize"
             :direction="drawerDirection">
    <el-input
        v-model="searchCourseNum"
        size="large"
        placeholder="Please Input Course Number"
        :prefix-icon="Search"
    />
    <br/><br/>
    <el-table
        v-loading="!courseLoaded"
        ref="courseTableRef"
        :data="filterTableData"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
    >
      <el-table-column type="expand">
        <template #default="props">

          <div class="courseInformation-container">

            <h2 style="font-size: medium; font-weight: bold">Prerequisite</h2>
            <p>{{ props.row.prerequisite }}</p>

            <br/>

            <h2 style="font-size: medium; font-weight: bold">Tutor Responsibility</h2>
            <p>{{ props.row.tutorResponsibility }}</p>

            <br/>

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

      <el-table-column property="courseNum" label="Course Num" width="140"/>
      <el-table-column property="courseName" label="Course Name"/>
    </el-table>

    <el-row style="margin-top: 30px" justify="center">
      <el-button @click="sendCourse" class="hidden-sm-and-down botton-fix-button" type="primary" size="large">Confirm
      </el-button>
      <el-button @click="confirmEvent" class="hidden-md-and-up botton-fix-button"
                 type="primary"
                 size="large">Confirm
      </el-button>
    </el-row>

  </el-drawer>

</template>

<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref, watch} from 'vue'
import {ElButton, ElDrawer, ElMessage, ElTable} from 'element-plus'
import {get, post} from "@/utils/request";
import {useRouter, useRoute} from 'vue-router';
import {Search} from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css';
import dayjs from "dayjs";

const router = useRouter()
const route = useRoute()

type Props = {
  visible: any
  termID: number
  role: string
}
const props = defineProps<Props>()
const courseLoaded = ref(false);
const searchCourseNum = ref("");
const courseTableRef = ref<InstanceType<typeof ElTable>>()
const tableData: courseList[] = reactive([] as courseList[])
const currentRow = ref()
const emit = defineEmits(['added_course', 'update:role'])


const roleSync = computed({
  get() {
    return props.role as String
  },
  set(value) {
    emit('update:role', value)
  }
})



const filterTableData = computed(() => {
  if (tableData.length === 0) {
    return []
  }
  return tableData.filter((item) => item.courseNum.toLowerCase().includes(searchCourseNum.value.toLowerCase()))
})

const sendCourse = () => {
  if (currentRow.value) {
    emit('added_course', currentRow.value)
    return true
  } else {
    ElMessage({
      message: 'Please select a course',
      type: 'warning',
      grouping: true
    })
    return false
  }
}


const confirmEvent = () =>{
  let result = sendCourse();
  if (result) props.visible.visible = false
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
  prerequisite: string;
}


const handleCurrentChange = (val: courseList | undefined) => {
  currentRow.value = val
}


watch(roleSync, (val) => {
    getCourseList()
})

const getCourseList = () => {
  courseLoaded.value = false
  tableData.splice(0, tableData.length)
  get(`api/getAvailableCourseByTerm/${props.termID}/${roleSync.value}`).then((res) => {
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
        prerequisite: item.prerequisite,
      })
    })
    courseLoaded.value = true;
  })
}


const drawerSize = ref()
const drawerDirection = ref()

setInterval(() => {
  responsiveLayout()
}, 2000)


const getWidth = () => {
  return window.innerWidth
}

const responsiveLayout = () => {
  drawerSize.value = getWidth() > 768 ? '45%' : '100%'
  drawerDirection.value = getWidth() > 768 ? 'rtl' : 'btt'
}

onBeforeMount(() => {
  responsiveLayout()
  getCourseList()
})


</script>

<style scoped>
.courseInformation-container {
  margin-left: 15px;
  margin-right: 15px;
}

.botton-fix-button {
  position: fixed;
  bottom: 20px;
  z-index: 999999;
}

</style>