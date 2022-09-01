import { createRouter, createWebHistory } from "vue-router";


const routes = [
    {
        path: "/",
        redirect: '/login'
    },
    {
        path: "/login",
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/application',
        component: () => import('@/views/forms/Application.vue')
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router