<template>
    <div class="login-container">

          <swiper class="swiper" ref="mySwiper" :options="swiperOption">

            <swiper-slide v-for="(img,index) in swiperImglist" :key="index">
                <img class="swiperimg" :src="img" />
            </swiper-slide>

            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>

        <div class="head-logo">
            <a :href="weburl">
                <i slot="prefix" class="el-input__icon"><icon-svg style="font-size: 32px;" icon-class="suyuan"/></i>
            </a>
        </div>
        <div class="head-menu"  v-if="false">
            <i slot="prefix" class="el-input__icon"><icon-svg style="font-size: 32px;" icon-class="caidan-copy"/></i>
        </div>

        <div class="login-box">
        <el-form :style="{top:formtop}" class="card-box login-form" autoComplete="on" :model="ruleForm" :rules="rules" ref="ruleForm"
                 label-position="left">
            <h3 class="title">溯源后台系统登录</h3>
            <div v-if="logintype==1">
                <el-row>
                  <el-col :span="24"><div class="grid-content bg-purple-dark">&nbsp;</div></el-col>
                </el-row>

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
                <el-button type="primary" style="width:100%;margin-bottom:30px;" v-loading.fullscreen.lock="loading"
                           @click.native="handleLogin()">登录
                </el-button>
            </div>
            </div>
            <div v-if="logintype==2" id="wxbox">
                 <h5 class="wxscan-title">使用微信扫一扫</h5>
                <wxlogin :href="wxlogincss" :appid="appid" :scope="scope" :redirect_uri="redirect_uri"></wxlogin>
            </div>
            <div>

                <el-button v-if="otherlogin" type="primary" style="width:100%;margin-bottom:30px;"
                           @click='showDialog = true'>
                    第三方登录
                </el-button>
                <a class="g-white cur-logintype" href="#" @click="curlogintype">{{logintips}}</a>
            </div>
        </el-form>

        </div>


        <div class="login-footer">
            <el-row>
              <el-col :span="24"><div class="grid-content bg-purple-dark" v-html="websidedata.copyright">{{websidedata.copyright}}</div></el-col>
            </el-row>
        </div>


        <el-dialog title="第三方验证" :visible.sync="showDialog">
            <!-- 邮箱登录成功,请选择第三方验证<br/> -->
            <wxlogin :theme="white" :appid="appid" :scope="scope" :redirect_uri="redirect_uri"></wxlogin>
        </el-dialog>

    </div>
</template>

<script>

import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import { DOMAIN_ADMIN_URL,DOMAIN_URL } from "../../config/app";
import wxlogin from 'vue-wxlogin';
import {sendcode} from '@/api/auth/login.js';
import {settingno} from "@/api/pool";
const redirectUri = encodeURI("http://ai.zsicp.com/admin/login/sylogin?item=sy");
const wxloginCss = DOMAIN_URL+"/static/css/wxlogin.css";
import 'swiper/css/swiper.css';
export default {
    components: {
        Swiper,
        SwiperSlide,
        wxlogin,
    },
    directives: {
      swiper: directive
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
            weburl:DOMAIN_ADMIN_URL,
            swiperImglist:[
                'http://sy.zsicp.com/static/images/bg1.jpg'
                // 'http://sy.zsicp.com/static/images/bg2.jpg',
            ],
            swiperOption:{

                direction: 'vertical',
                autoplay:false,
                loop:false,
                slidesPerView: 1,
                spaceBetween: 30,
                // setWrapperSize: true,
                mousewheel: false,
                autoHeight: false,
                height: window.innerHeight,
                pagination: {
                  el: '.swiper-pagination',
                  clickable: false
                }
                // some swiper options/callbacks
                // 所有的参数同 swiper 官方 api 参数
                       // ...

            },
            websidedata:[],
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
        callback(){

        },
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
                .then(response=>{
                    if(response.code!=200){this.$message.error(response.message);}
                })
                .catch(()=>{
                    this.$message.error('系统出现未知错误,请稍后再试');
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
                            if (response.code!=200) {
                                this.$message.error(response.message);
                                this.loading = false;
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
        },
        getsetting(){
            settingno()
                .then(response=>{
                    this.websidedata = response.data;
                })
                .catch(()=>{

                })
        },

    },
    computed:{
        swiper(){
              return this.$refs.mySwiper.$swiper;
        }
    },
    mounted(){
      this.swiper.slideTo(3, 1000, false);
    },
    created() {
        if(this.$route.params.refresh){
            //错误页面 回来的刷新
            location.reload();
        }
        // 将参数拷贝进查询对象
        this.getsetting();
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


// $bg: #2d3a4b;
$bg: "";
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
    @include relative;
    height: 100%;
    background-color: $bg;
    // background-image: url('http://sy.zsicp.com/static/images/2kbg.png')!important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 0;
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    .head-logo,.head-menu,.login-box,.login-footer{z-index: 1!important;}
    .head-logo{
        position: fixed;
        top: 20px;
        left: 40px;
        a{
            color:#fff;
        }
    }
    .head-menu{
        background-color: #293444d1;
        padding: 2px;
        position: fixed;
        right:40px;
        top: 20px;
    }
    .swiperimg{
        width: 100%;
    }
    .login-box{
            background-color: #293444d1;
            top: 100px;
            right: 100px;
            height: 500px;
            position: fixed;
            width: 400px;
        }
    .login-footer{
        background-color: #29344491;
        // background-color:#293444;
        position: fixed;
        bottom: 0;
        width: 100%;
        color: #000000;
        a{
            color: #ff2a75;
        }
        p{
            margin: 40px;
            text-align: center;
            color: #fff;
        }
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
        margin: 0 auto 0.2333rem auto;
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
    .wxscan-title{
        width: 100%;
        position: fixed;
        text-align: center;
        top: 50px;
        font-size: 1.1rem;
    }
    .cur-logintype{
        color: #eee!important;
        text-decoration: underline;
    }
}
</style>
