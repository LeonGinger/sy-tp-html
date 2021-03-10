/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web/";
// 权限管理

// 获取列表
// export function authPermissionRuleList(query) {
//     return axios({
//         url: "/admin/auth/permission_rule/index",
//         method: "get",
//         params: query
//     });
// }

// // 保存
// export function authPermissionRuleSave(data, formName, method = "post") {
//     let url =
//         formName !== "edit"
//             ? "/admin/auth/permission_rule/save"
//             : "/admin/auth/permission_rule/edit";
//     return axios({
//         url: url,
//         method: method,
//         data: data
//     });
// }

// // 删除
// export function authPermissionRuleDelete(data) {
//     return axios({
//         url: "/admin/auth/permission_rule/delete",
//         method: "post",
//         data: data
//     });
// }

// 新的请求
//列表
export function authPermissionRuleList(params){
  return http.get(`${resquest}/permission_list`,params);
}
//保存
export function authPermissionRuleSave(params,formName){
    if(formName !== "edit"){
        return http.post(`${resquest}/permission_add`,params);
    }else{
        return http.post(`${resquest}/permission_update`,params);
    }

}
//删除
export function authPermissionRuleDelete(params){
  return http.post(`${resquest}/permission_del`,params);
}
