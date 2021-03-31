/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
//商户列表
 export function enterpriseList(params){
  return http.get(`${resquest}/enterprise_list`,params);
}
//商家修改
 export function employeeupdate(params){
  return http.post(`${resquest}/enterprise_edit`,params);
}
//商家状态
 export function employeestate(params){
  return http.post(`${resquest}/enterprise_state`,params);
}
 export function employeelist(params){
  return http.get(`${resquest}/employee_list`,params);
}
