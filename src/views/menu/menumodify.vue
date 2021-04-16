<template>
    <div>
        <el-form ref="form" :model="formData" label-width="120px" :rules="formRules">
          <el-form-item label="商品名称" prop="menu_name">
            <el-col :span="12">
                <el-input v-model="formData.menu_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item  prop="business_name" label="所属商家" v-permission="menu/menumodify/businesslist">
            <el-select @change="onselectbusiness" v-model="formData.business_name" :disabled="business_namechanger" placeholder="请选择商家">
               <el-option
                   v-for="item in businessArr"
                   :key="item.id"
                   :label="item.business_name"
                   :value="item.id">
                 </el-option>
            </el-select>
          </el-form-item>

<!--          <el-form-item label="商品分类">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="商品售价" prop="menu_money">
              <el-col :span="12">
                <el-col :span="8">
                    <el-input v-model="formData.menu_money"></el-input>
                </el-col>
                <el-col :span="1">
                     <span class="menu-span">&nbsp;元</span>
                </el-col>
              </el-col>
          </el-form-item>
          <el-form-item label="生产源地" prop="menu_address">
              <el-col :span="12">
                <el-input v-model="formData.menu_address"></el-input>
              </el-col>
          </el-form-item>

          <el-form-item label="商品规格" prop="">

              <el-row>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <el-input v-model="menu_weightt" @input="change($event)"></el-input>
                </div></el-col>

                <el-col :span="11"><div class="grid-content bg-purple-light">
                    <el-select v-model="formData.menu_weight" placeholder="请选择">
                        <el-option
                            v-for="item in optionsweight"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </div></el-col>
              </el-row>

          </el-form-item>


          <el-form-item label="生产日期" prop="production_time">
             <el-date-picker
               v-model="formData.production_time"
               type="datetime"
               placeholder="选择日期时间"
               default-time="12:00:00">
             </el-date-picker>
           </el-form-item>
           <!-- <el-form-item label="保质日期" prop="quality_time">
              <el-date-picker
                v-model="formData.quality_time"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item> -->
            <el-form-item label="保质日期" prop="quality_time">
              <el-row>
                <el-col :span="8"><div class="grid-content bg-purple">
                    <el-input v-model="quality_timee"></el-input>
                </div></el-col>
                <el-col :span="11"><div class="grid-content bg-purple-light">
                    <el-select v-model="formData.quality_time" placeholder="请选择">
                        <el-option
                            v-for="item in optionstime"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </div></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="购买链接" prop="menu_url">
                <el-col :span="12">
                    <el-input v-model="formData.menu_url"></el-input>
                </el-col>
            </el-form-item>
            <!-- 商品轮播图 -->
            <el-form-item label="商品轮播图" prop="menu_images_json">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card">

                <li class="el-upload-list__item is-success" v-for="fit in formData.menu_images_json" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!---->

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'menu_images_json')" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            class="MenuCarousel"
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
            <!-- 商品检测报告 -->
            <el-form-item label="检测报告" prop="menu_monitor">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card">

                <li class="el-upload-list__item is-success" v-for="fit in formData.monitor_image" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!---->

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'menu_monitor')" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            v-if="monitor_imagechanger"
            class="MenuMonitor"
            :limit="1"
            :action="uploadUrl"
            list-type="picture-card"
            :data="{type:'menumonitor'}"
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

            <!-- 商品证书 -->
            <el-form-item label="商品证书" prop="certificate_image">
            <!-- 编辑回显 -->
            <ul class="el-upload-list el-upload-list--picture-card">

                <li class="el-upload-list__item is-success" v-for="fit in formData.certificate_image" :key="fit">
                    <img :src="fit" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!---->

                <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(fit,true)" class="el-icon-zoom-in"></i></span>
                <span class="el-upload-list__item-delete"><i @click="handlePicturedel(fit,'certificate_image')" class="el-icon-delete"></i></span></span>
                </li>

            </ul>
            <el-upload
            class="MenuMonitor"
            :limit="9"
            :action="uploadUrl"
            list-type="picture-card"
            :data="{type:'certificate'}"
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

          <el-form-item>
            <el-button :type="formMap.type | formFilterType" @click="onSubmit">{{formMap.type | formFilterName}}</el-button>
            <el-button type="info" plain @click="returnlist">取消</el-button>
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
    import { business_Find } from "@/api/business/business.js"
    const initial = {
        id:'',
        menu_images_json:'',
        monitor_image:[],
        menu_weightt: '',
        quality_time: '',
        // menu_weight:'1',
    };
    const formJson = {
        id:'',
        menu_images_json:'',
        monitor_image:[],
        menu_weightt: '',
        quality_time: '',
        // menu_weight:'1',
    };
    export default {
        data() {
            var validatemenuimglist = (rule, value, callback) =>{
                if(this.formMap.type == "add"){
                    if(this.formData.menu_images_json.length==0){
                         callback(new Error('请上传至少一张商品图片.'));
                    }
                    if(this.formData.monitor_image.length==0){
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
                    add: "新 增",
                    edit: "编 辑",
                    type: "add",
                },
                menu_info:{},
                formRules: {
                    menu_name: [
                        {
                            required: true,
                            message: "请输入商品名称",
                            trigger: "blur"
                        }
                    ],
                    menu_money: [
                        {
                            required: true,
                            //message: "请输入正确商品售价",
                            trigger: "blur",
                            validator:checkMoney
                            // type:"number",
                        }
                    ],
                    // menu_weight: [
                    //     {
                    //         required: true,
                    //         message: "请输入正确商品规格",
                    //         trigger: "blur",
                    //         // type:"number",
                    //     }
                    // ],
                    production_time: [
                        {
                            required: true,
                            message: "请输入商品生产日期",
                            trigger: "blur"
                        }
                    ],
                    // quality_time: [
                    //     {
                    //         required: true,
                    //         message: "请输入商品保质日期",
                    //         trigger: "blur"
                    //     }
                    // ],
                    menu_images_json: [
                        {
                            required: true,
                            //message: "请上传至少一张商品图片",
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
                quality_timee:"",
                menu_weightt:"",
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
                optionsweight:[
                    {
                        value: '1',
                        label: '个'
                    },
                    {
                        value: '2',
                        label: '箱'
                    },
                    {
                        value: '3',
                        label: 'L/升'
                    },
                    {
                        value: '4',
                        label: 'ML/毫升'
                    },
                    {
                        value: '5',
                        label: 'G/克'
                    },
                    {
                        value: '6',
                        label: 'KG/千克'
                    },
                    {
                        value: '7',
                        label: '斤'
                    },
                    {
                        value: '8',
                        label: '公斤'
                    },

                ],
                optionstime:[
                    {
                        value: '1',
                        label: '年'
                    },
                    {
                        value: '2',
                        label: '月'
                    },
                    {
                        value: '3',
                        label: '日'
                    },
                    {
                        value: '4',
                        label: '季度'
                    }
                ]


            }
    },
        methods:{
            change(val){
                this.formData.menu_weightt = val;
            },
            returnlist(){
                //返回商品列表
                //先清空
                this.$refs.form.resetFields();
                this.$router.push('menulist');
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
            details(){
                //详情接口
                menudetails({id:this.formData.id})
                    .then(response => {
                        console.log(response);
                        if(response.data){
                            this.formData = response.data;
                            try{
                                if(this.formData.monitor_menu.monitor_image){
                                    if(this.formData.monitor_menu.monitor_image.length!=0){
                                        this.formData.monitor_image = this.formData.monitor_menu.monitor_image;
                                        this.monitor_imagechanger = false;
                                    }else{
                                        this.formData.monitor_image = [];
                                    }
                                }

                                if(this.formData.certificate_menu.certificate_image){
                                    if(this.formData.certificate_menu.certificate_image.length!=0){
                                        this.formData.certificate_image = this.formData.certificate_menu.certificate_image;
                                    }else{
                                        this.formData.certificate_image = [];
                                    }
                                }
                                  //待优化循环 start
                                if(this.formData.menu_weight){
                                    this.optionsweight.forEach((item,index)=>{
                                        if(this.formData.menu_weight.indexOf(item.label)!=-1){
                                            const tmp_weight = this.formData.menu_weight;
                                            this.formData.menu_weight = item.label;
                                            //this.formData.menu_weightt = tmp_weight.replace(item.label,"");
                                            this.menu_weightt = tmp_weight.replace(item.label,"");
                                        }
                                    })
                                }
                                if(this.formData.quality_time){
                                    //待优化循环
                                    this.optionstime.forEach((item,index)=>{
                                        if(this.formData.quality_time.indexOf(item.label)!=-1){
                                            const tmp_quality_time = this.formData.quality_time;
                                            this.formData.quality_time = item.label;
                                            // this.formData.quality_timee = tmp_quality_time.replace(item.label,"");
                                            this.quality_timee = tmp_quality_time.replace(item.label,"");
                                        }
                                    })
                                }
                                console.log(this.formData)
                                //end
                            }catch(e){}

                            // console.log(this.formData.)
                            if(this.formData.business_name){
                                this.business_namechanger = true;
                            }
                        }
                    })
                    .catch(() =>{

                    });
            },
            onSubmit(){
                //提交表单
                // console.log(window.localStorage)
                // this.formData.business_name =
                // this.formData.userid = formJson
                // business_Find({business_id : this.$store.adminId})
                // .then(response => {
                //     // console.log(response.data)
                //     this.formData.business_id = response.data['id']
                // })
                // .catch(() => {
                // });

                if(this.$store.state.admin.business_notice){this.formData.business_id = this.$store.state.admin.business_notice;}
                // this.formData.menu_weight = this.formData.menu_weightt+this.formData.menu_weight;
                // this.formData.quality_time = this.formData.quality_timee+this.formData.quality_time;
                this.formData.menu_weight_copy = this.menu_weightt+this.formData.menu_weight;
                this.formData.quality_time_copy = this.quality_timee+this.formData.quality_time;
                this.$refs["form"].validate(valid => {
                    console.log(valid)
                    if (valid) {
                        let data = Object.assign({}, this.formData);
                        // console.log(data);
                        if(this.formMap.type=='add'){
                            this.formData.id = "";
                            data.id = "";
                            //时间处理
                            data.production_time = time.formatDateTime(data.production_time);
                            // data.quality_time = time.formatDateTime(data.quality_time);
                            //图片处理
                            if(this.menuimagelist){
                                this.menuimagelist.forEach((item,index)=>{
                                    this.menuimagelist[index] = IMG_BASE_URL+item;
                                })
                                data.menu_images_json = JSON.stringify(this.menuimagelist);
                            }
                            if(this.certificateimagelist){
                                this.certificateimagelist.forEach((item,index)=>{
                                    this.certificateimagelist[index] = IMG_BASE_URL+item;
                                })
                                data.certificate_menu = JSON.stringify(this.certificateimagelist);
                            }
                            //检测报告
                            // console.log(data)
                            if(data.monitor_image){data.monitor_image = JSON.stringify(data.monitor_image);}
                            // data.business_id = this.formData.business_id
                            menuadd(data)
                                .then(response => {
                                    this.formLoading = false;
                                    if (response.code!=200) {
                                        this.$message.error(response.message);
                                        return false;
                                    }
                                    this.$message.success("操作成功");
                                    this.formVisible = false;
                                    this.returnlist();
                                    this.formData = formJson
                                    this.formData.quality_timee = ''
                                    this.formData.monitor_image = ''
                                })
                                .catch(() => {
                                    this.formLoading = false;
                                });
                        }
                        if(this.formMap.type=='edit'){
                            //处理数据
                            if(typeof(data.production_time)=='object'){data.production_time = time.formatDateTime(data.production_time);}
                            // if(typeof(data.quality_time)=='object'){data.quality_time = time.formatDateTime(data.quality_time);}
                            //检测报告
                            let menuimagearr = [];
                            if(this.menuimagelist){
                                this.menuimagelist.forEach((item,index)=>{
                                    this.menuimagelist[index] = IMG_BASE_URL+item;
                                    menuimagearr.push(this.menuimagelist[index])
                                })
                            }
                            if(typeof(data.menu_images_json)=='object'){
                                data.menu_images_json.forEach((item,index)=>{
                                    menuimagearr.push(item);
                                });

                                }
                            if(menuimagearr){menuimagearr = JSON.stringify(menuimagearr);}
                            data.menu_images_json = menuimagearr;
                            //证书
                            let certificateimagearr = [];
                            if(this.certificateimagelist){
                                this.certificateimagelist.forEach((item,index)=>{
                                    this.certificateimagelist[index] = IMG_BASE_URL+item;
                                    certificateimagearr.push(this.certificateimagelist[index])
                                })
                            }
                            if(typeof(data.certificate_image)=='object'){
                                data.certificate_image.forEach((item,index)=>{
                                    certificateimagearr.push(item);
                                });
                            }
                            if(certificateimagearr){certificateimagearr = JSON.stringify(certificateimagearr);}
                            data.certificate_image = certificateimagearr;

                            menuedit(data)
                                .then(response => {
                                    this.formLoading = false;
                                    if (response.code!=200) {
                                        this.$message.error(response.message);
                                        return false;
                                    }
                                    this.$message.success("操作成功");
                                    this.formVisible = false;
                                    this.returnlist();
                                })
                                .catch(() => {
                                    this.formLoading = false;
                                });
                        }
                        //this.formLoading = true;


                    }
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
                console.log(obj)
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
                switch(response.data.type){
                    case 'list':
                        this.menuimagelist.push(response.data.key);
                        break;
                    case 'menumonitor':
                        this.formData.monitor_image[0] = IMG_BASE_URL+response.data.key;
                        this.monitor_imagechanger = false;
                        break;
                    case 'certificate':
                        this.certificateimagelist.push(response.data.key);
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
            handlePicturedel(file,type){
                //编辑删除图片
                this.$confirm('确认删除该图片,删除后不可恢复?')
                    .then(_ => {
                        switch(type){
                            case 'menu_images_json':
                                var index = this.formData.menu_images_json.indexOf(file);
                                this.formData.menu_images_json.splice(index,1);
                                break;
                            case 'menu_monitor':
                                var index = this.formData.monitor_image.indexOf(file);
                                this.formData.monitor_image.splice(index,1);
                                this.monitor_imagechanger = true;
                                break;
                            case 'certificate_image':
                                var index = this.formData.certificate_image.indexOf(file);
                                this.formData.certificate_image.splice(index,1);
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
                this.menu_weightt = "";
                this.quality_timee = "";
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
                    'add': "新增",
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
            this.businesslist();
            if(this.$route.query.menuid){
                //修改
                document.title = "修改商品 - "+document.title;
                this.formData.id = this.$route.query.menuid;
                this.formMap.type = "edit";
                this.details();

            }else{
                this.business_namechanger = false;
                this.clearForm();
                //添加
            }
        },
        destroyed(){
            this.clearForm();
            document.title = "溯源码平台后台管理";
        }
};

</script>

<style type="text/scss" lang="scss">
    .MenuCarousel,.MenuMonitor{display: inline-block;}
    .menu-span{color: #000000;}
</style>
