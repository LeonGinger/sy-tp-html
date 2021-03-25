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

/*测试token*/
export function testtoken(params) {
    return http.get(`wap/user/user/set_token`,params);
}
