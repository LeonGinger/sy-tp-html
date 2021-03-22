/**
 * Created by lk on 21/03/22
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";

//  export function enterpriseList(params){
//   return http.get(`${resquest}/enterprise_list`,params);
// }

/*获取省市级数据-无token*/
export function region_list {
    return http.get(`${resquest}/region/get_region`,params);
}
