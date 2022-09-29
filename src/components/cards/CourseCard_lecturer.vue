<script setup lang="ts">
import Test from '@/components/cards/Test.vue'
  let title = "Compsci 101 : Capstone Project"
  let semester = "semester one"
  let course_descriptions = " This course is an introduction to programming computers. It is the main introductory course in the Computer Science department and is taken by students from a variety of disciplines wishing to have an understanding of computer programming as well as students wanting to continue on to further studies in Computer Science."
  let num_assignment = 4
  let num_mark_assignment = 3
  let num_tut = 10
  let requirement = "A grade in this course; GPA at least 6.0."
  let Workload = 31
  let num_student = 300
  let num_tutor = 2
  let num_marker = 10
  let deadline = "2/17/2022"
  let coordinator_name = "John"
  let coordinator_email = "www.google.com"
</script>

<template>
  <div class="card-container">
    <div class="card-info">
        <header class="card-title">
          {{title}}
  <!--        {{ title }}-->
        </header>

      <div class="card-content">
        <div class="course-semester">
          <p style="text-align: right">{{semester}}</p>
        </div>
        <el-divider/>

        <div class="task-description">
          <p class="sub-title"> Course Description:</p>
          <p style="font-size: small">{{course_descriptions}}</p>
          <p class="sub-title">Task description: </p>
          <li>
            Total {{ num_assignment}} Assignment; {{num_mark_assignment}} need to mark.
          </li>

          <li>
            Total {{ num_tut }} Tutorials.
          </li>
          <p class="sub-title">Prerequisites: </p>
          <p>{{requirement}}</p>

          <p class="sub-title" style="display: inline-block">Workload:</p>
          {{Workload}}
          <p></p>
          <p class="sub-title" style="display: inline-block">Estimated number of students: </p>
          {{num_student}}
          <p></p>
          <p class="sub-title">Tutors: </p>
          We need {{ num_tutor }} tutors.
          <p class="sub-title">Markers: </p>
          We need {{ num_marker }} markers.

          <p class="sub-title">Deadline: </p>
          {{deadline}}
        </div>
        <el-divider/>


        <div class="course-coordinator">
          <p style="font-size: x-large;">Course coordinator</p>
          <li>
            Name: {{coordinator_name}}
          </li>
          <li>
            Email: <a href={{coordinator_email}}>{{ coordinator_email }}</a>
          </li>
        </div>
      </div>
<!--      <el-divider style="position: absolute; bottom: 70px"/>-->
      <div class="card-buttons">

        <el-button style="color: rgb(255 255 255);background-color: #00467f;">Apply</el-button>

      </div>
    </div>
  </div>

</template>


<style scoped lang="scss">
.card-container{
  box-shadow: inset 1px 1px 0 0 hsl(0deg 0% 100%), 0 8px 31px 0 #9c989833;
  width: auto;
  height: auto;
  border-radius: 30px;
  position: relative;
  .task-description{
    padding: 20px;
  }
  .sub-title{
    font-size: small;
    font-weight: bold;
  }
  .card-info{
    margin: 35px;
    height: auto;
    .card-title {
      font-size: large;
      text-align: center;
      margin-top: 30px;
      font-weight: bolder;
    }
    .course-semester{
      font-size: x-small;
      color: #959595;
    }
    .card-buttons{
      bottom: 30px;
      position: absolute;
      right: 40px;
    }

  }
}


</style>
