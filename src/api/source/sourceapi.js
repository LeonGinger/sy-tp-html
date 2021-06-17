/**
 * Created by lk on 17/6/4.
 */
 import axios from "../../utils/axios";
 import http from "@/utils/http";
 let resquest =  "/web/";

  export function orderAdd(params){
    return http.get(`${resquest}/orderAdd`,params);
  }
  export function orderList(params){
   return http.get(`${resquest}/order_list`,params);
 }
  export function sourceList(params){
   return http.get(`${resquest}/source_list`,params);
 }
 export function ScodeList(params){
  return http.get(`${resquest}/scode_list`,params);
}
export function order_demo(params){
  return http.get(`${resquest}/order_demo`,params);
}
export function orderdelete(params){
  return http.get(`${resquest}/order_delete`,params);
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

 /*查询记录*/
 export function sourceLogindex(params){
   return http.get(`${resquest}/sourcelog_index`,params);
 }
 /*删除查询记录*/
 export function sourceLogDel(params){
   return http.post(`${resquest}/soucelog_del`,params);
 }
/*查询记录统计数据*/
 export function sroucelogEcharts(params){
   return http.get(`${resquest}/sroucelog_echarts`,params);
 }
 /*查询记录地图统计*/
 export function srouceareaEcharts(params){
   return http.get(`${resquest}/sroucearea_echarts`,params);
 }
 /*查询发货统计*/
 export function sourceListWhere(params){
  return http.get(`${resquest}/source_list_where`,params);
}

 export function orderupdate(params){
  return http.get(`${resquest}/orderupdate`,params);
 }

 /*修改溯源详情信息 */
 export function srouceupdate(params){
  return http.post(`${resquest}/sourceinfoupdate`,params);
 }
 