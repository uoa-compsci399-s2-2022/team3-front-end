<script setup lang="ts">
import Test from '@/components/cards/Test.vue'
</script>

<template>
  <div class="card-container">
    <div class="card-info">
        <header class="card-title">
          Compsci 101 : Capstone Project
  <!--        {{ title }}-->
        </header>
      <el-divider/>
      <div class="card-content">
        <div class="course-semester">
          semester one
        </div>
        <div class="task-description">
          <p class="sub-title">Task description: </p>

          help us!

          <li>
            Number of Assigments: 70
          </li>
          <li>
            Number of labs: 100
          </li>
          <li>
            Number of Tutorials : 100
          </li>
          <p class="sub-title">prerequisites: </p>
          A+ in COMPSCI 101

          <p class="sub-title">Maker's responsibility: </p>
          sadfasdfasdf

          <p class="sub-title">Tutor's responsibility: </p>
          sadfasdfasdf

          <p class="sub-title">Available hours: </p>
          About 20 hours per week

          <p class="sub-title"># students: </p>
          We need students: 20

          <p class="sub-title"># Tutors: </p>
          We need tutors: 90

          <p class="sub-title">Deadline: </p>
          2021-12-12
        </div>


        <div class="course-coordinator">
          <p style="font-size: x-large;">Course coordinator</p>
          <li>
            Name: John
          </li>
          <li>
            Email: <a href="http://www.baidu.com">www.google.com</a>
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
  width: 500px;
  height: 900px;
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


</style>
