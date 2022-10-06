<script setup lang="ts">
  import Test from '@/components/cards/Test.vue'
  import {ref} from 'vue'
  import {get, post} from '@/utils/request'

  const tableData = ref([])
  const semester = ref('')

  const showCourses = (termID : String) => {
    get('/api/getCourseByTerm/' + termID).then(async res => {
      tableData.value = []   // clear the table
      for (let i = 0; i < res.length; i++) {
        let courseID = res[i].courseID;
        await get('/api/GetCourseCardMetaData/' + courseID).then(res1 => {
          tableData.value.push(res1)
          // alert(res1.courseCoordinator)
        })
      }

    })

  }

  const showCoursesBy_courseID = (courseID : String) => {
    get('/api/GetCourseCardMetaData/' + courseID).then(res => {
      tableData.value = []   // clear the table
      tableData.value.push(res)
    })
  }

  defineExpose({
    showCourses,
    showCoursesBy_courseID
  })

</script>


<template>

  <div class="course-container">
    <div v-for="item in tableData" >
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


<!--                <el-button style="color: rgb(255 255 255);background-color: #00467f;">Apply</el-button>-->


<!--              <li>-->
<!--                Name: John-->
<!--              </li>-->
<!--              <li>-->
<!--                Email: <a href="http://www.baidu.com">www.google.com</a>-->
<!--              </li>-->
            </div>
          </div>
          <!--      <el-divider style="position: absolute; bottom: 70px"/>-->

        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.course-container {
  margin: 20px 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: inherit;
  gap: 20px;
}
.card-container{
  box-shadow: inset 1px 1px 0 0 hsl(0deg 0% 100%), 0 8px 31px 0 #9c989833;
  //width: 500px;
  //height: 900px;
  height: auto;
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
    height: auto;   /* adapted height */
    .card-title {
      font-size: 20px;
      text-align: center;
      margin-top: 30px;
      font-weight: bolder;
    }
    .course-semester{
      color: #959595;
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