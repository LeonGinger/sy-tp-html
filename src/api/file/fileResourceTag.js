/**
 * 资源分组相关
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
// 列表
export function fileResourceTagList(params) {
return http.get(`${resquest}/imagetag_list`,params);
}
// 创建分组
export function fileResourceTagAdd(params) {
    return http.post(`${resquest}/imagetag_add`,params);
}
