/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
//商品列表
 export function menulist(params){
  return http.get(`${resquest}/menu_list`,params);
}
//商品详情
 export function menudetails(params){
  return http.get(`${resquest}/menu_details`,params);
}
//添加
 export function menuadd(params){
  return http.post(`${resquest}/menu_add`,params);
}
//修改
 export function menuedit(params){
  return http.post(`${resquest}/menu_update`,params);
}
//删除
 export function menudel(params){
  return http.post(`${resquest}/menu_del`,params);
}

//  export function authAdminSave(params,formName){
//     if(formName === "add"){
//         return http.post(`${resquest}/admin_add`,params);
//     }else{
//         return http.post(`${resquest}/admin_update`,params);
//     }

// }
//  export function authAdminDelete(params){
//   return http.post(`${resquest}/admin_del`,params);
// }
