/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import http from "@/utils/http";
let resquest =  "/web";
// 获取信息
// export function userInfo(id, token) {
//     return axios({
//         url: "/userInfo",
//         method: "get",
//         params: { id, token }
//     });
// }

// export function loginName(userName, pwd) {
//     return axios({
//         url: "/index",
//         method: "post",
//         data: { userName, pwd }
//     });
// }

// export function logout(uid, token) {
//     return axios({
//         url: "/out",
//         method: "post",
//         data: { uid, token }
//     });
// }

// export function password(data) {
//     return axios({
//         url: "/password",
//         method: "post",
//         data: data
//     });
// }
// 新的封装请求
// export function userInfo(params){
export function userInfo(id, token){
  return http.get(`${resquest}/userInfo`,{id,token});
}
export function loginName(params){
  return http.post(`${resquest}/login`,params);
}
export function logout(uid, token){
  return http.post(`${resquest}/out`,{uid, token});
}
export function password(params){
  return http.post(`${resquest}/password`,params);
}
export function sendcode(params){
  return http.post(`${resquest}/auth/send_code`,params);
}
