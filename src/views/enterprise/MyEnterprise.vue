<template>
    <div>
        <!-- start search -->
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.name" placeholder="企业名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                 <!--   <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button> -->
                </el-button-group>
            </el-form-item>
        </el-form>
        <!-- end search -->
        <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;">
            <el-table-column
                label="ID"
                type="index"
                fixed>
            </el-table-column>
            <el-table-column
                label="企业ID"
                prop="id"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="企业名称"
                prop="business_name"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="法定代表人"
                prop="responsible_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="用户名">
                <template slot-scope="scope">
                    {{scope.row.boss_user|bossFiltersName}}
                </template>
            </el-table-column>
            <el-table-column
                label="联系电话"
                prop="responsible_phone"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.state | statusFilterType">{{scope.row.state | statusFilterName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                width="300"
                label="操作"
                fixed="right">
                <template slot-scope="scope">

                   <!-- <el-button  class="g-success" size="small" @click.native="handleDel(scope.$index, scope.row)">删 除</el-button> -->
<!--                    <el-dropdown @command="handleverif" class="g-left-d10">
                    <el-button size="small" type="primary" class="g-success" >
                        审 核<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">通 过</el-dropdown-item>
                        <el-dropdown-item command="2">拒 绝</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown> -->

                    <el-button type="warning" size="small" @click.native="handleForm(scope.$index, scope.row)">查 看</el-button>
                    <el-button type="primary" size="small" @click.native="handleFormemployee(scope.row.id)">员 工</el-button>
                    <el-button :type="scope.row.state | statusFilterType_handle" size="small" @click.native="handleFormstatus(scope.$index, scope.row)">{{scope.row.state | statusFilterName_handle}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.size"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>

        <!-- 查看详情表单 -->
        <el-dialog
            :title="formMap[formName]"
            :visible.sync="formVisibledetails"
            :before-close="hideFormdetails"
            width="85%"
            top="5vh">

            <el-form label-position="right" label-width="120px" :model="formData" :rules="formRules" ref="dataForm">
                <el-row>
                  <el-col :span="1"><div class="grid-content bg-purple">&nbsp;</div></el-col>
                  <!-- 左边 -->
                  <el-col :span="10"><div class="grid-content bg-purple">
                   <!-- 商户信息 -->

                    <el-form-item label="商户名称:" prop="business_name">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{formData.business_name||"暂无"}}
                    </el-form-item>
                    <el-form-item label="商户地址" prop="business_address">
                 <!--       <el-input v-model="formData.business_address" auto-complete="off"></el-input> -->
                        {{formData.business_address}}
                    </el-form-item>
                    <!-- <el-form-item label="商家姓名:" prop="responsible_name"> -->
                   <!--     <el-input v-model="formData.responsible_name" auto-complete="off"></el-input> -->
                    <!-- {{formData.responsible_name||"暂无"}}
                    </el-form-item> -->
                    <el-form-item label="法定代表人:" prop="responsible_name">
                         <!-- <el-input v-model="formData.responsible_name" auto-complete="off"></el-input> -->
                         {{formData.responsible_name||"暂无"}}
                     </el-form-item>
                    <el-form-item label="联系电话:" prop="mobile">
                   <!--     <el-input v-model="formData.mobile" auto-complete="off"></el-input> -->
                    {{formData.responsible_phone||"暂无"}}
                    </el-form-item>
                    <!-- 用户信息 -->
                    <!-- <el-form-item label="用户ID:" prop="user_id"> -->
                    <!--    <el-input v-model="formData.user_id" auto-complete="off"></el-input> -->
                        <!-- {{formData.user_id||"暂无"}} -->
                    <!-- </el-form-item> -->
                    <!-- <el-form-item label="用户名:" prop="username"> -->
                  <!--      <el-input v-model="formData.username" auto-complete="off"></el-input> -->
                    <!-- {{formData.username||"暂无"}} -->
                    <!-- </el-form-item> -->
                    <el-form-item label="入驻时间:" prop="create_time">
                   <!--     <el-input v-model="formData.create_time" auto-complete="off"></el-input> -->
                    {{formData.create_time||"暂无"}}
                    </el-form-item>

                    <el-form-item label="状态" prop="state">
                         <el-radio-group v-model="formData.state">
                             <el-radio :label="'1'">正常</el-radio>
                             <el-radio :label="'2'">冻结</el-radio>
                         </el-radio-group>
                     </el-form-item>

                  </div></el-col>
                    <el-col :span="1"><div class="grid-content bg-purple">&nbsp;</div></el-col>
                  <!-- 右边 -->
                  <el-col :span="10"><div class="grid-content bg-purple-light">
                        <el-form-item label="" prop="pic" class="enterprise_logo">
                            <span>商户证书(<span style="color : red;">点击图片查看</span>)</span>
                            <swiper  class="swiper swiper-cer" ref="mySwiper" :options="swiperOption">
                             <swiper-slide  v-for="(img,index) in formData.business_images" :key="index">
                                    <!-- 测试 -->
<!--                                <swiper-slide  v-for="(img,index) in swiperImglist" :key="index"> -->
                                  <img  @click="handlePictureCardPreview(img)" style="cursor:pointer" class="swiperimg" :src="img" />
                              </swiper-slide>
                              <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
                            </swiper>
                        </el-form-item>

                        <el-row>
                          <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
                        </el-row>

                        <el-form-item label="" prop="pic">
                            <span>商户证书(<span style="color : red;">点击图片查看</span>)</span>
                            <swiper  class="swiper swiper-cer" ref="mySwiper" :options="swiperOption">
                             <swiper-slide  v-for="(img,index) in formData.business_appraisal" :key="index">
                                    <!-- 测试 -->
<!--                                <swiper-slide  v-for="(img,index) in swiperImglist" :key="index"> -->
                                  <img  @click="handlePictureCardPreview(img)" style="cursor:pointer" class="swiperimg" :src="img" />
                              </swiper-slide>
                              <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
                            </swiper>
                        </el-form-item>

<!--                        <el-form-item label="营业执照" prop="pic">
                            <div>
                                <el-input size="small" v-model="formData.pic" auto-complete="off" placeholder="图片路径"></el-input>
                                <upload ext="jpg,png,jpeg" :size="716800"  @on-select="onSelectPic"></upload>
                            </div>
                            <div class="upload-img" v-if="formData.pic_url">
                                <img :src="formData.pic_url" style="max-width: 200px;max-height: 200px;">
                            </div>
                        </el-form-item> -->

                     <!--   <el-form-item label="信用代码:" prop="business_code"> -->
                            <!-- <el-input v-model="formData.business_code" auto-complete="off"></el-input> -->
                    <!--        {{formData.business_code||"暂无"}}
                        </el-form-item> -->
                  </div></el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
<!--                <el-dropdown @command="handleverif" class="g-left-d10">
                <el-button type="primary" class="g-success" >
                    审 核<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">通 过</el-dropdown-item>
                    <el-dropdown-item command="2">拒 绝</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown> -->
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">保 存</el-button>
                <el-button @click.native="hideFormdetails">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 审核拒绝表单 -->
        <el-dialog title="审核不通过" :visible.sync="dialogFormVisibleverif">
            <el-form :model="formverif">
            <el-form-item label="原因:" :label-width="formLabelverifWidth">
                <el-input v-model="formverif.content" autocomplete="off"></el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleverif = false">取 消</el-button>
            <el-button type="primary" @click="onSubmitverif">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看图片弹窗 -->
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import {enterpriseList,employeestate} from "@/api/enterprise/enterprise";
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

const formJson = {
    appraisal_image: '',
    business_name: '',
    company_id:'',
    id:'',
    mobile:'',
    responsible_name:'',
    state:'',
    user_id:'',
    username:'',
};
export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    directives: {
      swiper: directive
    },
    data() {
        return {
            swiperImglist:["http://sy.zsicp.com/static/images/bg1.jpg","http://sy.zsicp.com/static/images/bg2.jpg","http://sy.zsicp.com/static/images/bg3.jpg"],
            formMap: {
                add: "新 增",
                edit: "编 辑"
            },
            formVisibledetails:false,
            formData: formJson,
            query: {
                type:"my",
                name: "",
                state:'1',
                verify_if:'1',
                page: 1,
                size: 10
            },
            loading: true,
            list:[],
            total:0,
            dialogFormVisibleverif:false,
            formverif:{},
            formLabelverifWidth:'120px',
            formName:null,
            company_imgstyle:"{width: 100px; height: 100px;}",
            formLoading:false,
            formRules:{},
            fit:"contain",
            swiperOption:{
                autoHeight: true,
                height:300,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet(index, className) {
                        return `<span class="${className} swiper-pagination-bullet-custom">${index + 1}</span>`
                    }
                }

            },
            dialogImageUrl:"",
            dialogVisible:false

        }
    },
    methods:{
    //方法

        // 显示表单
        handleForm(index, row) {
            // console.log(row)
            this.formVisibledetails = true;
            // 刷新表单
            this.resetForm();
            this.formData = JSON.parse(JSON.stringify(formJson));
            if (row !== null) {
                this.formData = Object.assign({}, row);
            }
            // 处理图片数据
            if(this.formData.business_images){
                this.formData.business_images = JSON.parse(this.formData.business_images);
            }else{this.formData.business_images = [];}

            if(this.formData.business_appraisal){
                this.formData.business_appraisal = JSON.parse(this.formData.business_appraisal[0].appraisal_image);
            }else{this.formData.business_appraisal = [];}

            this.formName = "add";
            if (index !== null) {
                this.index = index;
                this.formName = "edit";
            }
            console.log(this.formData)
        },
        handleFormstatus(index,row){
            if(row.state==1){
              this.$confirm('此操作将禁用商家及相关可使用功能,是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var state = 2;
                //提交
                employeestate({id:row.id,state:state})
                    .then(response=>{
                        if(response.code!=200){
                            this.$message.error("操作失败");
                            return false;
                        }
                        this.list[index].state = state;
                        this.$message({
                                  showClose: true,
                                  message: '操作成功',
                                  type: 'success'
                                });
                    })
                    .catch(()=>{
                        this.$message.error("操作失败");
    
                    });
                
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消操作'
                });
                return;
              });      
              
            }else{
              var state = 1;
              //提交
              employeestate({id:row.id,state:state})
                  .then(response=>{
                      if(response.code!=200){
                          this.$message.error("操作失败");
                          return false;
                      }
                      this.list[index].state = state;
                      this.$message({
                                showClose: true,
                                message: '操作成功',
                                type: 'success'
                              });
                  })
                  .catch(()=>{
                      this.$message.error("操作失败");
    
                  });
            }
        },
        //员工
        handleFormemployee(employee_id){
            this.$router.push({
                name:'员工管理',
                params:{
                    employee_id:employee_id,
                }
            });
        },
        // 刷新表单
        resetForm() {
            if (this.$refs["dataForm"]) {
                // 清空字段
                this.$refs["dataForm"].resetFields();
                // 清空验证信息表单
                this.$refs["dataForm"].clearValidate();
            }
        },
        onReset() {
            this.$router.push({
                path: ""
            });
            this.query = {
                title: "",
                page: 1,
                size: 10
            };
            this.getList();
        },
        getList(){
           this.loading = false;
           enterpriseList(this.query)
                .then(response => {
                    console.log(response);
                    this.loading = false;
                    this.list = response.data.list || [];
                    this.total = response.data.total || 0;
                })
                .catch(() => {
                    this.loading = false;
                    this.list = [];
                    this.total = 0;
                });
        },
        onSubmit(){
        //查询
            this.$router.push({
                path: "",
                query: this.query
            });
            this.getList();
        },
        handleCurrentChange(val) {

           this.query.page = val;
           this.getList();
        },
        handleverif(command){
            if(command=='1'){
            //接受

            }
            if(command=='2'){
            //拒绝
            this.dialogFormVisibleverif = true;

            }
       },
        onSubmitverif(){
           //审核不通过

        },
        // 隐藏表单
       hideFormdetails() {
            // 更改值
            this.formVisibledetails = !this.formVisibledetails;
            return true;
        },
        formSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.formLoading = true;
                    let data = Object.assign({}, this.formData);
                    adSave(data, this.formName)
                        .then(response => {
                            this.formLoading = false;
                            if (response.code) {
                                this.$message.error(response.message);
                                return false;
                            }
                            this.$message.success("操作成功");
                            this.formVisible = false;
                            if (this.formName === "add") {
                                // 向头部添加数据
                                data.ad_id = response.data.ad_id;
                                this.list.unshift(data);
                            } else {
                                this.list.splice(this.index, 1, data);
                            }
                        })
                        .catch(() => {
                            this.formLoading = false;
                        });
                }
            });
        },
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },

    },
    filters: {
        bossFiltersId(boss_user){
            if(boss_user==null){
                return "无";
            }
            return boss_user.id
        },
        bossFiltersName(boss_user){
            if(boss_user==null){
                return "无";
            }
            return boss_user.username;
        },
        statusFilterType(status) {
            const statusMap = {
                1: "success",
                2: "danger",
                'undefined':"无"

            };
            return statusMap[status];
        },
        statusFilterName(status) {
            const statusMap = {
                1: "正常",
                2: "禁用",
                'undefined':"无"
            };
            return statusMap[status];
        },
        //相反操作按钮
        statusFilterType_handle(status) {
            const statusMap = {
                1: "danger",
                2: "success",
                'undefined':"无"
            };
            return statusMap[status];
        },
        statusFilterName_handle(status) {
            const statusMap = {
                1: "禁用",
                2: "正常",
                'undefined':"无"
            };
            return statusMap[status];
        }
    },
    mounted() {
    //
    },
    created() {
        // 加载表格数据
        this.getList();
    }

};
</script>

<style lang="less" scoped>
    .image_p{
        position: absolute;
        text-align: left;
        width: 226px;
        top: -2.2rem;
    }
    ::v-deep.enterprise_logo{
        margin-left: 64px;
    }
    .swiper-cer{
        height: 226px;
    }
    .swiperimg{
        width: 100%;
    }
</style>
