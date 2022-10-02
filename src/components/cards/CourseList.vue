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
get('/api/availableTerm').then(res => {
  // var data = new Array()
  for (let i = 0; i < res.length; i++) {

    let termName = res[i].termName.toString();
    let termID = res[i].termID;
    let startDate = res[i].startDate;
    let endDate = res[i].endDate;
    let Date = startDate + " to " + endDate;



    options.value.push({
      value : termID.toString(),
      label: termName.toString(),

    })
  }
})



const showCourses = (termID : String) => {
  get('/api/getCourseByTerm/' + termID).then(res => {
    tableData.value = res;
  })
}

const handleApply = () => {
  alert("Apply Successfully")
}

</script>

<template>

  <el-divider content-position="center">Select a semester</el-divider>
  <div class="course-list-semester">
<!--    <el-cascader :options="options" clearable />-->
<!--    <el-button @click="showCourses(1) "></el-button>-->
      <el-select  placeholder="Select a semester" v-model="value" >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        @click="showCourses(value)" />
      </el-select>
  </div>

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
          <el-button type="primary" size="mini" @click="dialogVisible = true" >Detail</el-button>
        </template>
      </el-table-column>

      <el-table-column fiexd="right"  width="120px">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleApply(scope.$index, scope.row)">Apply</el-button>
        </template>
      </el-table-column>


    </el-table>
  </div>

  <div>
      <el-dialog v-model="dialogVisible"  width="50%"  draggable >
<!--        <el-divider content-position="center">Course Detail</el-divider>-->
        <course-card_2  />

      <el-button @click="dialogVisible = false" >Cancel</el-button>

    </el-dialog>
  </div>
</template>



<style scoped>
  .course-list-table{
    text-align: -webkit-center;
  }
  .course-list-semester{
    text-align: center;
    padding: 10px;
  }
</style>