/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
//商品列表
 export function business_Find(params){
  return http.get(`${resquest}/businessAll`,params);
}
//商品详情
 export function business_update(params){
  return http.get(`${resquest}/business_update`,params);
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
