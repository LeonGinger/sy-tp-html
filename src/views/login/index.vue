<template>

    <div class="login-container">
        <div class="login-box">
        <el-form :style="{top:formtop}" class="card-box login-form" autoComplete="on" :model="ruleForm" :rules="rules" ref="ruleForm"
                 label-position="left">
            <h3 class="title">系统登录</h3>
            <div v-if="logintype==1">
           <el-form-item prop="mobile" class="item">
                <el-input
                    maxlength="11"
                    placeholder="手机号码"
                    name="mobile"
                    autoComplete="on"
                    v-model="ruleForm.mobile">
                    <i slot="prefix" class="el-input__icon"><icon-svg icon-class="shouji1"/></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" class="item">
                 <el-input
                     maxlength="8"
                     placeholder="验证码"
                     name="code"
                     autoComplete="on"
                     v-model="ruleForm.code">
                     <i slot="prefix" class="el-input__icon"><icon-svg icon-class="mima"/></i>
                 </el-input>
                 <el-button :disabled="disabled" @click="handleCode" type="primary">{{codetips}}</el-button>
             </el-form-item>

<!--            <el-form-item prop="username" class="item">
                <el-input
                    placeholder="邮箱"
                    name="userName"
                    autoComplete="on"
                    v-model="ruleForm.userName">
                    <i slot="prefix" class="el-input__icon"><icon-svg icon-class="user"/></i>
                </el-input>
            </el-form-item> -->
           <!-- <el-form-item prop="password" class="item"> -->
                <!--<span class="svg-container">-->
                <!--<icon-svg icon-class="pwd"/>-->
                <!--</span>-->
<!--s -->
            <div>
                <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"
                           @click.native="handleLogin()">登录
                </el-button>
            </div>
            </div>
            <div v-if="logintype==2" id="wxbox">

                <wxlogin :href="wxlogincss" :appid="appid" :scope="scope" :redirect_uri="redirect_uri"></wxlogin>
            </div>
            <div>

                <el-button v-if="otherlogin" type="primary" style="width:100%;margin-bottom:30px;"
                           @click='showDialog = true'>
                    第三方登录
                </el-button>
                <a @click="curlogintype">{{logintips}}</a>
            </div>
        </el-form>

        </div>

        <el-dialog title="第三方验证" :visible.sync="showDialog">
            <!-- 邮箱登录成功,请选择第三方验证<br/> -->
            <wxlogin :theme="white" :appid="appid" :scope="scope" :redirect_uri="redirect_uri"></wxlogin>
        </el-dialog>

    </div>
</template>

<script>

import wxlogin from 'vue-wxlogin';
import {sendcode} from '@/api/auth/login.js';
const redirectUri = encodeURI("http://ai.zsicp.com/admin/login/sylogin?item=sy");
const wxloginCss = "http://sy.zsicp.com/static/css/wxlogin.css";
export default {
    components: {
        wxlogin
    },
    data() {
        let validatePwd = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            formtop:"50%",
            logintips:"短信验证登录",
            white:"white",
            logintype:2,
            appid:'wx4640de1eee48017d',
            scope:'snsapi_login',
            redirect_uri:redirectUri,
            wxlogincss:wxloginCss,
            disabled:false,
            codetips:"发送验证码",
            codetime:15,
            otherlogin:false,
            ruleForm: {
                userName: "admin",
                mobile:"",
                code:"",
                pwd: "admin",
                checked: true
            },
            rules: {
                userName: [
                    { required: true, message: "请输入登录名", trigger: "blur" }
                ],
                pwd: [{ validator: validatePwd, trigger: "blur" }],
                mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                code: [{ required: true, message: "请输入验证码", trigger: "blur"}],

            },
            isShowPwd: false, // 是否显示密码
            loading: false, // 登录loading
            showDialog: false, // 显示dialog
            redirect: null // 回调地址
        };
    },
    methods: {
        curlogintype(){
           this.logintype = this.logintype==1?2:1;
           this.logintips = this.logintype==1?"扫码登录":"短信验证登录";
           this.formtop = this.logintype==1?"40%":"50%";

        },
        handleCode(){
            if(!this.ruleForm.mobile){this.$message.error('请输入手机号');return;}
            this.codetime = 15;
            this.timer();
            sendcode(this.ruleForm)
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
        handleLogin() {
            this.$refs["ruleForm"].validate(valid => {

                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("loginName", this.ruleForm)
                        .then(response => {
                            this.loading = false;
                            if (response.code!=200) {
                                this.$message.error(response.message);
                                return;
                            }
                            let path = "/";
                            if (this.redirect) {
                                path = this.redirect;
                            }
                            this.$router.push({
                                path: path
                            });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        },
        handleLogin_scan(code){
            if (code) {
                this.loading = true;
                this.$store
                    .dispatch("loginScan", {'code':code})
                    .then(response => {
                        this.loading = false;
                        if (response.code!=200) {
                            this.$message.error(response.message);
                            return;
                        }
                        let path = "/";
                        if (this.redirect) {
                            path = this.redirect;
                        }
                        this.$router.push({
                            path: path
                        });
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } else {
                return false;
            }
        }
    },
    created() {
        // 将参数拷贝进查询对象
        let query = this.$route.query;
        if(query.code){
            this.loading = true;
            this.handleLogin_scan(query.code);
        }
        if (query.redirect) {
            // URL Encode
            this.redirect = decodeURIComponent(query.redirect);
        }
    }
};
</script>

<style type="text/scss" lang="scss">
@import "../../styles/mixin";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    @include relative;
    height: 100%;
    background-color: $bg;
    background-image: url('http://sy.zsicp.com/static/images/2kbg.png')!important;
    background-repeat: no-repeat;
    background-position: 0 50%;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    .login-box{
            background-color: #293444;
            top: 20%;
            right: 100px;
            height: 500px;
            position: fixed;
            width: 400px;
        }
    .item {
        .el-form-item__content {
            display: flex;
            flex-flow: row;
        }
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 0.46rem 0.0666rem 0.16rem 0.2rem;
        color: $light_gray;
        height: 100%;
    }
    .el-input {
        display: inline-block;
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 0.13333rem;
    }
    .svg-container {
        padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
        color: $dark_gray;
        vertical-align: middle;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 0.5333rem auto;
        text-align: center;
        font-weight: bold;
    }
    .login-form {
        @include fxied-center;
        //top: 50%;
        width: 22em;
        padding: 0.4666rem 0.4666rem 0.2rem 0.4666rem;
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0.0666rem;
        color: #454545;
    }
    .show-pwd {
        position: absolute;
        right: 0.1333rem;
        top: 0.09333rem;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
    }
    .thirdparty-button {
        /*position: absolute;*/
        /*right: .4666rem;*/
        /*bottom: .37333rem;*/
    }
    #wxbox{
        .impowerBox{
            .title {display: none;}
        }
    }
}
</style>
