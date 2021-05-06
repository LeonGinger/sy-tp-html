import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import "./role"; // 权限

import "./mock"; // 模拟数据

import "./assets/icons/iconfont";
import './assets/icons/GNLEON/iconfont';
import IconSvg from "./components/common/IconSvg.vue"; // svg组件
import * as echarts from 'echarts';
import '@/directive/permission.js'; //自定义权限组件
import VueI18n from 'vue-i18n'
import Print from 'vue-print-nb';
Vue.use(Print);  //注册
Vue.prototype.$echarts = echarts;
Vue.use(VueI18n)

//
Vue.prototype.baseURL = "http://sy.zsicp.com";
// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
const i18n = new VueI18n({
    locale: 'zh', // 语言标识
    
})
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
