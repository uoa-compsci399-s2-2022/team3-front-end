<template>
  <div class="page-container">
    <el-row style="align-items: center;">
      <el-col :md="12">
        <el-select v-model="selectedTerm" class="m-2" placeholder="Term" style="margin-right: 10px">
          <el-option
              v-for="item in stateTerm"
              :key="item.termName"
              :label="item.termName"
              :value="item.termID"
          />
        </el-select>
        <el-select v-model="tutorOrMarker" class="m-2" placeholder="Marker or Tutor">
          <el-option key="Marker" label="Marker" value="Marker"/>
          <el-option key="Tutor" label="Tutor" value="Tutor"/>
        </el-select>
      </el-col>
      <el-col :md="9">
        <el-alert title="Tips: Rows in the table can be expanded or clicked" type="info" show-icon />
      </el-col>
      <el-col style="text-align: end" :md="3">
        <el-button type="success" size="large"><font-awesome-icon style="margin-right: 4px; font-size: 20px" icon="fa-solid fa-bullhorn" /> Publish</el-button>
      </el-col>
    </el-row>
    <br/>

    <el-tabs tab-position="right" class="tabs" v-model="selectedTab" fixed="right">
      <el-tab-pane label="Pending">
        <template #label>
          <div :class="{selected_item: selectedTab==='0'}">
            <font-awesome-icon icon="fa-solid fa-file-circle-question"/>
            Pending
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="statePendingApplication"
                       v-model:isLoading="isLoadingPendingApplication"/>
      </el-tab-pane>
      <el-tab-pane label="Accepted">Accepted</el-tab-pane>
      <el-tab-pane label="Rejected">Rejected</el-tab-pane>
      <el-tab-pane label="Published">Published</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch, reactive} from 'vue'
import {ElTable} from 'element-plus'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {useAsyncState} from "@vueuse/core";
import {get} from "@/utils/request";
import ApprovalTable from '@/components/applicationUseful/ApprovalTable.vue'


const selectedTerm = ref()
const selectedStatus = ref('Pending')
const tutorOrMarker = ref("")
const selectedTab = ref('0')


const {isLoading: isLoadingTerm, state: stateTerm, isReady: isReadyTerm, execute: executeTerm} = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)

const {
  isLoading: isLoadingPendingApplication,
  state: statePendingApplication,
  isReady: isReadyPendingApplication,
  execute: executePendingApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/${selectedStatus.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


watch(selectedTerm, (newVal, oldVal) => {
  if (selectedTerm.value) {
    executePendingApplication()
  }

})


</script>


<style scoped>
.page-container {
  margin: 30px 30px 0;
}


.selected_item {
  font-size: larger
}

.tabs {
}

</style>