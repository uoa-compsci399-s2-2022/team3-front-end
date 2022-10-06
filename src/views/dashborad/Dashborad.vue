<script setup lang="ts">
import CourseCard from '@/components/cards/CourseCard.vue'
import CourseCard_2 from '@/components/cards/CourseCard_2.vue'
import {ref} from 'vue'
import CourseList from '@/components/cards/CourseList.vue'
import {get} from "@/utils/request";
const value = ref('1')
const value_semester = ref('')
const options =[
  {
    value : '1',
    label : 'Course Card'
  },
  {
    value: '2',
    label: 'Course List'
  },
]

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
const callCourseListRef = ref()

const callCourse = (termID : String, type: String) => {
  // type === 1 CourseCard function
  // type === 2 CourseList function
  if (type === '1') {
    callCourseCardRef.value.showCourses(termID)
  } else {
    callCourseListRef.value.showCourses(termID)
  }

}
const resetSemesterStatus= () => {
  value_semester.value = ''
}
</script>

<template>



  <div class="show-style">
     <el-select  placeholder="Select" v-model="value">
       <el-option
           v-for="item in options"
           :key="item.value"
           :label="item.label"
           :value="item.value"
           @click="resetSemesterStatus"
      />
     </el-select>
   </div>

  <div class="course-semester" v-if="value != ''">
    <el-divider content-position="center">Select a semester</el-divider>
    <div class="course-list-semester">
      <el-select  placeholder="Select a semester" v-model="value_semester" >

        <el-option
            v-for="item in options_semester"
            :key="item.value_semester"
            :label="item.label_semester"
            :value="item.value_semester"
            @click="callCourse(value_semester, value)"/>
      </el-select>
    </div>
  </div>
    <div class="course-container"  v-if="value === '1'">
      <course-card_2 ref="callCourseCardRef"/>
    </div>


  <div class="course-list" v-else-if="value === '2'">
    <course-list ref="callCourseListRef"/>
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