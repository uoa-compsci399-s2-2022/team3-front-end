<template>


  <el-card class="working-hour-card" v-loading="chartLoading">
    <div id="chart">
    </div>
    <span class="totalHours">{{totalWorkingHours}} h</span>
  </el-card>


</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onBeforeMount, onMounted, onUnmounted, ref, toRef, toRefs, watch} from "vue";
import {get} from "@/utils/request";

const props = defineProps <{termID: number}>()

const {termID} = toRefs(props)

let myChart;

const drawChart = () => {
  myChart = echarts.init(document.getElementById('chart'));
  let option: EChartsOption;
  option = {
    title: {
      text: 'Estimated Working Hours',
      left: 'left',
      top: 4,
      textStyle: {
        color: '#183153'
      }
    },
    tooltip: {
      trigger: 'item',
      confine: true
    },
    legend: {
      left: 'center',
      top: 'bottom',
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
        radius: [45, 130],
        center: ['50%', '38%'],
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: false
        },
        data: estimateHours.value.sort(function (a, b) {
          return b.value - a.value;
        }),
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
    estimateHours.value = []
    res.forEach((item: any) => {
      if (item.roleName !== "courseCoordinator") {
        estimateHours.value.push({
          name: item.courseNum + " - " + item.roleName,
          value: item.estimatedHours ? item.estimatedHours : 0
        })
      }
    })
  }).then(() => {
    drawChart()
    countTotalWoringHours()
  })
}

const totalWorkingHours = ref(0)
const countTotalWoringHours = () => {
  let total = 0
  estimateHours.value.forEach((item: ChartData) => {
    total += item.value
  })
  totalWorkingHours.value = total
}

watch(termID, () => {
  getData()
})
onMounted(() => {
  if (termID.value) {
    getData()
  }
})
onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
  }

})

</script>

<style scoped lang="scss">


.working-hour-card {
  position: relative;
  width: 100%;
  border-radius: 20px;
  box-shadow: #0b416d 0 0 12px;
  height: calc(100vh - 170px);
  overflow-y: scroll;
  overflow-x: hidden;
}


.working-hour-card::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.working-hour-card {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}



:deep(.el-card) .is-always-shadow {
  box-shadow: #0b416d 0 0 12px;
}

:deep(.el-card__body) {
  padding: 10px;
}


#chart {
  width: 100%;
  height: 580px;

}



.totalHours{
  position: absolute;
  top: 230px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 23px;
  font-weight: 600;
  color: #183153;
}


</style>