<template>
    <div>
        <el-form ref="form" :model="formData" label-width="120px" :rules="formRules">
          <el-form-item label="商品名称" prop="menu_name">
            <el-input v-model="formData.menu_name"></el-input>
          </el-form-item>
          <el-form-item label="所属商家" v-permission="'menu/menumodify/businesslist'">
            <el-select v-model="formData.business_id" placeholder="请选择商家">
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
            <el-input v-model="formData.menu_money"></el-input>
          </el-form-item>
          <el-form-item label="生产源地" prop="menu_address">
            <el-input v-model="formData.menu_address"></el-input>
          </el-form-item>
          <el-form-item label="商品规格" prop="menu_weight">
            <el-input v-model="formData.menu_weight"></el-input>
          </el-form-item>
          <el-form-item label="生产日期" prop="production_time">
             <el-date-picker
               v-model="formData.production_time"
               type="datetime"
               placeholder="选择日期时间"
               default-time="12:00:00">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="保质日期" prop="quality_time">
              <el-date-picker
                v-model="formData.quality_time"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="购买链接" prop="menu_url">
              <el-input v-model="formData.menu_url"></el-input>
            </el-form-item>
            <!-- 商品轮播图 -->
            <el-form-item label="商品轮播图" prop="">
            <el-upload
            :limit="6"
            :action="uploadUrl"
            list-type="picture-card"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
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
    import { BASE_URL,IMG_BASE_URL } from "../../config/app";
    import time from "@/utils/utils.filter.js"
    const formJson = {
        id:'',
        menu_images_json:'',
    };
    export default {
        data() {
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
                    ]
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
                menuimagelist:[],


            }
    },
        methods:{
            returnlist(){
                //返回商品列表
                this.$router.push('menulist');
            },
            businesslist(){
                //商家列表
                enterpriseList(this.business_query)
                     .then(response => {
                         console.log(response);
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
                        }
                    })
                    .catch(() =>{

                    });
            },
            onSubmit(){
                //提交表单
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let data = Object.assign({}, this.formData);
                        if(this.formMap.type=='add'){
                            //时间处理
                            data.production_time = time.formatDateTime(data.production_time);
                            data.quality_time = time.formatDateTime(data.quality_time);
                            //图片处理
                            if(this.menuimagelist){
                                this.menuimagelist.forEach((item,index)=>{
                                    this.menuimagelist[index] = IMG_BASE_URL+item;
                                })
                                data.menu_images_json = JSON.stringify(this.menuimagelist);
                            }
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

                                })
                                .catch(() => {
                                    this.formLoading = false;
                                });

                        }
                        if(this.formMap.type=='edit'){
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
            handleSuccess(response, file, fileList) {
                if (response.code!=200) {
                    this.$message({
                        message: response.message,
                        type: "error"
                    });
                    return;
                }
                this.menuimagelist.push(response.data.key);

            },
            handleRemove(file, fileList) {
                this.menuimagelist.forEach((item,index)=>{
                    if(item.indexOf(file.response.data.key)){
                        this.menuimagelist.splice(index,1);
                    }
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleExceed(files, fileList){

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
        mounted() {
        //
        },
        created() {
            if(this.$route.query.menuid){
                //修改
                document.title = "修改商品 - "+document.title;
                this.formData.id = this.$route.query.menuid;
                this.formMap.type = "edit";
                this.details();
            }else{
                //添加
                this.businesslist();
            }
        },
        destroyed(){
            document.title = "溯源码平台后台管理";
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
