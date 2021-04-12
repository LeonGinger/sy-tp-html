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
export function setting(params) {
    return http.get(`${resquest}/setting_index`,params);
}


/*测试token*/
// export function testtoken(params) {
//     return http.get(`wap/user/user/set_token`,params);
// }
