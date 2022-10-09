<script lang="ts" setup>
import {ref} from 'vue'
import {get} from "@/utils/request";
import CourseCard_2 from '@/components/cards/CourseCard_2.vue'
var value = ref('')
var reactive = ref('')
const dialogVisible = ref(false)
const tableData = ref([])
const options = ref([
])



const showCourses = (termID : String) => {

  get('/api/getCourseByTerm/' + termID).then(res => {
    tableData.value = res;
  })
}

const handleApply = () => {
  alert("Apply Successfully")
}


const callCourseCardRef = ref()
const callCourse = (courseID : String) => {
    callCourseCardRef.value.showCoursesBy_courseID(courseID)
}

const data = ref()
const tableData_course = ref([])

const test = (courseID : String, type :String) => {
  // callCourse(courseID)

  if (type === "1"){
    // data.value = courseID
    tableData_course.value = []
    get('/api/GetCourseCardMetaData/' + courseID.courseID).then(res => {
      tableData_course.value.push(res);

    })

    dialogVisible.value = true;

  }
  else if (type === "2"){
    // data.value = 'None'
    dialogVisible.value = false;
  }


}



// 导出函数， 用于父组件传参给子组件
defineExpose({
  showCourses,
})

</script>

<template>
  <div class="course-list-table" >

    <el-table :data="tableData" stripe >

      <el-table-column fixed label="Course Code" prop="courseNum" width="150px"/>
      <el-table-column fixed label="Course Name" prop="courseName" width="150px"/>
      <el-table-column  label="Available Hours" prop="totalAvailableHours" width="150px"/>
      <el-table-column  label="# of Student Need" prop="estimatedNumOfStudents" width="150px"/>
      <el-table-column  label="# of Labs/week" prop="numOfLabsPerWeek" width="150px"/>
      <el-table-column label="# of Tutorial/week" prop="numOfTutorialsPerWeek" width="150px"/>
      <el-table-column label="Deadline" prop="deadLine" width="150px"/>

      <el-table-column fixed="right" width="120px">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="test(scope.row, '1')">Detail</el-button>

        </template>
      </el-table-column>


      <el-table-column fiexd="right"  width="120px">
        <template #default="scope">
<!--          <el-button type="primary" size="mini" @click="handleApply(scope.$index, scope.row)">Apply</el-button>-->
        </template>
      </el-table-column>



    </el-table>
  </div>

  <div>
      <el-dialog v-model="dialogVisible"  width="50%"  draggable >


        <div class="course-container">
          <div v-for="item in tableData_course" >
            <div class="card-container">
              <div class="card-info"  >
                <header class="card-title">
                  {{ item.courseNum }}
                </header>
                <el-divider/>
                <div class="card-content">
                  <div class="course-semester">
                    {{ item.semester }}
                  </div>
                  <div class="task-description">
                    <p class="sub-title">Task description: </p>

                    help us!

                    <li>
                      Number of Assigments: {{ item.numOfAssignments }}
                    </li>
                    <li>
                      Number of labs: {{ item.numOfLabsPerWeek }}
                    </li>
                    <li>
                      Number of Tutorials : {{ item.numOfTutorialsPerWeek }}
                    </li>
                    <p class="sub-title">prerequisites: </p>
                    {{ item.prerequisite }}

                    <p class="sub-title">Maker's responsibility: </p>
                    {{ item.markerResponsibility }}

                    <p class="sub-title">Tutor's responsibility: </p>
                    {{ item.tutorResponsibility }}

                    <p class="sub-title">Available hours: </p>
                    {{ item.totalAvailableHours }}

                    <p class="sub-title"># students: </p>
                    We need students: {{ item.estimatedNumOfStudents }}

                    <!--              <p class="sub-title"># Tutors: </p>-->


                    <p class="sub-title">Deadline: </p>
                    {{ item.deadLine }}
                  </div>


                  <div class="course-coordinator">
                    <p style="font-size: x-large;">Course coordinator</p>
                    <ui v-for="coordinator in item.courseCoordinator">

                      <ull>Name: {{ coordinator.name }}</ull>
                      <ul>Email: <a :href="coordinator.email">{{ coordinator.email }}</a></ul>

                    </ui>

                    <!--              <li>-->
                    <!--                Name: John-->
                    <!--              </li>-->
                    <!--              <li>-->
                    <!--                Email: <a href="http://www.baidu.com">www.google.com</a>-->
                    <!--              </li>-->
                  </div>
                </div>
                <!--      <el-divider style="position: absolute; bottom: 70px"/>-->
                <div class="card-buttons">

<!--                  <el-button style="color: rgb(255 255 255);background-color: #00467f;">Apply</el-button>-->

                </div>
              </div>
            </div>
          </div>
        </div>
      <el-button @click="test('None', '2')" >Cancel</el-button>

    </el-dialog>
  </div>
</template>



<style scoped lang="scss">
  .course-list-table{
    text-align: -webkit-center;
  }

  //.course-container {
  //  margin: 20px 30px;
  //  display: grid;
  //  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  //// grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  //  grid-auto-rows: inherit;
  //  gap: 20px;
  //}
  .card-container{
    box-shadow: inset 1px 1px 0 0 hsl(0deg 0% 100%), 0 8px 31px 0 #9c989833;
  //width: 500px;
  //height: 900px;
    border-radius: 30px;
    position: relative;
  .task-description{
    padding: 20px;
  }
  .sub-title{
    font-size: 18px;
    font-weight: bold;
  }
  .card-info{
    margin: 35px;
    height: -webkit-fill-available;   /* adapted height */
  .card-title {
    font-size: 20px;
    text-align: center;
    margin-top: 30px;
    font-weight: bolder;
  }
  .course-semester{
    color: #959595;
  }
  .card-buttons{
    bottom: 30px;
    position: absolute;
    right: 40px;
  }
  }
  }
  .card-info{
    padding-top: 1px;
  }
  .course-coordinator{
    padding-bottom: 25px;
  }

</style>