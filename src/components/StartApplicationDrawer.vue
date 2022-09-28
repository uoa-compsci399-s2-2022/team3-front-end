<template>
  <el-drawer v-model="visible.visible" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Start an Application</h4>
    </template>
    <el-row justify="center" >
      <el-icon :size="40"><DocumentAdd /></el-icon>
    </el-row>

    <br/>
    Please select a term:
    <br/> <br/>
    <el-row justify="center">
      <el-select v-model="value" class="m-2" placeholder="Terms" size="large">
        <el-option
            v-for="item in termList"
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

const value = ref()
const termList = reactive([] as object[])
onBeforeMount(() => {
  get('api/availableTerm').then((res) => {
    console.log(res)
    res.forEach((e: { termName: string; termID: number; }) => {
      termList.push({label: e.termName, value: e.termID})
    })
  })

})

const startApplication = () => {
  let applicationID: number = -1;
  if (value.value === undefined) {
    ElMessage.error('Please select a term.')
    return
  }
  get('api/newApplication/' + value.value).then(res => {
    console.log(res)
    applicationID = res['application_id']
  }).then(res => {
        router.push('/application/' + applicationID)
      }
  )

}


</script>

<style scoped>


@media (max-width: 540px) {

}




</style>