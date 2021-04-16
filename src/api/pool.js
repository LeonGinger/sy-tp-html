/**
 * Created by lk on 21/03/22
 */
import axios from "../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";

//  export function enterpriseList(params){
//   return http.get(`${resquest}/enterprise_list`,params);
// }

/*获取省市级数据-无token*/
export function region_list(params) {
    return http.get(`${resquest}/region/get_region`,params);
}
/*首页面板数据*/
export function getindex_data(params) {
    return http.get(`${resquest}/index_data`,params);
}
/*首页echarts数据*/
export function getecharts_data(params) {
    return http.get(`${resquest}/index_echartsdata`,params);
}
/*系统常见问题列表*/
export function problem_list(params) {
    return http.get(`${resquest}/pb_index`,params);
}
/*常见问题添加*/
export function problem_add(params) {
    return http.post(`${resquest}/pb_add`,params);
}
/*常见问题编辑*/
export function problem_edit(params) {
    return http.post(`${resquest}/pb_edit`,params);
}
/*常见问题删除*/
export function problem_del(params) {
    return http.post(`${resquest}/pb_del`,params);
}
/*商家须知了列表*/
export function buNotice_index(params) {
    return http.get(`${resquest}/bn_index`,params);
}
/*商家须知修改*/
export function buNotice_edit(params) {
    return http.post(`${resquest}/bn_edit`,params);
}
/*修改网站配置*/
export function system_set(params) {
    return http.post(`${resquest}/sys_save`,params);
}
/*获取网站配置*/
export function setting(params) {
    return http.get(`${resquest}/setting_index`,params);
}
export function settingno(params) {
    return http.get(`${resquest}/setting_indexno`,params);
}
/*粉丝列表*/
export function fans_index(params) {
    return http.get(`${resquest}/fans_list`,params);
}
/*同步粉丝*/
export function fans_sync(params) {
    return http.post(`${resquest}/fans_sync`,params);
}
/*同步粉丝任务状态*/
export function fans_syncstate(params) {
    return http.get(`${resquest}/fans_syncstate`,params);
}
/*数据库备份*/
export function baseindex(params) {
    return http.get(`${resquest}/database_index`,params);
}
export function basedump(params) {
    return http.post(`${resquest}/database_dump`,params);
}
export function basedown(params) {
    // return window.location.href =  `${resquest}/database_down?time=`+params;
    return http.post(`${resquest}/database_down`,params);
}
export function basedel(params) {

    return http.post(`${resquest}/database_del`,params);
}







/*测试token*/
// export function testtoken(params) {
//     return http.get(`wap/user/user/set_token`,params);
// }
