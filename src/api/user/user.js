/**
 * Created by GNLEON on 21/3/31.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
//员工列表
 export function employeelist(params){
  return http.get(`${resquest}/employee_list`,params);
}
//删除员工
 export function employeedel(params){
  return http.post(`${resquest}/employee_del`,params);
}
//修改员工信息
 export function employeeedit(params){
  return http.post(`${resquest}/employee_edit`,params);
}
