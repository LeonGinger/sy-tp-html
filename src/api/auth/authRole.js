/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web/";
// // 获取列表
// export function authRoleList(query) {
//     return axios({
//         url: "/admin/auth/role/index",
//         method: "get",
//         params: query
//     });
// }

// // 编辑
// export function authRoleAuthList(query) {
//     return axios({
//         url: "/admin/auth/role/authList",
//         method: "get",
//         params: query
//     });
// }

// // 添加
// export function authRoleAuth(data) {
//     return axios({
//         url: "/admin/auth/role/auth",
//         method: "post",
//         data: data
//     });
// }

// // 保存
// export function authRoleSave(data, formName, method = "post") {
//     let url =
//         formName === "add" ? "/admin/auth/role/save" : "/admin/auth/role/edit";
//     return axios({
//         url: url,
//         method: method,
//         data: data
//     });
// }

// // 删除
// export function authRoleDelete(data) {
//     return axios({
//         url: "/admin/auth/role/delete",
//         method: "post",
//         data: data
//     });
// }

// 新的请求
//
// 列表
export function authRoleList(params){
  return http.get(`${resquest}/role_list`,params);
}
// 编辑
export function authRoleAuthList(params){
  return http.get(`${resquest}/authList`,params)
}
//授权
//
export function authRoleAuth(params){
  return http.post(`${resquest}/role_auth`,params);
}
//保存(添加)、编辑
//
export function authRoleSave(params,formName){
  if(formName === "add"){
      return http.post(`${resquest}/role_add`,params);
  }else{
      return http.post(`${resquest}/role_update`,params);
  }

}
//删除
export function authRoleDelete(params){
  return http.post(`${resquest}/role_del`,params);
}
