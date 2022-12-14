<script setup lang="ts">
import {get} from '@/utils/request'
import {ElMessage, ElMessageBox} from 'element-plus';
import {onBeforeMount, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import 'element-plus/theme-chalk/display.css';
import {useSidebarStore} from "@/store";
import {Expand} from '@element-plus/icons-vue';

const sidebar = useSidebarStore();

const router = useRouter();
const route = useRoute();
const name = ref<string>();
const email = ref<string>();

const logout = () => {

  ElMessageBox.confirm(
      'Are you sure you want to logout?',
      'Confirm',
      {
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(() => {
        get('/api/logout').then(() => {
          localStorage.removeItem('mtms_token');
          localStorage.removeItem('userID');
          sessionStorage.removeItem('mtms_keys');
          ElMessage({
            type: 'success',
            message: 'Logout success',
          })
          router.push('/login').then(() => {
            router.go(0)
          });
        }).catch(() => {
          ElMessage({
            type: 'error',
            message: 'Please Check your internect connection.',
          })
        })

      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Canceled',
        })
      })
}

async function getUserProfile() {
  let user = await get(`api/currentUser`);
  name.value = user.name;
  email.value = user.email;

}


const courseNum = ref<string>();
const role = ref<string>();
const getCourseNum = () => {
  if (route.name === "course-coordinator") {
    let courseID = route.params.courseId;
    role.value = "Course Coordinator";
    get('api/getCourse/' + courseID).then((res) => {
      courseNum.value = res.courseNum;
    })
  } else if (route.name === "tutor-marker") {
    let courseID = route.params.courseId;
    route.query.role as string === "tutor" ? role.value = "Tutor" : role.value = "Marker";
    get('api/getCourse/' + courseID).then((res) => {
      courseNum.value = res.courseNum;
    })

  }
}

watch(route, () => {
  getCourseNum()
  getUserProfile()
})

onBeforeMount(() => {
  getCourseNum()
  getUserProfile()
})



</script>

<template>
  <section>

    <div class="title" v-loading="!$route.name" v-show="$route.name==='course-coordinator' || $route.name==='tutor-marker'" @click="sidebar.handleCollase()">
      <el-icon class="expand-sidebar">
        <Expand/>
      </el-icon>
      {{ role }} - {{ courseNum }}
    </div>
    <div class="title" v-show="!($route.name==='course-coordinator' || $route.name==='tutor-marker')" @click="sidebar.handleCollase()">
      <el-icon class="expand-sidebar">
        <Expand/>
      </el-icon>
      {{ $route.meta.title }}
    </div>

    <div class="info-card">
      <!-- mock data -->
      <div class="info-card-avatar">
        <el-dropdown :hide-on-click="false">
          <img src="@/assets/avatar.svg" alt="">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">Profile</el-dropdown-item>
              <el-dropdown-item divided @click="logout">logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
      <div class="info-card-general hidden-sm-and-down">
        <div>{{ name }}</div>
        <div>{{ email }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>


section {
  display: flex;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 0px 10px 10px 10px;
  border-bottom: 1px solid rgb(210, 210, 210);

  .expand-sidebar {
    display: none;
  }

  .title {
    font-size: $fs-title;
    color: $uoa-dark;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  @media (max-width: 540px) {
    .expand-sidebar {
      display: inline;
    }
    .title {
      font-size: 25px;
    }
  }

  .info-card {
    margin-left: auto;

    display: flex;

    &-avatar {
      margin-right: 20px;

      img {
        border-radius: 100px;
        border: 1px solid rgb(210, 210, 210);
        width: 45px;
        height: 45px;
      }

      width: 45px;
      height: 45px;
    }

    &-general {
    }
  }
}
</style>