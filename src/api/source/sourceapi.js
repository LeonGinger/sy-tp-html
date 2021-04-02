/**
 * Created by lk on 17/6/4.
 */
 import axios from "../../utils/axios";
 import http from "@/utils/http";
 let resquest =  "/web/";
 // 获取列表
 // export function authAdminList(query) {
 //     return axios({
 //         url: "/admin/auth/admin/index",
 //         method: "get",
 //         params: query
 //     });
 // }
 
 // // 获取角色列表
 // export function authAdminRoleList(query) {
 //     return axios({
 //         url: "/admin/auth/admin/roleList",
 //         method: "get",
 //         params: query
 //     });
 // }
 
 // // 保存
 // export function authAdminSave(data, formName, method = "post") {
 //     let url =
 //         formName === "add"
 //             ? "/admin/auth/admin/save"
 //             : "/admin/auth/admin/edit";
 //     return axios({
 //         url: url,
 //         method: method,
 //         data: data
 //     });
 // }
 
 // // 删除管理员
 // export function authAdminDelete(data) {
 //     return axios({
 //         url: "/admin/auth/admin/delete",
 //         method: "post",
 //         data: data
 //     });
 
     // 新的请求
     //
  export function orderList(params){
   return http.get(`${resquest}/order_list`,params);
 }
  export function sourceList(params){
   return http.get(`${resquest}/source_list`,params);
 }
  export function authAdminSave(params,formName){
     if(formName === "add"){
         return http.post(`${resquest}/admin_add`,params);
     }else{
         return http.post(`${resquest}/admin_update`,params);
     }
 
 }
  export function authAdminDelete(params){
   return http.post(`${resquest}/admin_del`,params);
 }
 