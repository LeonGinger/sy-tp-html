<template>

    <el-container class="wrapper">
        <el-scrollbar class="container-left" wrap-class="container-left-wrap" :class="{'slide-hide': isCollapse, 'slide-in-left': menuShow}">
            <div class="logo">
                <!--图片logo-->
                <!-- <span><i class="icon-suyuanfangwei"></i></span> -->
              <!-- <img alt="element-logo"
                :src="sysinfo.sitelogo"> -->
                <!--文字logo-->
                <span>后台</span>
            </div>
            <el-menu
                class="menu"
                :default-active="onRoutes"
                :collapse="isCollapse"
                style="border: none;"
                text-color="rgb(191, 203, 217)"
                background-color="rgb(48, 65, 86)"
                active-text-color="rgb(64, 158, 255)"
                unique-opened
                router>
                <sidebar-item v-for="item in routers" :key="item.path" :item='item' ></sidebar-item>
            </el-menu>
        </el-scrollbar>

        <el-container class="container-box" v-bind:class="{'slide-hide': isCollapse, 'slide-in-left': menuShow}">
            <el-header class="header">
                <div class="header-left">
                    <div class="header-toggle" @click="menuShow = !menuShow; showSideBar()">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="slide-toggle" :class="{'slide-toggle-open': isCollapse}" @click="toggleSideBar">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="header-tabs-box">
                    <el-breadcrumb class="app-levelbar" separator="/">
                        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
                        <span v-if='item.redirect==="noredirect"||index==levelList.length-1'
                              class="no-redirect">{{item.name}}</span>
                            <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>

                <div class="header-right">
                    <el-dropdown trigger="click">
                        <!--<i class="el-icon-setting" style="margin-right: 15px"></i>-->
                        <el-avatar style="margin: 10px;" shape="circle" :size="40" fit="cover" :src="avatar"></el-avatar>
                        <span>{{username}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><span @click="handlePhone">修改手机号</span></el-dropdown-item>
                            <el-dropdown-item><span @click="loginOut">退出登录</span></el-dropdown-item>
                            <el-dropdown-item disabled divided>主题切换</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>


                <!--新增界面-->
                <el-dialog title="修改密码" :visible.sync="passwordFormVisible" width="85%" top="5vh">
                    <el-form :model="passwordFormData" :rules="passwordFormDataRules" ref="passwordFormData">
                        <el-form-item label="原始密码" prop="old_password">
                            <el-input type="password" v-model="passwordFormData.old_password" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="new_password">
                            <el-input type="password" v-model="passwordFormData.new_password" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="check_new_password">
                            <el-input type="password" v-model="passwordFormData.check_new_password" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="passwordFormVisible = !passwordFormVisible">取消</el-button>
                        <el-button type="primary" @click.native="addSubmit('passwordFormData')" :loading="passwordLoading">提交</el-button>
                    </div>
                </el-dialog>
                <!-- 修改手机号 -->
                <el-dialog title="修改手机号" :visible.sync="phoneFormVisible" width="55%" top="5vh">
                    <el-form :model="phoneFormData" :rules="phoneFormDataRules" ref="phoneFormData">
                        <el-form-item label="原手机号" prop="old_phone">
                            <el-input disabled type="text" v-model="phoneFormData.old_phone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="新手机号" prop="new_phone">
                            <el-input type="text" v-model="phoneFormData.new_phone" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="code">
                            <el-input type="text" v-model="phoneFormData.code" auto-complete="off"></el-input>
                            <el-button :disabled="disabledcode" @click="handleCode" type="primary">{{codetips}}</el-button>

                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="phoneFormVisible = !phoneFormVisible">取消</el-button>
                        <el-button type="primary" @click.native="addSubmitphone('phoneFormData')" :loading="phoneLoading">提交</el-button>
                    </div>
                </el-dialog>
            </el-header>

            <!--遮板-->
            <div class="main-mask"
                 v-show="menuShow"
                 @click="menuShow = !menuShow"></div>

            <el-main class="main">

                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>

</template>


<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem.vue";
import { password } from "../../api/auth/login";
import { getAdminId } from "../../utils/auth";
import {sendcode} from '@/api/auth/login.js';
import {setting} from "@/api/pool.js";
export default {
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.passwordFormData.check_new_password !== "") {
                    this.$refs.passwordFormData.validateField(
                        "check_new_password"
                    );
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.passwordFormData.new_password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            sysinfo:[],
            disabledcode:false,
            codetips:"发送验证码",
            phoneLoading:false,
            phoneFormVisible:false,
            phoneFormData:{
                old_phone:"",
                new_phone:"",
                code:"",
            },
            menuShow: false,
            levelList: null,
            passwordLoading: false,
            passwordFormVisible: false,
            passwordFormData: {
                old_password: "",
                new_password: "",
                check_new_password: ""
            },
            phoneFormDataRules: {
                userName: [
                    { required: true, message: "请输入登录名", trigger: "blur" }
                ],
                new_phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                code: [{ required: true, message: "请输入验证码", trigger: "blur"}],
            },
            passwordFormDataRules: {
                old_password: [
                    {
                        required: true,
                        message: "请输入原始密码",
                        trigger: "blur"
                    }
                ],
                new_password: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur"
                    },
                    { validator: validatePass, trigger: "blur" }
                ],
                check_new_password: [
                    {
                        required: true,
                        message: "请再次输入密码",
                        trigger: "blur"
                    },
                    { validator: validatePass2, trigger: "blur" }
                ]
            }
        };
    },
    components: {
        SidebarItem
    },
    computed: {
        ...mapGetters({
            routers: "routers"
        }),
        onRoutes() {
            return this.$route.path;
        },
        username() {
            let username = this.$store.state.admin.userName;
            return !username ? this.name : username;
        },
        avatar(){
            let avatar = this.$store.state.admin.avatar;
            return !avatar ? this.avatar : avatar;
        },
        isCollapse() {
            return this.$store.state.app.sidebar.opened;
        }

    },
    mounted() {},
    methods: {
        getsetting(){
            setting()
                .then(response=>{
                    this.sysinfo = response.data;
                })
                .catch(()=>{

                })


        },
        toggleSideBar() {
            this.$store.dispatch("ToggleSideBar");
        },
        showSideBar() {
            this.$store.dispatch("ShowSideBar");
        },
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name);
            const first = matched[0];
            if (first && (first.name !== "首页" || first.path !== "")) {
                matched = [{ name: "首页", path: "/" }].concat(matched);
            }
            this.levelList = matched;
        },
        loginOut() {
            this.$confirm("此操作将退出系统, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store.dispatch("loginOut").then(() => {
                        location.reload(); // 为了重新实例化vue-router对象 避免bug
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "error",
                        message: "操作失败"
                    });
                });
        },
        // 显示更换手机号页面
        handlePhone(){
            this.phoneFormVisible = true,
            this.phoneFormData = {
                old_phone:"",
                new_phone:"",
                code:"",
            };
        },
        // 显示修改密码界面
        handlePassword() {
            this.passwordFormVisible = true;
            this.passwordFormData = {
                old_password: "",
                new_password: "",
                check_new_password: ""
            };
        },
        addSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.passwordLoading = true;
                    let data = Object.assign({}, this.passwordFormData);
                    data.adminId = getAdminId();
                    password(data)
                        .then(res => {
                            this.passwordLoading = false;
                            if (res.code) {
                                this.$message({
                                    message: res.message,
                                    type: "error"
                                });
                            } else {
                                this.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                                // 刷新表单
                                this.$refs["passwordFormData"].resetFields();
                                this.passwordFormVisible = false;
                                this.$store.dispatch("loginOut").then(() => {
                                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                                });
                            }
                        })
                        .catch(() => {
                            this.$message({
                                type: "error",
                                message: "操作失败"
                            });
                        });
                }
            });
        },
        handleCode(){
            if(!this.phoneFormData.new_phone){this.$message.error('请输入手机号');return;}
            this.phoneFormData.mobile = this.phoneFormData.new_phone;
            this.codetime = 15;
            this.timer();
            sendcode(this.phoneFormData)
                .then(respnse=>{

                })
                .cath(()=>{

                });
        },
        timer() {
         if (this.codetime > 0) {
          this.disabled=true;
          this.codetime--;
          this.codetips=this.codetime+"秒";
          setTimeout(this.timer, 1000);
         } else{
          this.codetime=0;
          this.codetips="发送验证码";
          this.disabled=false;
         }
         },
        addSubmitphone(){}
    },
    created() {
        console.log(this.$store)
        this.getBreadcrumb();
        this.getsetting();
    },
    watch: {
        $route() {
            this.getBreadcrumb();
        }
    }
};
</script>


<style type="text/scss" lang="scss">
@import "../../styles/mixin";
.el-header {
    /*background-color: #eef1f6;*/
    color: #333;
    padding: 0 10px;
}

.el-aside {
    color: #333;
}

.el-main {
    position: relative;
    padding: 0 10px 10px;
    background-color: #fff;
    margin-left: 7px;
    margin-top: 5px;
}
.main-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200%;
    z-index: 100;
    background-color: #000;
    opacity: 0.3;
}

.move-enter-active,
.move-leave-active {
    transition: opacity 0.5s;
}

.move-enter,
.move-leave {
    opacity: 0;
}

.wrapper {
    height: 100%;
    overflow-y: hidden;
    background-color: #f5f7f9;
}

.container-box {
    height: 100%;
    transition: -webkit-transform 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
    overflow-y: auto;
}

.container-left {
    background-color: rgb(48, 65, 86);
    transition: left 0.23s ease-in-out;
    height: 100%;
    flex: 0 0 auto;
}
.container-left-wrap {
    overflow-x: hidden !important;
}

.container-left .svg-icon {
    font-size: 20px;
    margin-right: 5px;
}

.container-left:not(.slide-hide) {
    width: 120px;
}

.container-left.slide-hide {
    .logo img {
        display: none;
    }
    .logo span {
        display: inline-block;
    }
}

.menu {
    width: 100% !important;
}

/*.menu::-webkit-scrollbar{*/
/*display: none;*/
/*}*/

.header {
    position: relative;
    text-align: left;
    font-size: 12px;
    line-height: $header-height;
    border-bottom: 1px solid #d8dce5;
    background-color: #fff;
}

.logo {
    display: block;
    width: 100%;
    line-height: 80px;
    text-align: center;
    color: #fff;
    transition: display 0.7s ease-in-out;
    img {
        vertical-align: middle;
        width: 200px;
    }
    span {
        display: none;
    }
}

.header-left {
    display: inline-block;
    height: $header-height;
    overflow: hidden;
}

.header-tabs-box {
    display: inline-block;
    height: $header-height;
    max-width: 60%;
    overflow: hidden;
}

.header-right {
    display: flex;
    height: 100%;
    margin-left: 10px;
    float: right;
    .el-dropdown {
        display: flex;
        cursor: pointer;
    }
    span {
        display: inline-block;
        @include text-overflow;
    }
    i {
        line-height: $header-height;
        margin-top: 2px;
    }
}

.app-levelbar {
    margin-left: 20px;
    line-height: 57px !important;
}

/*宽屏时出现*/
.slide-toggle {
    display: inline-block;
    height: $header-height;
    line-height: $header-height;
    text-align: center;
    cursor: pointer;
}

.slide-toggle span {
    display: inline-block;
    width: 2px;
    height: 12px;
    background-color: rgba(135, 141, 153, 0.8);
    margin-left: 5px;
}
.slide-toggle-open span {
    display: block;
    margin-left: 4px;
    margin-top: 4px;
    width: 16px;
    height: 2px;
}
.slide-toggle-open {
    padding-top: 17px;
}

@media screen and (min-width: 768px) {
    .main-mask {
        display: none;
    }
}

/*.slide-hide {*/
/*width: 64px !important;*/
/*}*/

@media screen and (max-width: 768px) {
    .main {
        overflow-y: scroll !important;
        -webkit-overflow-scrolling: touch;
    }

    .slide-hide.slide-in-left {
        -webkit-transform: translate3d(64px, 0, 0) !important;
        transform: translate3d(64px, 0, 0) !important;
    }
    .container-left.slide-hide.slide-in-left {
        left: -64px;
        width: 64px;
    }
    .container-left.slide-in-left {
        left: 0;
    }
    .container-left {
        margin-right: 0;
        opacity: 1;
        position: absolute !important;
        top: 0;
        left: -225px;
        z-index: 10;
        padding: 0;
    }

    .container-box.slide-in-left {
        min-width: 0;
        opacity: 1;
        -webkit-transform: translate3d(187px, 0, 0);
        transform: translate3d(187px, 0, 0);
        overflow: initial;
    }
    .header-toggle {
        display: block;
        /*background-color: #26a2ff;*/
        border-radius: 4px;
        /*border: 1px solid #fff;*/
        height: 40px;
        margin: 10px 0;
        padding: 2px 6px;
        outline: none;
        width: 40px;
        z-index: 10;
    }

    .header-toggle span {
        display: block;
        width: 100%;
        height: 4px;
        margin: 5px auto;
        background-color: rgba(135, 141, 153, 0.8);
    }

    .logo {
        display: none;
    }
    .slide-toggle {
        display: none;
    }
}
</style>
