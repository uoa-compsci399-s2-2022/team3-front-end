<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();
type Paths = {
  path: string;
  title: any;
};

const matched = computed(() => {
  let paths = [] as Paths[];
  let m = route.matched.filter(item => item.meta && item.meta.title)
  m.forEach(item => {
    let p = item.path.split('/').filter(item => item)
    if (p.length > 1) {
      for (let i = 0; i < p.length; i++) {
        let newPath = p.slice(0, i+1).join('/')
        paths.push({
          path: "/" + newPath,
          title: router.getRoutes().filter((e) => e.path === "/" + newPath)[0].meta.title
        })
      }
    }else{
      paths.push({
        path: item.path,
        title: item.meta.title
      })
    }
  })
  return paths;
});
</script>
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb" mode="out-in">
            <el-breadcrumb-item :to="{ path: '/' }" key="/">Home</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ path: item.path }">
                {{ item.title }}
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<style scoped lang="scss">
.el-breadcrumb {
    margin-left: 40px;
    margin-top: 20px;
    font-size: 16px;
    background-color: rgb(255, 255, 255);
}

/* Breadcrumb */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
	transition: all 0.4s ease;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
	opacity: 0;
	transform: translateX(10px);
}
.breadcrumb-leave-active {
	position: absolute;
	z-index: -1;
}
</style>