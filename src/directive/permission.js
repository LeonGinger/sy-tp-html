import Vue from 'vue';
import store from "@/store/index";


/**
 * VUE 自定义权限指令
 * author:GNLEON
 * last:2021年3月31日09:29:34
 * @use v-permission = "action:add"
 * @doc https://cn.vuejs.org/v2/guide/custom-directive.html
 */

Vue.directive('permission',{
    inserted(el,binding){
        const perms = store.getters.authRules;
        // console.log("组件生效");
        if(store.getters.authRules[0]=="admin"){
            return true;
        }
        if(perms && !perms.contains(binding.value)){
            el.parentNode.removeChild(el);
            // 禁用
            //el.disabled = true;
            //el.classList.add('v-if="false"');
        }
    }
})

// eslint-disable-next-line no-extend-native
Array.prototype.contains = function (val) {
  return this.indexOf(val) !== -1
}
