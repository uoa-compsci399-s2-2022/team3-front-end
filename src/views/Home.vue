<script setup lang="ts">
import { get } from '@/utils/request';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/header/Header.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import { useSidebarStore } from '@/store'
const sidebar = useSidebarStore()
</script>

<template>
  <div class="container">
    <Sidebar />
    <div class="container-main">
      <Header />
      <BreadCrumb />
      <router-view />
    </div>

  </div>

</template>

<style lang="scss">
@media (max-width: 730px) {
  .container-main {
    margin-left: 50px;
  }
}

@media (max-width: 540px) {
  .container-main {
    margin-left: 0;
  }
}

.container {
  display: flex;
  position: relative;
  align-items: flex-start;

  &-main {
    display: flex;
    flex-direction: column;
    width: calc(100% - var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    min-width: calc(100% - 260px);
  }
}

</style>