<template>
    <div class="child1">
        <el-form :model="formData" :rules="formRules" ref="problemformData" label-position="right" label-width="80px">
            <el-row>
              <el-col :span="12"><div class="grid-content bg-purple">

                <el-form-item label="网站标题" prop="webname">
                    <el-input v-model="formData.website"></el-input>
                 </el-form-item>

                <el-form-item label="网站图标" prop="menu_monitor">
                <!-- 编辑回显 -->
                <ul class="el-upload-list el-upload-list--picture-card" v-if="formData.sitelogo">

                    <li class="el-upload-list__item is-success" :key="fit">
                        <img :src="formData.sitelogo" alt="" class="el-upload-list__item-thumbnail">
                        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>timg.jpg</a>
                        <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i>
                    </label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!---->

                    <span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i @click="handlePictureCardPreview(formData.sitelogo,true)" class="el-icon-zoom-in"></i></span>
                    <span class="el-upload-list__item-delete"><i @click="handlePicturedel(formData.sitelogo,'logoimg')" class="el-icon-delete"></i></span></span>
                    </li>

                </ul>
                <el-upload
                v-if="logoimg_changer"
                class="logoimg"
                :limit="1"
                :action="uploadUrl"
                list-type="picture-card"
                :data="{type:'websidelogo'}"
                :on-success="handleSuccess"
                :on-exceed="handleExceed"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveLogo"
                :before-upload="handleBefore">
                <i class="el-icon-plus"></i>
                </el-upload>


                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                </el-form-item>

            </div></el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary"  @click="onSubmit">提交修改</el-button>
            </el-form-item>
        </el-form>


    </div>

</template>

<script>
    import { BASE_URL,IMG_BASE_URL } from "@/config/app";
    import {system_set,setting} from "@/api/pool";
    const formJson = {
        sitelogo: "",
        website:"",
    };
    export default {
        name:'child1',
        data() {
            return {
                uploadUrl:BASE_URL + "/web/file/uploadfile",
                formData:formJson,
                formRules:{},
                fit:"cover",
                logoimg_changer:true,
                dialogVisible:false,
                dialogImageUrl:"",
                confdata:[],


            }
    },
        methods:{
            getsetting(){
                setting()
                    .then(response=>{
                        //this.confdata = response.data;
                        this.formData = response.data;
                        if(this.formData.sitelogo){
                            this.logoimg_changer = false;
                        }
                    })
                    .catch(()=>{

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
                switch(response.data.type){
                    case 'websidelogo':
                        this.formData.sitelogo = IMG_BASE_URL + response.data.key;
                        this.logoimg_changer = false;
                        // this.menuimagelist.push(response.data.key);
                        break;
                    default:
                        break;
                }

            },
            handleExceed(){

            },
            handlePictureCardPreview(file,is_url=false) {
                if(is_url){
                    this.dialogImageUrl = file;
                }else{
                    this.dialogImageUrl = file.url;
                }

                this.dialogVisible = true;
            },
            handleRemoveLogo(file,fileList){

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
            handlePicturedel(){
                this.formData.sitelogo = "";
                this.logoimg_changer = true;

            },
            onSubmit(){
                console.log(this.formData)
                system_set(this.formData)
                    .then(response=>{
                        if(response.code!=200){this.$message.error("提交失败,请稍后再试");return false;}
                        this.$message({
                                showClose: true,
                                message: '提交成功',
                                type: 'success'
                        });
                        this.getsetting();
                    })
                    .catch(()=>{

                    });
            }

        },
        filters:{},
        mounted() {
        //
        },
        created() {
            this.getsetting();

        }
};

</script>

<style type="text/scss" lang="scss">
    .logoimg{display: inline-block;}
</style>
