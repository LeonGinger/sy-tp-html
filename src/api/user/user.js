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


