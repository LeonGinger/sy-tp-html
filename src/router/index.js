import Vue from "vue";
import VueRouter from "vue-router";

if (process.env.NODE_ENV === "development") {
    Vue.use(VueRouter);
}

import { ROUTER_MODE } from "../config/app";

import Home from "../views/home/index.vue";
import adminMain from "../views/home/adminMain.vue";
import echartstest from "../views/home/echartstest.vue";

// 管理组相关
import adminRouter from "../views/userManage/admin/router.vue";
import authAdmin from "../views/userManage/admin/authAdmin.vue";
import authRole from "../views/userManage/admin/authRole.vue";
import authPermissionRule from "../views/userManage/admin/authPermissionRule.vue";

// 上传相关
import tinymce from "../views/components/tinymce-demo.vue";
import upload from "../views/components/upload-demo.vue";

// 广告管理
import adSite from "../views/adManage/adSite.vue";
import ad from "../views/adManage/ad.vue";

//商家管理
import apply from "../views/enterprise/apply.vue";
import employee from "../views/enterprise/employee.vue";
import MyEnterprise from "../views/enterprise/MyEnterprise.vue";

//商品管理
import menumodify from "../views/menu/menumodify.vue";
import menulist from "../views/menu/menulist.vue";
import classify from "../views/menu/classify.vue";
// Vue.use(VueRouter);

const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
// const main = r =>
//     require.ensure([], () => r(require("../views/home/main.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/adminMain.vue")), "home");
// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [
    {
        path: "*",
        component: err404,
        hidden: true
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        hidden: true
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        hidden: true
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        hidden: true
    },
    {
        path: "/login",
        component: login,
        name: "登录",
        hidden: true
    },
    {
        path: "/",
        component: Home,
        redirect: "/readme",
        name: "首页",
        hidden: true
    },
    {
        path: "/readme",
        component: Home,
        redirect: "/readme/main",
        icon: "shouye",
        name: "控制台",
        noDropdown: true,
        children: [
            {
                path: "main",
                component: main
            }
        ]
    },
    {
        path: "/components",
        redirect: "/components/uploadList",
        component: Home,
        name: "components",
        icon: "tongyong",
        children: [
            {
                path: "uploadList",
                name: "上传图片的展示",
                component: r =>
                    require.ensure(
                        [],
                        () => r(require("../views/components/uploadList.vue")),
                        "home"
                    )
            },
            {
                path: "tinymce",
                name: "tinymce富文本编辑器",
                component: tinymce
            },
            {
                path: "upload",
                name: "上传的demo",
                component: upload
            }
        ]
    }
];

export default new VueRouter({
    // mode: 'history', //后端支持可开
    mode: ROUTER_MODE,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [
    {
        path: "/home",
        component: Home,
        redirect: "/home/adminMain",
        icon: "shouye",
        name: "首页",
        noDropdown: true,
        children: [
            {
                path: "adminMain",
                component: adminMain
            }
        ]
    },
    // {
    //     path: "/home",
    //     component: Home,
    //     redirect: "/home/echartstest",
    //     icon: "shouye",
    //     name: "echarts示例",
    //     noDropdown: true,
    //     children: [
    //         {
    //             path: "echartstest",
    //             component: echartstest
    //         }
    //     ]
    // },
    {
        path: "/userManage",
        redirect: "/userManage/adminManage/index",
        component: Home,
        icon: "guanliyuan1",
        name: "用户管理",
        meta: {
            authRule: ["user_manage"]
        },
        // noDropdown: true,
        children: [
            {
                path: "/userManage/adminManage",
                component: adminRouter,
                redirect: "/userManage/authAdmin/index",
                name: "管理组",
                icon: "",
                meta: {
                    authRule: ["user_manage/admin_manage"]
                },
                children: [
                    {
                        path: "authAdmin",
                        component: authAdmin,
                        name: "管理员管理",
                        icon: "",
                        meta: {
                            authRule: ["admin/auth.admin/index"]
                        }
                    },
                    {
                        path: "authRole",
                        component: authRole,
                        name: "角色管理",
                        icon: "",
                        meta: {
                            authRule: ["admin/auth.role/index"]
                        }
                    },
                    {
                        path: "authPermissionRule",
                        component: authPermissionRule,
                        name: "权限管理",
                        icon: "",
                        meta: {
                            authRule: ["admin/auth.permission_rule/index"]
                        }
                    }
                ]
            }
        ]
    },
    {
        path: "/adManage",
        redirect: "/adManage/adSite",
        component: Home,
        icon: "guanggao",
        name: "广告相关",
        meta: {
            authRule: ["ad_manage"]
        },
        // noDropdown: true,
        children: [
            {
                path: "adSite",
                component: adSite,
                name: "广告位管理",
                icon: "",
                meta: {
                    authRule: ["admin/ad.site/index"]
                }
            },
            {
                path: "ad",
                component: ad,
                name: "广告管理",
                icon: "",
                meta: {
                    authRule: ["admin/ad.ad/index"]
                }
            }
        ]
    },
    {
        path: "/enterprise",
        redirect: "/enterprise/apply",
        component: Home,
        icon: "guanggao",
        name: "商户管理",
        meta: {
            authRule: ["enterprise"]
        },
        // noDropdown: true,
        children: [
            {
                path: "apply",
                component: apply,
                name: "商户申请管理",
                icon: "",
                meta: {
                    authRule: ["admin/ad.site/index"]
                }
            },
            {
                path: "MyEnterprise",
                component: MyEnterprise,
                name: "我的商户",
                icon: "",
                meta: {
                    authRule: ["admin/ad.ad/index"]
                }
            },
            {
                path: "employee",
                component: employee,
                name: "员工管理",
                icon: "",
                meta: {
                    authRule: ["admin/ad.ad/index"]
                }
            }
        ]
    },
    {
        path: "/menu",
        redirect: "/menu/menulist",
        component: Home,
        icon: "guanggao",
        name: "商品管理",
        meta: {
            authRule: ["menu"]
        },
        // noDropdown: true,
        children: [
            {
                path: "menulist",
                component: menulist,
                name: "商品列表",
                icon: "",
                meta: {
                    authRule: ["admin/ad.site/index"]
                }
            },
            {
                path: "menumodify",
                component: menumodify,
                name: "新增商品",
                icon: "",
                meta: {
                    authRule: ["admin/ad.ad/index"]
                }
            },
            // {
            //     path: "classify",
            //     component: classify,
            //     name: "商品分类",
            //     icon: "",
            //     meta: {
            //         authRule: ["admin/ad.ad/index"]
            //     }
            // }
        ]
    },

];
