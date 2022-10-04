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

            {
                path: "profile",
                name: "profile",
                meta: { title:'Profile', permission: '3' },
                component: () => import('@/views/profile/Profile.vue')
            },
            {
                path: 'applicationlist',
                meta: { title:'Application List', permission: '1' },
                component: () => import('@/views/Application/ApplicationList.vue')
            },
            {
                path: 'applicationapproval',
                meta: { title:'Application Approval', permission: '5' },
                component: () => import('@/views/Application/ApplicationApproval.vue')
            },
            //management
            {
                path: "managecourse",
                name: "managecourse",
                meta: { title:'Manage Course', permission: '5' },
                component: () => import('@/views/management/ManageCourse.vue')
            },
            {
                path: "manageuser",
                name: "manageuser",
                meta: { title:'Manage User', permission: '5' },
                component: () => import('@/views/management/ManageUser.vue'),

            },
            {
                path: "manageuser/batch-invite-user",
                name: "batch-invite-user",
                meta: { title:'Batch Invite User', permission: '5' },
                component: () => import('@/views/management/BatchInviteUser.vue')
            },
            {

                path: "courseList",
                name: "courseList",
                meta: { title:'Course List', permission: '1' },
                component: () => import('@/views/management/CourseList.vue')
            },
            {
                path: "manageEnrolment",
                name: "manageEnrolment",
                meta: { title:'Manage Enrolment', permission: '5' },
                component: () => import('@/views/management/ManageEnrolment.vue')
            },


        ]
    },
    {
        path: "/login",
        meta: { title: 'MTMS Login service'},
        component: () => import('@/views/login/Login.vue')
    },
    {
        path: '/application/:applicationID',
        meta: { title:'Apply for the position', permission: '2' },
        component: () => import('@/views/Application/Application.vue')
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
    },
    {
        path: "/test",
        component: () => import('@/views/test.vue')
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

const Vnode = createVNode(LoadingBar)
render(Vnode, document.body)
router.beforeEach((to, from, next) => {
    console.log("going to", to.path)
    document.title = `${to.meta.title}`;
    Vnode.component?.exposed?.startLoading(); // start the loading bar animation
    const store = usePermissionStore();

    // if the page permission id exists, but the user doesn't have the permission to this page
    // redirect to 403
    
    if (to.path === '/404') {
        console.log('404')
        next();
        return;
    }

    // if the user has token, but he don't have the permitted page list
    // then send a request to get the user's groups.
    if (localStorage.getItem('mtms_token') && store.key.size === 0) {
        console.log('redirectBasedOnLoginStatus without key');
        restoreUserKey().then(
            () => redirectBasedOnLoginStatus()
        ).catch(() => {
            redirectBasedOnLoginStatus();
        })
    } else {
        console.log('redirectBasedOnLoginStatus with key');
        redirectBasedOnLoginStatus();
    }
   
    function redirectBasedOnLoginStatus() {
        let loggedIn: boolean = false;
        if (!localStorage.getItem('mtms_token')) {
            console.log('no token');
            if (to.path !== '/login') {
                next('/login');
                return;
            }  else {
                next();
                return
            }  
        }
        get('/api/loginStatus').then(
            res => {
                loggedIn = (res === "Login");
            }
        ).then(() => {
            if (!loggedIn && to.path !== '/login') {
                console.log('token expired');
                next('/login')
            } else if (to.meta.permission && !store.getKey.includes((to.meta.permission as string))) {
                console.log("to.meata.permission:", to.meta.permission)
                console.log("store.getKey:", store.getKey)
                next('/403')
            } else if (loggedIn && to.path === '/login') {
                next('/dashboard')
            } else {
                console.log("permitted.")
                next()
            }
        }).catch((err) => {
            console.log(err)
            next('/404')
        }) 
    }

    function restoreUserKey(): Promise<any> {
        return get('/api/currentUser').then(
            responce => {
                store.setKeyFromGroups(responce.groups);
                sessionStorage.setItem('mtms_keys', JSON.stringify(store.getKey))
            }
        )
    }
})

router.afterEach((to, from) => {
    Vnode.component?.exposed?.endLoading(); // end the loading bar animation
})

export default router