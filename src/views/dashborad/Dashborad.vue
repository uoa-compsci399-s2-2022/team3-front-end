<script setup lang="ts">
import CourseCard_2 from '@/components/cards/CourseCard_2.vue'
import {ref} from 'vue'
import {get} from "@/utils/request";
const value_semester = ref('')
const options_semester = ref([
])
get('/api/availableTerm').then(res => {
  // var data = new Array()
  for (let i = 0; i < res.length; i++) {
    let termName = res[i].termName.toString();
    let termID = res[i].termID;
    let startDate = res[i].startDate;
    let endDate = res[i].endDate;
    let Date = startDate + " to " + endDate;

    options_semester.value.push({
      value_semester : termID.toString(),
      label_semester: termName.toString(),
    })
  }
})



const callCourseCardRef = ref()
const callCourse = (termID : String) => {
  callCourseCardRef.value.showCoursesBy_courseID(termID)
}
</script>

<template>
  <div class="course-semester">
    <el-divider content-position="center">Select a semester</el-divider>
    <div class="course-list-semester">
      <el-select  placeholder="Select a semester" v-model="value_semester" >
        <el-option
            v-for="item in options_semester"
            :key="item.value_semester"
            :label="item.label_semester"
            :value="item.value_semester"
            @click="callCourse(value_semester)"/>
      </el-select>
    </div>
  </div>
  <div class="course-container" >
    <course-card_2 ref="callCourseCardRef"/>
  </div>




</template>
<style lang="scss" scoped>
//.course-container {
//    margin: 20px 30px;
//    display: grid;
//    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
//    // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//    grid-auto-rows: inherit;
//    gap: 20px;
//}
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
.course-list-semester{
  text-align: center;
  padding: 10px;
}
</style>



<!--<script setup lang="ts">-->

<!--// import CourseCard from '@/components/cards/CourseCard.vue'-->
<!--// import CourseCard_2 from '@/components/cards/CourseCard_2.vue'-->
<!--// import {ref} from 'vue'-->
<!--// import CourseList from '@/components/cards/CourseList.vue'-->
<!--// import {get} from "@/utils/request";-->
<!--const value = ref('1')-->
<!--const value_semester = ref('')-->



<!--import CourseCard_2 from '@/components/cards/CourseCard_2.vue'-->
<!--import {ref} from "vue";-->
<!--import {get} from "@/utils/request";-->
<!--// const value_semester = ref('')-->
<!--const options_semester = ref([-->
<!--])-->



<!--get('/api/availableTerm').then(res => {-->
<!--  // var data = new Array()-->
<!--  for (let i = 0; i < res.length; i++) {-->

<!--    let termName = res[i].termName.toString();-->
<!--    let termID = res[i].termID;-->
<!--    let startDate = res[i].startDate;-->
<!--    let endDate = res[i].endDate;-->
<!--    let Date = startDate + " to " + endDate;-->



<!--    options_semester.value.push({-->
<!--      value_semester : termID.toString(),-->
<!--      label_semester: termName.toString(),-->

<!--    })-->
<!--  }-->

<!--})-->




<!--const callCourseCardRef1 = ref()-->

<!--// const tableData = ref([])-->
<!--let term_ID = ref('')-->

<!--const GetCourse = (termID : string) => {-->
<!--  term_ID.value = termID-->
<!--  console.log(term_ID.value)-->
<!--  callCourseCardRef1.value.showCoursesBy_courseID(term_ID)-->
<!--  // let name_id = ref('')-->
<!--  // let user = await get('api/currentUserProfile')-->
<!--  // name_id.value = user.id-->
<!--  // // console.log(adv)-->
<!--  // let course = await  get('/api/GetCourseByUserIDTermID/' + name_id.value + '/' + termID).then(res => {-->
<!--  //   tableData.value = []   // clear the table-->
<!--  //   for (let i = 0; i < res.length; i++) {-->
<!--  //     let courseID = res[i].courseID;-->
<!--  //     get('/api/GetCourseCardMetaData/' + courseID).then(res1 => {-->
<!--  //       tableData.value.push(res1)-->
<!--  //     })-->
<!--  //   }-->
<!--  // })-->
<!--}-->




<!--</script>-->
<!--<template>-->
<!--  <div class="course-list-semester">-->
<!--    <el-divider content-position="center">Currently Enrolment. Select a semester</el-divider>-->


<!--  <el-select  placeholder="Select a semester" v-model="value_semester" >-->

<!--    <el-option-->
<!--        v-for="item in options_semester"-->
<!--        :key="item.value_semester"-->
<!--        :label="item.label_semester"-->
<!--        :value="item.value_semester"-->
<!--        @click="GetCourse(value_semester)"/>-->

<!--  </el-select>-->


<!--  </div>-->

<!--  <div class="course-container" v-if="value_semester != ''">-->
<!--&lt;!&ndash;      <course-card_2 :tableData="tableData" ref="callCourseCardRef1" />&ndash;&gt;-->
<!--    <course-card_2 ref="callCourseCardRef1" />-->

<!--&lt;!&ndash;    <div v-for="item in tableData" >&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="card-container">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="card-info"  >&ndash;&gt;-->
<!--&lt;!&ndash;          <header class="card-title">&ndash;&gt;-->
<!--&lt;!&ndash;            {{ item.courseNum }}&ndash;&gt;-->
<!--&lt;!&ndash;          </header>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-divider/>&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="card-content">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="course-semester">&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.semester }}&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="task-description">&ndash;&gt;-->
<!--&lt;!&ndash;              <p class="sub-title">Task description: </p>&ndash;&gt;-->

<!--&lt;!&ndash;              help us!&ndash;&gt;-->

<!--&lt;!&ndash;              <li>&ndash;&gt;-->
<!--&lt;!&ndash;                Number of Assigments: {{ item.numOfAssignments }}&ndash;&gt;-->
<!--&lt;!&ndash;              </li>&ndash;&gt;-->
<!--&lt;!&ndash;              <li>&ndash;&gt;-->
<!--&lt;!&ndash;                Number of labs: {{ item.numOfLabsPerWeek }}&ndash;&gt;-->
<!--&lt;!&ndash;              </li>&ndash;&gt;-->
<!--&lt;!&ndash;              <li>&ndash;&gt;-->
<!--&lt;!&ndash;                Number of Tutorials : {{ item.numOfTutorialsPerWeek }}&ndash;&gt;-->
<!--&lt;!&ndash;              </li>&ndash;&gt;-->
<!--&lt;!&ndash;              <p class="sub-title">prerequisites: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.prerequisite }}&ndash;&gt;-->

<!--&lt;!&ndash;              <p class="sub-title">Maker's responsibility: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.markerResponsibility }}&ndash;&gt;-->

<!--&lt;!&ndash;              <p class="sub-title">Tutor's responsibility: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.tutorResponsibility }}&ndash;&gt;-->

<!--&lt;!&ndash;              <p class="sub-title">Available hours: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.totalAvailableHours }}&ndash;&gt;-->

<!--&lt;!&ndash;              <p class="sub-title"># students: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              We need students: {{ item.estimatedNumOfStudents }}&ndash;&gt;-->

<!--&lt;!&ndash;              <p class="sub-title">Deadline: </p>&ndash;&gt;-->
<!--&lt;!&ndash;              {{ item.deadLine }}&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->


<!--&lt;!&ndash;            <div class="course-coordinator">&ndash;&gt;-->
<!--&lt;!&ndash;              <p style="font-size: x-large;">Course coordinator</p>&ndash;&gt;-->
<!--&lt;!&ndash;              <ui v-for="coordinator in item.courseCoordinator">&ndash;&gt;-->

<!--&lt;!&ndash;                <ull>Name: {{ coordinator.name }}</ull>&ndash;&gt;-->
<!--&lt;!&ndash;                <ul>Email: <a :href="coordinator.email">{{ coordinator.email }}</a></ul>&ndash;&gt;-->

<!--&lt;!&ndash;              </ui>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;              <el-button style="color: rgb(255 255 255);background-color: #00467f;">Apply</el-button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--  </div>-->



<!--</template>-->

<!--<style scoped lang="scss">-->
<!--  .course-container {-->
<!--    margin: 20px 30px;-->
<!--    display: grid;-->
<!--    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));-->
<!--    //grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));-->
<!--    grid-auto-rows: inherit;-->
<!--    gap: 20px;-->
<!--    //height: 230px;-->
<!--  }-->

<!--  //.show-style{-->
<!--  //  padding-top: 25px;-->
<!--  //  /* padding-right: 20px; */-->
<!--  //  padding-left: 30px;-->
<!--  //  padding-bottom: 10px;-->
<!--  //}-->
<!--  //-->
<!--  //.course-list{-->
<!--  //  padding-left: 30px;-->
<!--  //  padding-top: 15px;-->
<!--  //}-->
<!--  .course-list-semester{-->
<!--    text-align: center;-->
<!--    padding: 10px;-->
<!--  }-->


<!--  .card-container{-->
<!--    box-shadow: inset 1px 1px 0 0 hsl(0deg 0% 100%), 0 8px 31px 0 #9c989833;-->
<!--    //width: 500px;-->
<!--    //height: 900px;-->
<!--    height: auto;-->
<!--    border-radius: 30px;-->
<!--    position: relative;-->
<!--    .task-description{-->
<!--      padding: 20px;-->
<!--    }-->
<!--    .sub-title{-->
<!--      font-size: 18px;-->
<!--      font-weight: bold;-->
<!--    }-->
<!--    .card-info{-->
<!--      margin: 35px;-->
<!--      height: auto;   /* adapted height */-->
<!--      .card-title {-->
<!--        font-size: 20px;-->
<!--        text-align: center;-->
<!--        margin-top: 30px;-->
<!--        font-weight: bolder;-->
<!--      }-->
<!--      .course-semester{-->
<!--        color: #959595;-->
<!--      }-->

<!--    }-->
<!--  }-->
<!--  .card-info{-->
<!--    padding-top: 1px;-->
<!--  }-->
<!--  .course-coordinator{-->
<!--    padding-bottom: 25px;-->
<!--  }-->
<!--</style>-->