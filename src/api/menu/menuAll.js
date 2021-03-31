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
