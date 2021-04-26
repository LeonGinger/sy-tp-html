<template>
    <div>
        <el-form ref="form" :model="business" label-width="120px" :rules="formRules">
          <el-form-item label="商家名称" prop="business_name">
            <el-col :span="12">
                <el-input v-model="business.business_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="负责人" prop="responsible_name">
              <el-col :span="12">
                <el-input v-model="business.responsible_name"></el-input>
              </el-col>
          </el-form-item>
          <el-form-item label="负责人手机" prop="responsible_phone">
              <el-col :span="12">
                <el-input v-model="business.responsible_phone"></el-input>
              </el-col>
          </el-form-item>
          <el-form-item label="商家地址" prop="business_address">
              <el-col :span="12">
                <el-input v-model="business.business_address"></el-input>
              </el-col>
          </el-form-item>
            <el-form-item label="商家介绍" prop="business_introduction">
              <el-col :span="12">
                <el-input type="textarea" rows="5" v-model="business.business_introduction"></el-input>
              </el-col>
            </el-form-item>
            <!-- 图片模块 -->
            <!-- 商家轮播图 -->
            <el-form-item label="商家轮播图" prop="business_images">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card">

                <li class="el-upload-list__item is-success" v-for="fit in business.business_images" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!---->

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'one')" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            v-if="businessimg"
            class="MenuCarousel"
            ref="upload1"
            :limit="6"
            :action="uploadUrl"
            list-type="picture-card"
            :data="{type:'list'}"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="handleBefore">
            <i class="el-icon-plus"></i>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>
            <!-- 商家证书 -->
            <el-form-item label="商家证书" prop="appraisal_image">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card">

                <li class="el-upload-list__item is-success" v-for="fit in business.business_appraisal.appraisal_image" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i>

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'two')" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            ref="upload2"
            v-if="monitor_imagechanger"
            class="MenuMonitor"
            :limit="1"
            :action="uploadUrl"
            list-type="picture-card"
            :data="{type:'appraisal'}"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveMonitor"
            :before-upload="handleBefore">
            <i class="el-icon-plus"></i>
            </el-upload>


            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>

            <!-- 商家图集 -->
            <el-form-item label="商家图集" prop="certificate_image">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card business_image_injson">

                <li class="el-upload-list__item is-success" v-for="(fit,index) in business.business_img.business_image_injson" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <el-input v-model="input[index]" placeholder="请输入内容"></el-input>
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <!-- <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i> -->
                    <label class="" style="
                        transform: rotate( 45deg);
                        border-left: 20px solid transparent;
                        border-right: 22px solid transparent;
                        border-bottom: 20px solid #13ce66;
                        position: absolute;
                        right: -15px;
                        top: -7px;
                        width: 40px;
                        height: 24px;
                        border-radius: 5px;

                    "><i style="
                        margin-left: -6px;
                        transform: rotate(-40deg);
                        font-size: 12px;
                        margin-top: 10px;
                    " class="el-icon-upload-success el-icon-check"></i>
                       <!-- <i slot="prefix" class="el-input__icon"><icon-svg style="font-size: 32px;" icon-class="chenggong"/></i> -->
                    </label>
                    <i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i>

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'tre',index)" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            v-if="imgjson"
            class="MenuMonitor"
            :limit="9"
            :action="uploadUrl"
            ref="upload3"
            list-type="picture-card"
            :data="{type:'business_image_injson'}"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveCertificate"
            :before-upload="handleBefore">
            <i class="el-icon-plus"></i>
            </el-upload>


            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>
            <!-- # -->
            <el-form-item>
                <el-button :type="formMap.type | formFilterType" @click="onSubmit">{{formMap.type | formFilterName}}</el-button>
                <el-button type="info" plain @click="returnlist">恢 复</el-button>
            </el-form-item>
            </el-form>
    </div>

</template>

<script>

    import {enterpriseList} from "@/api/enterprise/enterprise";
    import {menudetails,menuadd,menuedit} from "@/api/menu/menuAll.js";
    import {checkMoney} from "@/utils/tool.js";
    import { BASE_URL,IMG_BASE_URL } from "../../config/app";
    import time from "@/utils/utils.filter.js"
    import { business_Find,business_update } from "@/api/business/business.js"
    const initial = {
        id:'',
        menu_images_json:'',
        monitor_image:[],
        menu_weightt: '0',
        quality_time: '',
        // menu_weightt:'1',
    };
    const formJson = {
        id:'',
        menu_images_json:'',
        monitor_image:[],
        menu_weightt: '',
        quality_time: '',
        // menu_weightt:'1',
    };
    export default {
        data() {
            var validatemenuimglist = (rule, value, callback) =>{
                if(this.formMap.type == "add"){
                    if(this.menuimagelist.length==0){
                         callback(new Error('请上传至少一张商品图片.'));
                    }
                }
                if(this.formMap.type == "edit"){
                    if(typeof(this.formData.menu_images_json)=='object' && this.formData.menu_images_json.length>0){callback();}
                    if(this.menuimagelist.length>0){callback();}
                     callback(new Error('请上传至少一张商品图片.'));
                }
                callback();
            };
            return {
                uploadUrl: BASE_URL + "/web/file/uploadfile",
                formMap: {
                    add: "修 改",
                    edit: "编 辑",
                    type: "add",
                },
                menu_info:{},
                formRules: {
                    responsible_name: [
                        {
                            required: true,
                            message: "请输入负责人名称",
                            trigger: "blur"
                        }
                    ],
                    responsible_phone: [
                        {
                            required: true,
                            message: "请输入负责人手机号",
                            trigger: "blur",
                        }
                    ],
                    business_name: [
                        {
                            required: true,
                            message: "请输入商家名称",
                            trigger: "blur",
                            // type:"number",
                        }
                    ],
                    business_address: [
                        {
                            required: true,
                            message: "请输入商家地址",
                            trigger: "blur"
                        }
                    ],
                    business_introduction: [
                        {
                            required: true,
                            message: "请输入商家介绍",
                            trigger: "blur"
                        }
                    ],
                    business_images: [
                        {
                            required: true,
                            message: "请上传至少一张商品图片",
                            validator:validatemenuimglist,
                            trigger: "blur",
                        }
                    ],
                    appraisal_image: [
                        {
                            required: true,
                            message: "请上传至少一张商品图片",
                            validator:validatemenuimglist,
                            trigger: "blur",
                        }
                    ],
                    // business_name: [
                    //     {
                    //         required: true,
                    //         message: "商家信息有误",
                    //         trigger: "blur",
                    //     }
                    // ],
                },
                formData:formJson,
                businessArr:{},
                loading:false,
                business_query:{
                    type:"my",
                    name: "",
                    state:'1',
                    verify_if:'1',
                    page: 1,
                    size: 9999
                },
                dialogImageUrl:'',
                dialogVisible:false,
                monitor_imagechanger:true,
                business_namechanger:false,
                menuimagelist:[],
                certificateimagelist:[],
                business:[],
                input:[],
                imgjson:[],
                businessimg:[],
                business_id:"",
            }
    },
        methods:{
            returnlist(){
                this.getdetails()
                 this.$message({
                    message: '重置成功',
                    type: 'success'
                });
            },
            businesslist(){
                //商家列表
                enterpriseList(this.business_query)
                     .then(response => {
                         this.loading = false;
                         this.businessArr = response.data.list || [];
                         //this.total = response.data.total || 0;
                     })
                     .catch(() => {
                         this.loading = false;
                         this.list = [];
                         //this.total = 0;
                     });
            },
            onSubmit(){
                this.business['business_img']['business_img_contentjson'] = this.input
                business_update({business:this.business})
                .then(response => {
                    var data = response.data
                    if(data.inster1 != "无需要更新的值" && data.inster2 != "无需要更新的值" && data.inster3 != "无需要更新的值"){
                        if(data.key != 0 || data.key == "无需要更新的值"){
                            this.$message({
                                message: '更改成功，内容将递交管理员进行审核',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: '更改成功',
                                type: 'success'
                            });
                        }
                        window.location.reload()
                    }else if(data.inster1 == "无需要更新的值" && data.inster2 == "无需要更新的值" && data.inster3 == "无需要更新的值"){
                        this.$message({
                            message: '无需更新，请修改内容后重试',
                            type: 'warning'
                        });
                    }else{
                        this.$message({
                            message: '内容更改成功',
                            type: 'success'
                        });
                    }

                })
                .catch(() => {

                });
            },
            getdetails(){
                this.loading = true;
                business_Find({business_id:this.business_id})
                    .then(response => {
                        console.log(response)
                        this.business = response.data || 0
                        this.input = this.business['business_img']['business_img_contentjson']
                    })
                    .catch(() => {
                    });
            },
            onselectbusiness(e){
                //选择商家
                if(!e){return;}
                let obj = {};
                obj = this.businessArr.find(item => {
                    //这里的operateOption就是上面遍历的数据源
                    return item.id === e; //筛选出匹配数据
                });
                this.formData.business_name = obj.business_name;
                this.formData.business_id = obj.id;

            },
            handleBefore(file){
                const isIMG = file.type;
                const isLtBM = file.size / 1024 / 1024 < 2;
                const file_acctype = ['image/png','image/jpeg'];
                if (file_acctype.indexOf(isIMG)==-1) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                    return false;
                }
                if (!isLtBM) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false;
                }
                return isIMG && isLtBM;
            },
            handleSuccess(response, file, fileList) {
                if (response.code!=200) {
                    this.$message({
                        message: response.message,
                        type: "error"
                    });
                    return;
                }
                this.$forceUpdate();
                switch(response.data.type){
                    case 'list':
                        //商家轮播图
                        this.$refs.upload1.clearFiles();
                        this.menuimagelist.push(response.data.key);
                        if(this.business.business_images==null){this.business.business_images =[];}
                        this.business.business_images.push(IMG_BASE_URL+response.data.key);
                        if(this.business.business_images.length == 6){
                            this.businessimg = false
                        }
                        break;
                    case 'appraisal':
                        //商家证书
                        // this.formData.monitor_image[0] = IMG_BASE_URL+response.data.key;
                        // this.monitor_imagechanger = false;
                        this.$refs.upload2.clearFiles();
                        this.business.business_appraisal.appraisal_image.push(IMG_BASE_URL+response.data.key);
                        if(this.business.business_appraisal.appraisal_image.length == 6){
                            this.monitor_imagechanger = false
                        }
                        break;
                    case 'business_image_injson':
                        //商家图集-图文
                        this.$refs.upload3.clearFiles();
                        // typeof(this.business.business_img.business_image_injson)=='undefined' || 必要时添加
                        if(this.business.business_img.business_image_injson==null){this.business.business_img.business_image_injson = [];}
                        this.business.business_img.business_image_injson.push(IMG_BASE_URL+response.data.key);

                        if(this.input) this.input.push("-");
                        else{
                            this.input = [];
                            this.input[0] = "-";
                        }
                        if(this.input.length == 6){
                            this.imgjson = false
                        }
                        break;
                    default:
                        break;
                }

            },
            handleRemove(file, fileList) {
                this.menuimagelist.forEach((item,index)=>{
                    if(item.indexOf(file.response.data.key)!=-1){
                        this.menuimagelist.splice(index,1);
                    }
                });
            },
            handleRemoveMonitor(file, fileList){
                this.formData.monitor_image.forEach((item,index)=>{
                    if(item.indexOf(file.response.data.key)!=-1){
                        this.formData.monitor_image.splice(index,1);
                    }
                });
                this.$forceUpdate();
            },
            handleRemoveCertificate(file, fileList){
                this.certificateimagelist.forEach((item,index)=>{
                    if(item.indexOf(file.response.data.key)!=-1){
                        this.certificateimagelist.splice(index,1);
                    }
                });
            },
            handlePicturedel(file,type,indexx){
                //编辑删除图片
                this.$confirm('确认删除该图片,删除后不可恢复?')
                    .then(_ => {
                        switch(type){
                            case 'one':
                                var index = this.business.business_images.indexOf(file);
                                this.business.business_images.splice(index,1);
                                if(this.business.business_images.length<6){
                                    this.imgjson = true;
                                }
                                break;
                            case 'two':
                                var index = this.business.business_appraisal.appraisal_image.indexOf(file);
                                this.business.business_appraisal.appraisal_image.splice(index,1);
                                this.monitor_imagechanger = true;
                                break;
                            case 'tre':
                                var index = this.business.business_img.business_image_injson.indexOf(file);
                                this.business.business_img.business_image_injson.splice(index,1);
                                this.input.splice(indexx,1);
                                if(this.input.length<6){
                                    this.imgjson = true;
                                }
                                break;
                            default:
                                break;
                        }
                        this.$forceUpdate();
                        done();
                    })
                    .catch(_ => {});

            },
            handlePictureCardPreview(file,is_url=false) {
                if(is_url){
                    this.dialogImageUrl = file;
                }else{
                    this.dialogImageUrl = file.url;
                }
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){

            },
            clearForm(){
                this.formData = {
                    id:'',
                    menu_images_json:'',
                    monitor_image:[],
                    menu_weightt: '',
                    quality_time: '',
                    // menu_weightt:'1',
                };
            },
        },
        filters:{
            formFilterType(status) {
                const statusMap = {
                    'add': "primary",
                    'edit': "success"
                };
                return statusMap[status];
            },
            formFilterName(status) {
                const statusMap = {
                    'add': "更 改",
                    'edit': "修改"
                };
                return statusMap[status];
            }
        },
        watch:{
         $route(to,from){
             if(to.path=="/menu/add"){
                 //初始化数据
                 this.formData = formJson;
                 this.formData.id = '';
                 this.formData. menu_weightt = '';
                 this.menuimagelist = [];
                 this.formMap.type = "add";
                 this.monitor_imagechanger = true;
                 this.formData.business_name = "";
                 this.business_namechanger = false;
                 this.$refs.form.resetFields();
             }

           //from 对象中包含当前地址
           //to 对象中包含目标地址
           //其实还有一个next参数的，这个参数是控制路由是否跳转的，如果没写，可以不用写next()来代表允许路由跳转，如果写了就必须写next(),否则路由是不会生效的。
         }
        },
        mounted() {
        //
        },
        created() {
            if(this.$route.params.business_id){
                this.business_id = this.$route.params.business_id;
            }else{
                this.business_id = this.$store.state.admin.business_notice;
            }
            // this.businesslist();
            this.getdetails();
        },

};

</script>

<style lang="less">
    .MenuCarousel,.MenuMonitor{display: inline-block;}
    .menu-span{color: #000000;}
    .business_image_injson{
       .el-upload-list__item-status-label i{margin-top: 0px !important;}
       .el-upload-list__item{overflow: visible !important;}
    }

</style>
