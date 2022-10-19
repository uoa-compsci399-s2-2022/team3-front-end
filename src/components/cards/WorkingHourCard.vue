<template>
  <el-card class="box-card">
    <div id="chart">
    </div>
  </el-card>

</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onBeforeMount, onMounted, ref, toRef, toRefs, watch} from "vue";
import {get} from "@/utils/request";

const props = defineProps <{termID: number}>()

const {termID} = toRefs(props)


const drawChart = () => {
  let myChart = echarts.init(document.getElementById('chart'));
  let option: EChartsOption;
  option = {
    title: {
      text: 'Working Hours',
      left: 'left',
      top: 4,
      textStyle: {
        color: '#000'
      }
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      left: 'center',
      top: 40,
    },
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        radius: [45, 140],
        center: ['48%', '55%'],
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        data: estimateHours.value
      }
    ]
  };
  option && myChart.setOption(option);
  chartLoading.value = false;
}


type ChartData = {
  name: string
  value: number
}

const estimateHours = ref([] as ChartData[])
const chartLoading = ref(false)

function getData() {
  chartLoading.value = true
  get('/api/getCurrentUserEnrollByTerm/' + termID.value).then(res => {
    console.log(res)
    estimateHours.value = []
    res.forEach((item: any) => {
      if (item.roleName !== "courseCoordinator") {
        estimateHours.value.push({
          name: item.courseNum + " - " + item.roleName,
          value: item.estimateHours ? item.estimateHours : 0
        })
      }
    })
  }).then(() => {
    drawChart()
  })
}

watch(termID, () => {
  getData()
})
onMounted(() => {
  if (termID.value) {
    getData()
  }
})


</script>

<style scoped>


.box-card {
  width: 100%;
  border-radius: 20px;
  -moz-box-shadow: #0b416d 0 0 12px;
  -webkit-box-shadow: #0b416d 0 0 12px;
  box-shadow: #0b416d 0 0 12px;
  height: calc(100vh - 170px);
}

:deep(.el-card__body) {
  padding: 10px;
}


#chart {
  width: 100%;
  height: 500px;
}


</style>