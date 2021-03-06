/**
 * Created by lk on 18/4/28.
 */

import Mock from "mockjs";

import login from "./login";
import authAdmin from "./authAdmin";
import authPermissionRule from "./authPermissionRule";
import authRole from "./authRole";
import upload from "./upload";
import fileResourceTag from "./fileResourceTag";
import fileResource from "./fileResource";
import adSite from "./adSite";
import ad from "./ad";

import pool from "./pool";

// 登录相关
//Mock.mock(/\/web\/out/, "post", login.out);
// Mock.mock(/\/admin\/auth\/login\/password/, "post", login.password);
// Mock.mock(/\/web\/login/, "post", login.index);
// Mock.mock(/\/web\/userInfo/, "get", login.userInfo);

// 管理员相关
Mock.mock(/\/admin\/auth\/admin\/index/, "get", authAdmin.index);
Mock.mock(/\/admin\/auth\/admin\/roleList/, "get", authAdmin.roleList);
Mock.mock(/\/admin\/auth\/admin\/save/, "post", authAdmin.save);
Mock.mock(/\/admin\/auth\/admin\/edit/, "post", authAdmin.edit);
Mock.mock(/\/admin\/auth\/admin\/delete/, "post", authAdmin.del);
// 权限相关
Mock.mock(
    /\/admin\/auth\/permission_rule\/index/,
    "get",
    authPermissionRule.index
);
Mock.mock(
    /\/admin\/auth\/permission_rule\/tree/,
    "get",
    authPermissionRule.tree
);
Mock.mock(
    /\/admin\/auth\/permission_rule\/save/,
    "post",
    authPermissionRule.save
);
Mock.mock(
    /\/admin\/auth\/permission_rule\/edit/,
    "post",
    authPermissionRule.edit
);
Mock.mock(
    /\/admin\/auth\/permission_rule\/delete/,
    "post",
    authPermissionRule.del
);
// 角色相关
Mock.mock(/\/admin\/auth\/role\/index/, "get", authRole.index);
Mock.mock(/\/admin\/auth\/role\/save/, "post", authRole.save);
Mock.mock(/\/admin\/auth\/role\/edit/, "post", authRole.edit);
Mock.mock(/\/admin\/auth\/role\/delete/, "post", authRole.del);
Mock.mock(/\/admin\/auth\/role\/authList/, "get", authRole.authList);
Mock.mock(/\/admin\/auth\/role\/auth/, "post", authRole.auth);

/**
 * 上传相关
 */
// 获取上传token
Mock.mock(/admin\/file\/upload\/qiuNiuUpToken/, "get", upload.qiuNiuUpToken);
// 上传文件
Mock.mock(/admin\/file\/upload\/createFile/, "post", upload.createFile);

/**
 * 资源分组相关
 */
// 获取资源分组列表
Mock.mock(/admin\/file\/resource_tag\/index/, "get", fileResourceTag.index);
// 新建资源分组
Mock.mock(/admin\/file\/resource_tag\/add/, "post", fileResourceTag.add);
/**
 * 资源相关
 */
// 获取资源列表
Mock.mock(/admin\/file\/resource\/index/, "get", fileResource.index);
// 上传资源
Mock.mock(/admin\/file\/resource\/add/, "post", fileResource.add);

// 广告位相关
Mock.mock(/\/admin\/ad\/site\/index/, "get", adSite.index);
Mock.mock(/\/admin\/ad\/site\/adList/, "get", adSite.adList);
Mock.mock(/\/admin\/ad\/site\/save/, "post", adSite.save);
Mock.mock(/\/admin\/ad\/site\/edit/, "post", adSite.edit);
Mock.mock(/\/admin\/ad\/site\/delete/, "post", adSite.del);
// 广告相关
Mock.mock(/\/admin\/ad\/ad\/index/, "get", ad.index);
Mock.mock(/\/admin\/ad\/ad\/save/, "post", ad.save);
Mock.mock(/\/admin\/ad\/ad\/edit/, "post", ad.edit);
Mock.mock(/\/admin\/ad\/ad\/delete/, "post", ad.del);


//商家管理
//Mock.mock(/\/web\/enterprise_list/, "get", pool.company_list);
//Mock.mock(/\/web\/myenterprise_list/, "get", pool.mycompany_list);

//员工管理
// Mock.mock(/\/web\/employee_list/, "get", pool.userlist);
// Mock.mock(/\/web\/employeeuser_list/, "get", pool.employeelist);

//商品管理
// Mock.mock(/\/web\/menu_list/, "get", pool.menulist);
// Mock.mock(/\/web\/menu_details/, "get", pool.menudetails);

//面板数据
//Mock.mock(/\/web\/index_data/, "get", pool.indexdata);
// Mock.mock(/\/web\/index_echartsdata/, "get", pool.index_echartsdata);
//Mock.mock(/\/web\/problem_list/, "get", pool.problem);

export default Mock;
