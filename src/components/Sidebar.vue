<script setup lang="ts">
import {useSidebarStore} from '@/store/modules/sidebar/sidebar';
import {computed, onBeforeMount} from 'vue';
import {useRoute} from 'vue-router';
import {isMobile} from '@/utils/isMoblie'

type sidebarSubMenu = {
  index: string;
  title: string;
  permission: string;
  subs?: sidebarSubMenu[]
}

type sidebarMenu = {
  icon?: any;
  index: string;
  title: string;
  permission?: string;
  subs?: sidebarSubMenu[]
}[]

const items: sidebarMenu = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: 'Dashboard',
    permission: '1',
  },
  {
    icon: 'Document',
    index: '/applicationlist',
    title: 'Application List',
    permission: '2',
  },
  {
    icon: 'DocumentChecked',
    index: '/applicationapproval',
    title: 'Application Approval',
    permission: '5',
  },
  {
    icon: "Collection",
    index: "/courseList",
    title: "Course List",
    permission: "1",
  },
  {
    icon: 'Management',
    index: '3',
    title: 'Management',
    permission: '3',
    subs: [
      {
        index: '/managecourse',
        title: 'Manage Course',
        permission: '5',
      },
      {
        index: 'manageuserFolder',
        title: 'Manage User',
        permission: '3',
        subs: [
          {
            index: '/manageuser',
            title: 'Manage User',
            permission: '3',
          },
          {
            index: '/manageuser/batch-invite-user',
            title: 'Batch Invite User',
            permission: '3',
          }
        ]
      },
      {
        index: '/manageEnrolment',
        title: 'Manage Enrolment',
        permission: '5',
      },
    ]
  }];

const sidebar = useSidebarStore();
const onRoutes = computed(() => {
  const route = useRoute();
  return route.path == '/' ? '/dashboard' : route.path;
})

const modalDisplay = computed(() => {
  return {"display": `${sidebar.collapse ? "none" : "block"}`};
})


const mobileAutoCollapse = () => {
  if (isMobile()) {
    sidebar.handleCollase();
  }
}


setInterval(() => {
  if (sidebar.collapse){
    sidebar.display = !isMobile();
  }
}, 1000)

onBeforeMount(() => {
  sidebar.display = !isMobile();
})

</script>

<template>
  <div class="sidebar" v-if="sidebar.display">
    <el-menu :default-active="onRoutes" :collapse="sidebar.collapse" :router="true" class="menu" @select="mobileAutoCollapse">

      <div class="control-collase">
        <el-icon v-show="sidebar.collapse" @click="sidebar.handleCollase">
          <Expand/>
        </el-icon>
        <el-icon v-show="!sidebar.collapse" @click="sidebar.handleCollase">
          <Fold/>
        </el-icon>
      </div>

      <!--            <div class="sidebar-logo">-->
      <!--                <a href="https://www.auckland.ac.nz">-->
      <!--                    <img src="@/assets/logo/uoa.svg" alt="UoA logo" />-->
      <!--                </a>-->
      <!--            </div>-->
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permission="item.permission">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">
              <template v-if="subItem.subs">
                <el-sub-menu :index="subItem.index" :key="subItem.index" v-permission="subItem.permission">
                  <template #title>
                    <span>{{ subItem.title }}</span>
                  </template>
                  <template v-for="subSubItem in subItem.subs" :key="subSubItem.index">
                    <el-menu-item :index="subSubItem.index"
                                  v-permission="subSubItem.permission">
                      <span>{{ subSubItem.title }}</span>
                    </el-menu-item>
                  </template>
                </el-sub-menu>
              </template>
              <template v-else>
                <el-menu-item :index="subItem.index" :key="subItem.index" v-permission="subItem.permission">
                  <span>{{ subItem.title }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permission="item.permission">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>

      <div class="sidebar-logo" v-show="!sidebar.collapse">
          <a href="https://www.auckland.ac.nz">
              <img src="/uoa-white.webp" alt="UoA logo" />
          </a>
      </div>

    </el-menu>
  </div>

  <div class="model" :style="modalDisplay" @click="sidebar.handleCollase"></div>


</template>

<style lang="scss">
@media (max-width: 730px) {
  .sidebar {
    position: fixed !important;
    z-index: 999;
  }
}

@media (min-width: 730px) {
  .model {
    display: none !important;
  }
}

.model {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100vw;
  backdrop-filter: blur(4px);
  z-index: 998;
  background-color: rgba($color: #000000, $alpha: 0.1);
}

//@media (max-width: 540px) {
//  .sidebar {
//    display: none;
//  }
//}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background-color: aliceblue;
  background: red;

  .menu {
    --el-menu-bg-color: #222F3D;
    --el-menu-text-color: white;
    --el-menu-hover-text-color: white;
    --el-menu-active-color: #222F3D;

    .el-sub-menu__title:hover {
      background-color: #0099ff;
    }

  }

  .menu.el-menu--collapse {
    .el-sub-menu.is-active {
      .el-sub-menu__title {
        background-color: white;
      }
    }

  }

  .menu:not(.el-menu--collapse) {
    width: 260px;
  }

  .menu:not(.el-menu--collapse) {
    .el-menu-item {
      &.is-active:before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        content: "";
        background-color: #9ed8ff;
      }
    }
  }


  .el-menu-item {


    &.is-active {
      background-color: #ffffff;
    }

    &.is-active:hover {
      background-color: #ffffff;
    }

    &:hover {
      background-color: #0099ff;
    }
  }

  ul {
    height: 100%;
  }

  .control-collase {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;

    .el-icon {
      color: white;
      font-size: 20px;
      transition: all 0.2s ease;
    }

    .el-icon:hover {
      svg {
        filter: drop-shadow(-0px 0px 1px rgb(255, 255, 255))
      }

      text-shadow: white 1rem 1rem 1rem;
    }
  }

  &-logo {
    margin-bottom: 25px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    img {
      width: 90px;
      cursor: pointer;
    }
  }

}
</style>