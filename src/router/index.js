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
import fans from "../views/userManage/fans.vue";

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
import information from "../views/enterprise/information.vue";

//商品管理
import menumodify from "../views/menu/menumodify.vue";
import menulist from "../views/menu/menulist.vue";
import classify from "../views/menu/classify.vue";

//溯源批次管理
import orderadd from "../views/source/orderadd.vue"
import order from "../views/source/order.vue";
import sourcelist from "../views/source/sourcelist.vue";
import opdencode from "../views/source/opdencode.vue";

//查询管理
import certify_list from "../views/certify/list";
import statistics from "../views/certify/statistics";
import orderpull from "../views/certify/orderpull"

//系统设置
import system from "../views/setting/system.vue";
import database from "../views/setting/database.vue";
// Vue.use(VueRouter);

const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");
// const main = r =>
//     require.ensure([], () => r(require("../views/home/adminMain.vue")), "home");
// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [
    {
        path: "*",
        component: err404,
        meta:{
            keepalive:true,
        },
        hidden: true
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        meta:{
            keepalive:true,
        },
        hidden: true
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        meta:{
            keepalive:true,
        },
        hidden: true
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        meta:{
            keepalive:true,
        },
        hidden: true
    },
    {
        path: "/login",
        component: login,
        name: "登录",
        meta:{
            keepalive:true,
        },
        hidden: true
    },
    {
        path: "/",
        component: Home,
        redirect: "/home/adminMain",
        name: "首页",
        hidden: true,
        meta:{
            keepalive:true,
        }
    },
    {
        path: "/home",
        component: Home,
        redirect: "/home/adminMain",
        icon: "shouye",
        name: "首页",
        noDropdown: true,
        meta: {
            keepalive:true,
            authRule: ["adminMain"]
        },
        children: [
            {
                path: "adminMain",
                component: adminMain,
                meta:{
                    keepalive:true,
                }
            }
        ]
    },
    {
        path: "/readme",
        component: Home,
        redirect: "/readme/main",
        icon: "shouye",
        name: "控制台",
        hidden:true,
        noDropdown: true,
        meta:{
            keepalive:true,
        },
        children: [
            {
                path: "main",
                component: main,
                meta:{
                    keepalive:true,
                }
            }
        ]
    },
    {
        path: "/components",
        redirect: "/components/uploadList",
        hidden:true,
        component: Home,
        name: "components",
        icon: "tongyong",
        meta:{
            keepalive:true,
        },
        children: [
            {
                path: "uploadList",
                name: "上传图片的展示",
                meta:{
                    keepalive:true,
                },
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
                component: tinymce,
                meta:{
                    keepalive:true,
                }
            },
            {
                path: "upload",
                name: "上传的demo",
                component: upload,
                meta:{
                    keepalive:true,
                }
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
            authRule: ["user_manage"],
            keepalive:true,
        },
        // noDropdown: true,
        children: [
            {
                path: "fans",
                component: fans,
                name: "粉丝管理",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["admin/auth.fans/index"]
                }
            },
            {
                path: "/userManage/adminManage",
                component: adminRouter,
                redirect: "/userManage/authAdmin/index",
                name: "管理组",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["user_manage/admin_manage"]
                },
                children: [
                    {
                        path: "authAdmin",
                        component: authAdmin,
                        name: "管理员管理",
                        icon: "",
                        meta: {
                            keepalive:true,
                            authRule: ["admin/auth.admin/index"]
                        }
                    },
                    {
                        path: "authRole",
                        component: authRole,
                        name: "角色管理",
                        icon: "",
                        meta: {
                            keepalive:true,
                            authRule: ["admin/auth.role/index"]
                        }
                    },
                    {
                        path: "authPermissionRule",
                        component: authPermissionRule,
                        name: "权限管理",
                        icon: "",
                        meta: {
                            keepalive:true,
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
        hidden:true,
        meta: {
            keepalive:true,
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
                    keepalive:true,
                    authRule: ["admin/ad.site/index"]
                }
            },
            {
                path: "ad",
                component: ad,
                name: "广告管理",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["admin/ad.ad/index"]
                }
            }
        ]
    },
    {
        path: "/enterprise",
        redirect: "/enterprise/apply",
        component: Home,
        icon: "shangjia",
        name: "商户管理",
        meta: {
            keepalive:true,
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
                    keepalive:true,
                    authRule: ["enterprise/apply"]
                }
            },
            {
                path: "MyEnterprise",
                component: MyEnterprise,
                name: "我的商户",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["enterprise/myenterprise"]
                }
            },
            {
                path: "employee",
                component: employee,
                name: "员工管理",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["enterprise/employee"]
                }
            },
            {
                path: "information",
                component: information,
                name: "信息管理",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["enterprise/information"]
                }
            }
        ]
    },
    {
        path: "/menu",
        redirect: "/menu/menulist",
        component: Home,
        icon: "shangpin1",
        name: "商品管理",
        meta: {
            keepalive:true,
            authRule: ["menu"]
        },
        // noDropdown: true,
        children: [
            {
                path: "add",
                component: menumodify,
                name: "新增商品",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["menu/menu.menulist/add"]
                }
            },
            {
                path: "edit",
                component: menumodify,
                name: "编辑商品",
                hidden:true,
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["menu/menu.menulist/edit"]
                }
            },
            {
                path: "menulist",
                component: menulist,
                name: "商品列表",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["menu/menulist"]
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
    {
        path: "/source",
        redirect: "/source/order",
        component: Home,
        icon: "pici",
        name: "批次管理",
        meta: {
            keepalive:true,
            authRule: ["source"]
        },
        // noDropdown: true,
        children: [
            {
                path: "orderadd",
                component: orderadd,
                name: "新建批次",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["source/orderadd"]
                }
            },
            {
                path: "order",
                component: order,
                name: "批次列表",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["source/order"]
                }
            },
            {
                path: "sourcelist",
                component: sourcelist,
                name: "溯源码列表",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["source/sourcelist"]
                }
            },
            {
                path: "opdencode",
                component: opdencode,
                name: "溯源码打印",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["source/opdencode"]
                }
            }
        ]
    },
    {
        path: "/certify",
        redirect: "/certify/list",
        component: Home,
        icon: "tongjidefuben3",
        name: "查询管理",
        meta: {
            keepalive:true,
            authRule: ["certify"]
        },
        // noDropdown: true,
        children: [
            {
                path: "list",
                component: certify_list,
                name: "查询记录",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["certify/list"]
                }
            },
            {
                path: "statistics",
                component: statistics,
                name: "查询统计",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["certify/statistics"]
                }
            },
            {
                path: "orderpull",
                component: orderpull,
                name: "发货统计",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["certify/orderpull"]
                }
            }
        ]
    },
    {
        path: "/set",
        redirect: "/setting/system",
        component: Home,
        icon: "tongji-copy",
        name: "系统设置",
        meta: {
            keepalive:true,
            authRule: ["setting"]
        },
        // noDropdown: true,
        children: [
            {
                path: "system",
                component: system,
                name: "系统设置",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["sys/seeting"]
                }
            },
            {
                path: "database",
                component: database,
                name: "数据备份",
                icon: "",
                meta: {
                    keepalive:true,
                    authRule: ["sys/database"]
                }
            },
        ]
    },
];
