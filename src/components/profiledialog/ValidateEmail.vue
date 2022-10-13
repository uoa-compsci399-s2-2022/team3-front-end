<template>
<el-input></el-input>
  <el-button circle @click="checkCode">Submit</el-button>
</template>

<script setup lang="ts">
import { ref ,defineExpose} from 'vue'
import {normalNotification} from "@/utils/notification";

const code = ref('')
const email = ref('')
const validation = ref('')

const checkCode = () =>{

}
console.log(email.value)
defineExpose({
  getEmail(data : string){
    email.value = data
  },
  result(){
    return validation.value
  }

})
</script>

<style scoped>

</style>