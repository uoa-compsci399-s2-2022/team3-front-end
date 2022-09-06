<script setup lang="ts">
import { useSidebarStore } from '@/store/modules/sidebar/sidebar';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Odometer } from '@element-plus/icons-vue'


type sidebarTree = {
    icon?: any;
    index: string;
    title: string;
    permission?: string;
    subs?: sidebarTree[]
}[]

const items: sidebarTree = [
    {
        icon: 'Odometer',
        index: '/dashboard',
        title: 'Dashboard',
        permission: '1',
    },
    {
        icon: 'DocumentAdd',
        index: '/application',
        title: 'Application',
        permission: '2',
    }
]

const sidebar = useSidebarStore();
const onRoutes = computed(() => {
    return useRoute().path;
})
</script>

<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" :collapse="sidebar.collapse" :router="true" class="menu">

            <div class="control-collase">
                <el-icon v-show="sidebar.collapse" @click="sidebar.handleCollase">
                    <Expand />
                </el-icon>
                <el-icon v-show="!sidebar.collapse" @click="sidebar.handleCollase">
                    <Fold />
                </el-icon>
            </div>

            <div class="sidebar-logo">
                <a href="https://www.auckland.ac.nz">
                    <img src="@/assets/logo/uoa.svg" alt="UoA logo" />
                </a>
            </div>
            <template v-for="item in items">
                <template v-if="item.subs"></template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permission="item.permission">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>

        </el-menu>
    </div>
</template>

<style lang="scss">
.sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: aliceblue;
    background: red;

    .menu {
        --el-menu-bg-color: #00467f;
        --el-menu-text-color: white;
        --el-menu-hover-text-color: white;
        --el-menu-active-color: #002c52;
    }

    .menu:not(.el-menu--collapse) {
        width: 280px;
    }
    .menu:not(.el-menu--collapse) {
        .el-menu-item{
            &.is-active:before {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            content: "";
            background-color: #8ecaff;
        }
        }
    }
    

    .el-menu-item {
        

        &.is-active {
            background-color: #ffffff;
        }

        &.is-active:hover {
            background-color: #ffffff;
        }

        &:hover {
            background-color: #00396b;
        }
    }

    ul {
        height: 100%;
    }

    .control-collase {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: flex-end;
        padding: 10px 20px;

        .el-icon {
            color: white;
            font-size: 20px;
            transition: all 0.2s ease;
        }

        .el-icon:hover {
            svg {
                filter: drop-shadow(-0px 0px 1px rgb(255, 255, 255))
            }

            text-shadow: white 1rem 1rem 1rem;
        }
    }

    &-logo {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        img {
            width: 150px;
            cursor: pointer;
        }
    }


}
</style>