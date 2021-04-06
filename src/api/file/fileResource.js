/**
 * 资源管理相关
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
// 列表
export function fileResourceList(params) {
return http.get(`${resquest}/image_list`,params);
}
// 添加
export function fileResourceAdd(params) {
    return http.post(`${resquest}/image_upload`,params);
}
