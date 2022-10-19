<script setup lang="ts">
import {MoreFilled} from '@element-plus/icons-vue';


type Props = {
  course: any
}
const props = defineProps<Props>()

</script>

<template>
  <div class="card-container">
    <div class="info">
      <p class="title">{{ course.courseNum }}</p>
      <p class="text">{{ course.courseName }}</p>
    </div>

    <div class="role-wrapper">

      <el-tooltip
          effect="dark"
          :content="course.roleName"
          placement="right-end"
      >
        <font-awesome-icon icon="fa-solid fa-chalkboard-user" class="role"
                           v-if="course.roleName === 'courseCoordinator'"/>
        <font-awesome-icon icon="fa-solid fa-marker" class="role" v-else-if="course.roleName === 'marker'"/>
        <font-awesome-icon icon="fa-solid fa-book-open-reader" class="role" v-else-if="course.roleName === 'tutor'"/>
        <font-awesome-icon icon="fa-solid  fa-graduation-cap" class="role" v-else-if="course.roleName === 'student'"/>
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" class="role" v-else/>
      </el-tooltip>
    </div>
    <div class="card-edit">
      <el-icon>
        <MoreFilled/>
      </el-icon>
    </div>
  </div>

</template>

<style scoped lang="scss">
.card-container {
  border-radius: 10px;
  height: 190px;
  background-color: rgb(11, 65, 109);
  box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
  position: relative;

  .card-edit {
    color: white;
    font-size: 20px;
    position: absolute;
    top: 10px;
    right: 10px;

    .el-icon {
      transform: rotate(90deg);
    }
  }

  .info {
    padding-left: 10px;
    padding-top: 20px;
    color: white;

    .title {
      font-size: 20px;
      font-weight: bold;
    }

    .text {
      font-size: 13px;
    }
  }

  .role-wrapper {
    text-align: center;
    width: 70px;
    height: 70px;
    border-radius: 100px;
    background: white;
    position: absolute;
    top: 50%;
    left: 65%;
  }
}


.role {
  color: #183153;
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

</style>


