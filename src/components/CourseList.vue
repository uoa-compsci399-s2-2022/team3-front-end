<template>
  <div class="course-list-container">
    <div v-for="course in courseData" @click="openCourse(course)">
      <el-card class="box-card">
        <p class="title">{{ course.courseNum }}</p>
        <p class="sub-title">{{ course.courseName }}</p>
        <el-tag effect="dark" class="tag" v-show="course.needMarkers">
          Marker
        </el-tag>
        <el-tag effect="dark" type="success" class="tag" v-show="course.needTutors">
          Tutor
        </el-tag>
        <el-tag effect="dark" type="warning" class="tag" v-show="!course.needTutors && !course.needMarkers">
          No position
        </el-tag>
        <div class="hint-icon">
          <el-icon>
            <ArrowRightBold/>
          </el-icon>
        </div>
      </el-card>
    </div>
  </div>

  <el-drawer
      v-if="currentCourse"
      v-loading="drawerLoading"
      v-model="drawer"
      :title="currentCourse.courseNum"
      :size="drawerWidth"
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="Available Position" label-align="center" align="center">
        <el-tag class="tag" v-show="currentCourse.needMarkers">
          Marker
        </el-tag>
        <el-tag type="success" class="tag" v-show="currentCourse.needTutors">
          Tutor
        </el-tag>
        <el-tag type="warning" class="tag" v-show="!currentCourse.needTutors && !currentCourse.needMarkers">
          No position
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item
          label="Estimated Number of Students"
          label-align="center"
          align="center"
      >{{ currentCourse.estimatedNumOfStudents }}
      </el-descriptions-item>
      <el-descriptions-item label="Currently Number Of Students" label-align="center" align="center">
        {{ currentCourse.currentlyNumOfStudents }}
      </el-descriptions-item>
      <el-descriptions-item label="Number of Assignments" label-align="center" align="center">
        {{ currentCourse.numOfAssignments }}
      </el-descriptions-item>
      <el-descriptions-item label="Number of Labs per Week" label-align="center" align="center">
        {{ currentCourse.numOfLabsPerWeek }}
      </el-descriptions-item>
      <el-descriptions-item label="Number of Tutorials per Week" label-align="center" align="center">
        {{ currentCourse.numOfTutorialsPerWeek }}
      </el-descriptions-item>
      <el-descriptions-item label="Marker Deadline" label-align="center" align="center">
        {{ datetimeFormat(currentCourse.markerDeadLine) }}
      </el-descriptions-item>
      <el-descriptions-item label="Tutor Deadline" label-align="center" align="center">
        {{ datetimeFormat(currentCourse.tutorDeadLine) }}
      </el-descriptions-item>
      <el-descriptions-item label="Prerequisite" label-align="center" align="center" :span="2">
        {{ currentCourse.prerequisite }}
      </el-descriptions-item>
    </el-descriptions>
    <h2 class="course-drawer-title">Tutor Responsibility</h2>
    <p class="text">{{ currentCourse.tutorResponsibility ? currentCourse.tutorResponsibility : "No data" }}</p>
    <h2 class="course-drawer-title">Marker Responsibility</h2>
    <p class="text">{{ currentCourse.markerResponsibility ? currentCourse.markerResponsibility : "No data" }}</p>
    <h2 class="course-drawer-title">Tutor Responsibility</h2>
    <p class="text"> {{ currentCourse.tutorResponsibility ? currentCourse.tutorResponsibility : "No data" }}</p>
    <p class="course-drawer-title">Course Coordinator</p>
    <el-table :data="currentCourse.courseCoordinators" style="width: 100%" :show-header="false">
      <el-table-column prop="name" label="Name"/>
      <el-table-column prop="email" label="Email"/>
    </el-table>
    <div class="apply-button-wrapper">
      <router-link :to="{path:'/applicationlist'}">
        <el-button type="primary" class="apply-button" plain>Apply Now</el-button>
      </router-link>
    </div>
  </el-drawer>

</template>

<script setup lang="ts">
import {get} from "@/utils/request.js";
import {computed, defineProps, onBeforeMount, ref, watch} from "vue";
import {ArrowRightBold} from "@element-plus/icons-vue";
import {isMobile, isMobile768} from "@/utils/isMoblie";
import {datetimeFormat} from "@/utils/datetimeFormat";

const currentCourse = ref<Course>();
const drawer = ref(false);
const drawerWidth = ref('40%');
const drawerLoading = ref(false);
const openCourse = (course: Course) => {
  drawerLoading.value = true;
  get(`/api/getCourse/${course.courseID}`).then((res) => {
    currentCourse.value = res;
    drawerLoading.value = false;
  });
  drawer.value = true;
}

type Props = {
  termID: string
  position: string
  searchCourse: string
}

const termIDRef = computed(() => {
  return props.termID
})

const positionRef = computed(() => {
  return props.position
})

const searchCourse = computed(() => {
  return props.searchCourse
})

const props = defineProps<Props>()
const courseData = ref([] as Course[])
const showCoursesList = () => {
  get('/api/getSimpleCourseByTerm/' + termIDRef.value).then(res => {
    courseData.value = res;
  })
}
const showCoursesListByPosition = () => {
  get(`/api/getSimpleCourseByTermAndPosition/${termIDRef.value}/${positionRef.value}`).then(res => {
    courseData.value = res;
  })
}
const showCoursesListByCourseNum = () => {
  get(`/api/getSimpleCourseByNum/${termIDRef.value}/${searchCourse.value}/${positionRef.value}`).then(res => {
    courseData.value = res;
  })
}

watch(termIDRef, () => {
  if (termIDRef.value) {
    if (positionRef.value === 'All') {
      showCoursesList()
    } else {
      showCoursesListByPosition()
    }
  }
})

watch(positionRef, () => {
  if (positionRef.value === 'All') {
    showCoursesList()
  } else {
    showCoursesListByPosition()
  }
})

watch(searchCourse, () => {
  if (searchCourse.value) {
    showCoursesListByCourseNum()
  } else {
    if (positionRef.value === 'All') {
      showCoursesList()
    } else {
      showCoursesListByPosition()
    }
  }
})


const responsiveLayout = () => {
  if (isMobile768()) {
    drawerWidth.value = '100%';
  } else {
    drawerWidth.value = '40%';
  }
}

setInterval(responsiveLayout, 3000)

onBeforeMount(() => {
  responsiveLayout()
})

</script>

<style scoped lang="scss">

.course-list-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  margin-bottom: 20px;
}

@media screen and (max-width: 768px) {
  .course-list-container {
    grid-template-columns: 1fr;
  }
}


.box-card {
  border-radius: 15px;
  position: relative;
}

.box-card:hover {
  background-color: #0b416d;
  cursor: pointer;
  border: #0b416d;
  -moz-box-shadow: #0b416d 0 0 6px;
  -webkit-box-shadow: #0b416d 0 0 6px;
  box-shadow: #0b416d 0 0 6px;

  .title {
    color: #ffffff;
  }

  .sub-title {
    color: #ffffff;
  }

  .hint-icon {
    color: #ffffff;
  }
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #0b416d;
}

.sub-title {
  font-size: 15px;
  margin-bottom: 10px;
  font-weight: 20;
  color: rgb(106, 107, 108);
}

.tag {
  margin-right: 8px;
  margin-bottom: 3px;
  width: 80px;
  border-radius: 20px;
}

.hint-icon {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-30%);
  font-size: 30px;
  color: #0b416d;
}

.course-drawer-title {
  margin-top: 10px;
  font-weight: bold;
  font-size: 15px;
  color: rgb(106, 107, 108);
}

.text {
  font-size: 10px;
}

.apply-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}


</style>