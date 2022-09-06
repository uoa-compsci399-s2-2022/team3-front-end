import { createRouter, createWebHistory } from "vue-router";
import Home from '@/views/Home.vue'
import { usePermissionStore } from "@/store";
import { createVNode, render } from "vue";
import LoadingBar from "@/components/LoadingBar.vue";
import { get } from "@/utils/request";

const routes = [
    {
        path: "/",
        name: 'Home',
        component: Home,
        children: [
            {
                path: "dashboard",
                name: "dashboard",
                meta: { title:'DashBoard', permission: '1' },  
                alias: [''],
                component: () => import('@/views/dashborad/Dashborad.vue')
            },
        ]
    },
    {
        path: "/login",
        meta: { title: 'MTMS Login service'},
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/application',
        meta: { title:'Apply for the position', permission: '2' },
        component: () => import('@/views/forms/Application.vue')
    },
    {
        path: "/403",
        component: () => import('@/views/403.vue')
    },
    {
        path: "/404",
        component: () => import('@/views/404.vue')
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

const Vnode = createVNode(LoadingBar)
render(Vnode, document.body)
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    Vnode.component?.exposed?.startLoading(); // start the loading bar animation
    const store = usePermissionStore();
    // if the page permission id exists, but the user doesn't have the permission to this page
    // redirect to 403
    let loggedIn: boolean = false
    get('/api/loginStatus').then(
        res => {
            loggedIn = (res === "Login");
        }
    )
    if (to.meta.permission &&!loggedIn) {
        next('/login')
    } else if (to.meta.permission && !store.getKey.includes((to.meta.permission as string))) {
        next('/403')
    } else {
        next()
    }
    
})

router.afterEach((to, from) => {
    Vnode.component?.exposed?.endLoading(); // end the loading bar animation
})

export default router