/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
//商户申请列表
 export function enterpriseList(params){
  return http.get(`${resquest}/enterprise_list`,params);
}
 export function myenterpriseList(params){
  return http.get(`${resquest}/myenterprise_list`,params);
}
 export function employeelist(params){
  return http.get(`${resquest}/employee_list`,params);
}
//  export function authAdminRoleList(params){
//   return http.get(`${resquest}/role_list`,params);
// }
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
