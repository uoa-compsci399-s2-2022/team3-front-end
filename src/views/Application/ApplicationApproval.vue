<template>
  <div class="page-container">
    <el-row style="align-items: center;">
      <el-col :md="12">
        <el-select v-model="selectedTerm" class="m-2" placeholder="Term" style="margin-right: 10px" v-loading="isLoadingTerm">
          <el-option
              v-for="item in stateTerm"
              :key="item.termID"
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
          <div :class="{selected_item: selectedTab==='0'}" class="tabs-label">
            <font-awesome-icon icon="fa-solid fa-file-circle-question"/> &nbsp;
            Pending
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="statePendingApplication"
                       v-model:isLoading="isLoadingPendingApplication"/>
      </el-tab-pane>
      <el-tab-pane label="Accepted">
        <template #label>
          <div :class="{selected_item: selectedTab==='1'}" class="tabs-label">
            <el-icon><CircleCheckFilled /></el-icon> &nbsp;
            Accepted
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="stateAcceptedApplication"
                       v-model:isLoading="isLoadingAcceptedApplication"/>
      </el-tab-pane>
      <el-tab-pane label="Rejected">
        <template #label>
          <div :class="{selected_item: selectedTab==='2'}" class="tabs-label">
            <el-icon><CircleCloseFilled /></el-icon> &nbsp;
            Rejected
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="stateRejectedApplication"
                       v-model:isLoading="isLoadingRejectedApplication"/>
      </el-tab-pane>
      <el-tab-pane label="Published">
        <template #label>
          <div :class="{selected_item: selectedTab==='3'}" class="tabs-label">
            <font-awesome-icon icon="fa-solid fa-bullhorn" /> &nbsp;
            Published
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="statePublishedApplication"
                       v-model:isLoading="isLoadingPublishedApplication" v-model:tagIndex="selectedTab" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch, reactive, onBeforeMount} from 'vue'
import {ElTable} from 'element-plus'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {useAsyncState} from "@vueuse/core";
import {get} from "@/utils/request";
import ApprovalTable from '@/components/applicationUseful/ApprovalTable.vue'
import {CircleCheckFilled, CircleCloseFilled} from '@element-plus/icons-vue'


const selectedTerm = ref()
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
      return get(`api/applicationListByTerm/${selectedTerm.value}/Pending`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingAcceptedApplication,
  state: stateAcceptedApplication,
  isReady: isReadyAcceptedApplication,
  execute: executeAcceptedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Accepted`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingRejectedApplication,
  state: stateRejectedApplication,
  isReady: isReadyRejectedApplication,
  execute: executeRejectedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Rejected`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingPublishedApplication,
  state: statePublishedApplication,
  isReady: isReadyPublishedApplication,
  execute: executePublishedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Published`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)



watch(selectedTab, (newVal, oldVal) => {
  if (selectedTerm.value) {
    if (selectedTab.value === '0'){
      executePendingApplication()
    } else if (selectedTab.value === '1'){
      executeAcceptedApplication()
    } else if (selectedTab.value === '2'){
      executeRejectedApplication()
    } else if (selectedTab.value === '3'){
      executePublishedApplication()
    }
  }
})


watch(selectedTerm, (newVal, oldVal) => {
  if (selectedTerm.value) {
    if (selectedTab.value === '0'){
      executePendingApplication()
    } else if (selectedTab.value === '1'){
      executeAcceptedApplication()
    } else if (selectedTab.value === '2'){
      executeRejectedApplication()
    } else if (selectedTab.value === '3'){
      executePublishedApplication()
    }

    localStorage.setItem('selectedTerm', selectedTerm.value)
  }
})

onBeforeMount(() => {
  executeTerm().then(
      () => {
        stateTerm.value.sort((a: Term, b: Term) => {
          return b.termID! - a.termID!
        })
        if (localStorage.getItem('selectedTerm')) {
          selectedTerm.value = stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localStorage.getItem('selectedTerm')!))[0].termID
          executePendingApplication()
        } else {
          selectedTerm.value = stateTerm.value[0].termID
        }

      }
  )
})


</script>


<style scoped>
.page-container {
  margin: 30px 30px 0;
}


.selected_item {
  font-size: 19px
}

.tabs-label {
  display: flex;
  align-items: center;
}

</style>