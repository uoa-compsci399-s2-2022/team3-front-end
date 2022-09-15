<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
const route = useRoute();
const matched = computed(() => route.matched.filter(item => item.meta && item.meta.title));
</script>
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <transition-group name="breadcrumb" mode="out-in">
            <el-breadcrumb-item :to="{ path: '/' }" key="/">Home</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in matched" :key="item.path" :to="{ path: item.path }">
                {{ item.meta.title }}
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