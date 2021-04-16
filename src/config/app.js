/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let BASE_URL = process.env.VUE_APP_API_BASE;
let DOMAIN_URL = "http://sy.zsicp.com";
let DOMAIN_ADMIN_URL = "http://sy.zsicp.com/admin";
let DOMAIN_H5_URL = "http://sy.zsicp.com/h5";
// let ROUTER_MODE = "history";
let ROUTER_MODE = "";
let IMG_BASE_URL = "http://sy.zsicp.com/uploads/";
let MY_CODE_URL = "http://sy.zsicp.com/h5/#/pages/traceability/traceability";
export { BASE_URL, ROUTER_MODE, IMG_BASE_URL, MY_CODE_URL,DOMAIN_URL,DOMAIN_ADMIN_URL,DOMAIN_H5_URL};
