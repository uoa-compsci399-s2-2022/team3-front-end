<template>
  <el-drawer v-model="visible.visible" :show-close="false" :size="drawerSize" :direction="drawerDirection">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Start an Application</h4>
    </template>
    <el-row justify="center">
      <el-icon :size="40">
        <DocumentAdd/>
      </el-icon>
    </el-row>

    <br/>
    Please select a term:
    <br/><br/>
    <el-row justify="center">
      <el-select v-model="termValue" class="m-2" placeholder="Terms" size="large">
        <el-option
            v-for="item in termList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-row>
    <br/><br/>
    Please select your application type:
    <br/><br/>
    <el-row justify="center">
      <el-select v-model="typeValue" class="m-2" placeholder="Terms" size="large">
        <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-row>
    <br/>
    <el-row justify="center">
      <el-button @click="startApplication" type="danger" size="large">Start</el-button>
    </el-row>


  </el-drawer>

</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import {ElButton, ElDrawer, ElMessage} from 'element-plus'
import {CircleCloseFilled} from '@element-plus/icons-vue'
import {get} from "@/utils/request";
import {useRouter} from 'vue-router';

const router = useRouter()

type Props = {
  visible: object
}
defineProps<Props>()

const termValue = ref()
const termList = reactive([] as object[])
const typeValue = ref()
const typeList = ref([{value:'tutor', label:'Tutor'}, {value: 'marker', label: 'Marker'}])
onBeforeMount(() => {
  get('api/availableTerm').then((res) => {
    console.log(res)
    res.forEach((e: { termName: string; termID: number; }) => {
      termList.push({label: e.termName, value: e.termID})
    })
  })
  responsiveLayout()

})

const startApplication = () => {
  let applicationID: number = -1;
  if (termValue.value === undefined || termValue.value === null) {
    ElMessage.error('Please select a term.')
    return
  }
  if (typeValue.value === undefined || typeValue.value === null) {
    ElMessage.error('Please select your application type.')
    return
  }
  get(`api/newApplication/${termValue.value}/${typeValue.value}`).then(res => {
    applicationID = res['application_id']
  }).then(res => {
        router.push('/application/' + applicationID)
      }
  ).catch(err => {
    ElMessage({
      message: err.response.data.message,
      type: 'error'
    })
  })

}

const drawerSize = ref()
const drawerDirection = ref()

setInterval(() => {
  responsiveLayout()
}, 2000)


const getWidth = () => {
  return window.innerWidth
}

const responsiveLayout = () => {
  drawerSize.value = getWidth() > 768 ? '30%' : '80%'
  drawerDirection.value = getWidth() > 768 ? 'rtl' : 'btt'
}


</script>

<style scoped>


@media (max-width: 540px) {

}

</style>