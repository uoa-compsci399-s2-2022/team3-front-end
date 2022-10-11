<template>
  <div class="cong-page-container">
    <div class="icon-center">
      <ConfettiExplosion :stageHeight="1500" :duration="5000" v-if="showConfetti"/>
      <el-icon><CircleCheck /></el-icon>
    </div>
    <div class="text-center">
      {{$route.query.text}}
    </div>
  </div>

</template>

<script setup lang="ts">
import { CircleCheck } from "@element-plus/icons-vue";
import ConfettiExplosion from "vue-confetti-explosion";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";

const route = useRoute()
const router = useRouter()


const showConfetti = ref(true)

onMounted(()=>{
  setTimeout( async ()=>{
    showConfetti.value = false
    await router.push({path: route.query.next})
    router.go(0)
  }, 3000)

})

</script>



<style scoped>
.cong-page-container{
  background: #2f5cb3;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.icon-center{
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  color: white;
}


.text-center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: white;
  margin: 0;
  padding: 0;
}

@media screen and (max-width: 768px) {
  .text-center{
    font-size: 25px;
  }
}

</style>