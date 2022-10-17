<template>
  <el-drawer
      v-model="visibleSync"
      direction="ttb"
      size="100%"
      :z-index="100"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="header-container">
        <h2>Courses</h2>
        <el-alert v-if="onSelectName" :title="onSelectName" :center="true" type="warning" effect="dark" :closable="false"
                  class="currentTermAlert"/>
      </div>
    </template>
    <div class="manage-course-container">
      <section>
        <div class="manage-course-subtitle">
          <el-input v-model="searchCourse" placeholder="Search by course number. e.g. COMPSCI235" size="small"
                    clearable/>
          <el-button type="info" plain @click="importShowEvent">Import</el-button>
          <el-button type="primary" plain @click="handleCourseAdd">Add Course</el-button>
        </div>
        <article>
          <div style="height: calc(100vh - 173px)">
            <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2 :columns="columns" :data="filterCourses" :width="width" :height="height" style="margin: 0; padding: 0;" fixed>
                  <template #empty>
                    <div class="flex items-center justify-center h-100%">
                      <el-empty description="Please select term from above" :image-size="120"/>
                    </div>
                  </template>
                </el-table-v2>
              </template>
            </el-auto-resizer>
          </div>
        </article>
      </section>
    </div>

  </el-drawer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import { useElementBounding } from '@vueuse/core'


const props = defineProps(['fullScreenCourseVisible', 'onSelectName', 'searchCourse', 'importShowEvent', 'handleCourseAdd', 'filterCourses', 'columns'])
const emit = defineEmits(['update:fullScreenCourseVisible', 'update:onSelectName', 'update:searchCourse', 'update:importShowEvent', 'update:handleCourseAdd', 'update:filterCourses', 'update:columns'])

const visibleSync = computed({
  get() {
    return props.fullScreenCourseVisible as boolean
  },
  set(val) {
    emit('update:fullScreenCourseVisible', val)
  }
})

</script>

<style scoped lang="scss">
.header-container {
  display: flex;
}

.currentTermAlert {
  margin-left: 5px;
  padding: 0;
  width: auto;
  font-weight: bold;
  height: 22px;
}

h2 {
  font-size: 25px;
}

.manage-course-container {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  section {
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;

    .manage-course-subtitle {
      display: flex;
      width: 100%;
      margin-bottom: 10px;

      .add-term {
        margin-left: auto;
      }

      .el-input {
        margin-left: auto;
        width: 30%;
        height: 30px;
        margin-top: 2px;
      }

      button {
        margin-left: 20px;
      }
    }
  }

}

</style>