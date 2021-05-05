<template>
        <div id="employee">
        <!-- start search -->
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-input v-model="query.username" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-input v-model="query.business_name" placeholder="商户名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-if="employee_id" plain @click="returnPage">返回上一页</el-button>
           </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                 <!--   <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button> -->
                </el-button-group>
            </el-form-item>
            <el-form-item>
                 <el-button class="g-success" plain @click="handleAddemployee">添加员工</el-button>
            </el-form-item>
        </el-form>

        <!-- end search -->
        <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;">
            <el-table-column
                label="序号"
                type="index"
                fixed>
            </el-table-column>
            <el-table-column
                label="用户ID"
                prop="id"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="用户名称"
                prop="username"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="手机号码"
                prop="phone"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
<!--            <el-table-column
                label="商家名称"
                prop="phone"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column> -->
           <el-table-column
                 label="商户名称">
                 <template slot-scope="scope">
                    {{scope.row.business_name | businessNameFilter}}
                 </template>
             </el-table-column>
            <el-table-column
                 label="权限">
                 <template slot-scope="scope">
                     <el-tag :type="scope.row.role_id | roleFilterType">{{scope.row.role_name | roleFilterName}}</el-tag>
                 </template>
             </el-table-column>
<!--            <el-table-column
                label="权限"
                prop="roleid_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column> -->
            <el-table-column
                label="创建时间"
                prop="create_time"
                with="300"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                   <span>{{ scope.row.create_time }}</span>
                </template>
            </el-table-column>
<!--           <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilterType">{{scope.row.status | statusFilterName}}</el-tag>
                </template>
            </el-table-column> -->
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
                    </el-dropdown>
 -->
                    <!-- <el-button v-permission="'enterprise/employee/edit'" type="success" size="small" @click.native="handleForm(scope.$index, scope.row)">编 辑</el-button> -->
                    <el-button v-permission="'enterprise/employee/del'" type="danger" size="small" @click="handleFormdel(scope.row.id,scope.$index)">踢出员工</el-button>
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
            width="35%"
            top="5vh">

            <el-form label-position="left" label-width="80px" :model="formData" :rules="formRules" ref="dataForm">
                   <!-- 员工信息 -->
                   <el-col><div>
                    <el-form-item label="" prop="pic">
                      <!-- <p class="image_p"></p> -->
                       <el-image
                         style="width: 226px; height: 226px;"
                         :src="formData.user_image"
                         :fit="fit"></el-image>
                    </el-form-item></div></el-col>
                    <el-form-item label="用户ID" prop="id">
                       <el-input disabled v-model="formData.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名称" prop="username">
                        <el-input v-model="formData.username" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="formData.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="role_id">
                        <!-- <el-input v-model="formData.roleid" auto-complete="off"></el-input> -->
                         <el-select v-model="formData.role_id" placeholder="请选择">
                            <el-option
                              v-for="item in rolelist"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="所属商户" prop="business_name">
                        <el-input disabled="disabled" v-model="formData.business_name" auto-complete="off"></el-input>
                    </el-form-item>

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
        <!-- 添加员工表单 -->
        <el-dialog title="添加员工"  :visible.sync="dialogFormVisibleemployee" customClass="customWidth">
            <el-row>
              <el-col v-if="!formemployeetype" :span="24"><div class="grid-content bg-purple-dark">
                <span class="join_span">请用户打开微信扫描下方二维码进行微信绑定</span>
                <div id="shareaddqrcode"  ref="qrcodeContainer"></div>
              </div></el-col>
            </el-row>

            <el-form :model="formemployee" :rules="formRules" ref="formemployee" v-if="formemployeetype" style="margin: 0 auto;width: 70%;">
            <el-form-item label="员工手机号:" :label-width="formemployeeWidth" prop="phone">
                <el-select
                  @change="selectfindUser"
                  v-model="formemployee.phone"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入员工手机号"
                  :remote-method="(query)=>{searchemployee(query,'phone')}"
                  :loading="loading">
                  <el-option
                    v-for="item in optionsPhone"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工姓名:" :label-width="formemployeeWidth" prop="username">
                <el-select
                  @change="selectfindUser"
                  v-model="formemployee.username"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入员工姓名"
                  :remote-method="(query)=>{searchemployee(query,'name')}"
                  :loading="loading">
                  <el-option
                    v-for="item in optionsName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">

            <el-button @click="dialogFormVisibleemployee = false">取 消</el-button>
          <!--  <el-button v-if="formemployeetype" type="primary" @click="onSubmitemployee">确 定</el-button> -->
            <!-- <el-button @click="sharecodEemployee">{{tips}}</el-button> -->
            </div>
        </el-dialog>

        </div>

</template>

<script>

    import {userids,userlist,employeelist,employeedel,employeeedit} from "@/api/user/user.js";
    import {business_Find} from "@/api/business/business.js";
    import {authRoleList} from "@/api/auth/authRole.js";
    import {DOMAIN_H5_URL} from "@/config/app.js";
    import QRCode from "qrcodejs2";
    const formJson = {
        id:'',
        username:'',
        phone:'',
        role_id:'',
        business_name:'',
    };
    export default {
        data() {
            return {
                businessInfo:[],
                employee_id:'',
                formMap: {
                    add: "新 增",
                    edit: "员工信息"
                },
                formVisibledetails:false,
                formData: formJson,
                query: {
                    business_notice:"",
                    phone:"",
                    username:"",
                    business_name:"",
                    title: "",
                    page: 1,
                    size: 10,
                    role_id:'2,3',
                },
                role_query:{
                    page:1,
                    szie:99999,
                    id:'2,3'
                },
                loading: true,
                list: [],
                total:0,
                dialogFormVisibleverif:false,
                dialogFormVisibleemployee:false,
                formverif:{},
                formemployee:{
                    id:'',
                    phone:'',
                    username:'',

                },
                formemployeeWidth:'120px',
                formLabelverifWidth:'120px',
                formName:null,
                company_imgstyle:"{width: 100px; height: 100px;}",
                formLoading:false,
                roleoptions:[],
                formRules: {
                    username: [
                        {
                            required: true,
                            message: "请输入用户名",
                            trigger: "blur"
                        },
                    ],
                    phone: [
                        {
                            required: true,
                            message: "请输入手机号",
                            trigger: "blur"
                        },
                    ]
                },
                fit:"contain",
                rolelist:{},
                searchquery:{
                    phone:'',
                    username:'',
                    page:1,
                    size:9999,
                    roleid:4,
                },
                optionsPhone:[],
                optionsName:[],
                formemployeetype:false,
                tips:"二维码添加",


            }
        },
        methods:{
            selectfindUser(e){
                userids({id:e})
                    .then(response=>{
                        if(response.code!=200){this.$message.error("系统发生错误,请稍后再试");return;}
                        this.formemployee.phone = response.data.phone;
                        this.formemployee.username = response.data.username;
                        this.formemployee.id = response.data.id;
                    })
                    .catch(()=>{

                    })
            },
            searchemployee(query,type){
                if(query==''){return;}
                this.searchquery = {
                    phone:'',
                    username:'',
                    page:1,
                    size:9999,
                    roleid:4
                };
                this.formemployee = {
                    id:'',
                    phone:'',
                    username:'',
                };
                if(type=='phone'){this.searchquery.phone = query;}
                if(type=='name'){this.searchquery.username = query;};
                userlist(this.searchquery)
                    .then(response=>{
                        console.log(response);
                        if(response.code!=200){this.$message.error("系统发生错误,请稍后再试");return;}
                        if(type=='phone'){
                            this.optionsPhone = response.data.list.map((item)=>{
                               return  { value: `${item.id}`, label: `${item.phone}` };
                            });
                        }
                        if(type=='name'){
                            this.optionsName = response.data.list.map((item)=>{
                               return  { value: `${item.id}`, label: `${item.username}` };
                            });
                        };

                    })
                    .catch(()=>{

                    })

            },
            getrolelist(){
                authRoleList(this.role_query)
                    .then(response=>{
                        if(response.code==200){
                            this.rolelist = response.data.list;
                        }
                    })
                    .catch(()=>{
                        this.$message.error("系统发生错误,请稍后再试");
                    });
            },
            returnPage(){
                //返回上一页
                if (window.history.length <= 1) {
                    this.$router.push({ path: "/enterprise/employee" });
                    return false;
                } else {
                    this.$router.go(-1);
                }
            },
            // 显示表单
             handleForm(index, row) {
                 this.getrolelist();
                 this.formVisibledetails = true;
                 // 刷新表单
                 this.resetForm();
                 this.formData = JSON.parse(JSON.stringify(formJson));
                 if (row !== null) {
                     this.formData = Object.assign({}, row);
                 }
                 if(row.business_name==null){this.formData.business_name = "无";}
                 // if(row.has_business!==null){
                 //     this.formData.business_name = row.has_business.business_name;
                 // }else{
                 //     this.formData.business_name = "无";
                 // }
                 this.formName = "add";
                 if (index !== null) {
                     this.index = index;
                     this.formName = "edit";
                 }

             },
             //删除员工
             handleFormdel(out_id,index){
                this.$confirm('此操作将该员工移出, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //点击确定的操作(调用接口)
                        employeedel({out_id:out_id})
                            .then(response=>{
                                if(response.code!=200){this.$message.error("删除失败,请稍后再试");}
                                 this.$message({
                                          showClose: true,
                                          message: '删除成功',
                                          type: 'success'
                                        });
                                this.list.splice(index,1);
                            })
                            .catch(()=>{
                                this.$message.error("系统出了点问题,请稍后再试");
                            });

                    }).catch(() => {

                        //几点取消的提示
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
                //获取数据
                this.loading = false;
                employeelist(this.query)
                    .then(response => {
                        this.loading = false;
                        this.list = response.data.list || [];
                        this.total = response.data.total || 0;
                        this.query.business_name = response.data.business.business_name
                    })
                    .catch(() => {

                        this.loading = false;
                        this.list = [];
                        this.total = 0;
                    });
             },
             onSubmit(){
             //查询
                 // this.$router.push({
                 //     path: "",
                 //     query: this.query
                 // });
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
                         //this.formLoading = true;
                         let data = Object.assign({}, this.formData);
                         employeeedit({
                             'id':data.id,
                             'username':data.username,
                             'phone':data.phone,
                             'role_id':data.role_id,
                         })
                             .then(response => {
                                 this.formLoading = false;
                                 if (response.code) {
                                     this.$message.error(response.message);
                                     return false;
                                 }
                                 this.$message.success("操作成功");
                                 this.formVisible = false;
                             })
                             .catch(() => {
                                 this.formLoading = false;
                             });
                     }
                 });
             },
             onSubmitemployee(){
                 // console.log(document.getElementById("shareaddqrcode").innerHTML);
                 this.$refs['formemployee'].validate((valid) => {
                    if (valid) {
                        /*API-FUCK*/
                    }
                 });
             },
             sharecodEemployee(){
                 /*分享二维码加入员工*/
                 // this.formemployeetype = this.formemployeetype?false:true;
                 // if(this.formemployeetype){
                 //     this.tips="二维码添加";
                 //     return;
                 // }else{
                 //     this.tips="搜索添加";
                 // }
                 try{
                     document.getElementById('shareaddqrcode').innerHTML = "";
                 }catch(e){
                     //FUCK
                 }
                 this.$nextTick(()=>{
                    let qrtext = DOMAIN_H5_URL+"/#/pages/scan/staffscan?grant_code="+this.businessInfo.grant_code;
                    let qrcode = new QRCode(this.$refs.qrcodeContainer, {
                    width: 200, // 二维码的宽
                    height: 200, // 二维码的高
                    text: qrtext, // 二维码的内容
                    colorDark: "#000", // 二维码的颜色
                    colorLight: "#fff",
                    correctLevel: QRCode.CorrectLevel.H,
                    });
                 });
             },
             handleAddemployee(){
                 this.dialogFormVisibleemployee = true;
                 this.sharecodEemployee();
             },
            getBussinessInfo(ids){
                //获取商家信息
                let request_param = {
                    business_id:ids?ids:"",
                };
                business_Find(request_param)
                    .then(response=>{
                        if(response.code==200){
                            this.businessInfo = response.data;
                        }
                    })
                    .catch(()=>{

                    })

            },
        },
        filters:{
            //权限相关状态
            roleFilterType(roleid) {
                const statusMap = {
                    1: "danger",
                    2: "primary",
                    3: "success",
                    4: "info",
                    5: "",
                };
                return statusMap[roleid];
            },
            roleFilterName(role) {
                // const statusMap = {
                //     1: "管理员",
                //     2: "负责人",
                //     3: "操作员",
                //     4: "消费者",
                //     5: "",
                // };
                if(role==null){return "无";}
                return role;
                // return role.role_name;
            },
            businessNameFilter(business){
                if(business==null){return "无";}
                return business;
                // return business.business_name;
            },
        },
        mounted() {
        //
        },
        created() {
            /*鉴权*/
            //if(this.$store.getters.adminId=='1'){this.query.role_id="";}
            /*传参*/
            if(this.$route.params.employee_id){
                this.query.business_notice = this.$route.params.employee_id;
                this.employee_id = this.$route.params.employee_id;
                this.getBussinessInfo(this.employee_id);
            }else{
                this.getBussinessInfo("");
            }
            // 加载表格数据
            this.getList();
        }
}
</script>

<style type="text/scss" lang="scss">
    #employee{
        #shareaddqrcode img{
            margin: 0 auto;
        }
        .customWidth{
            width:34%;
        }
        .join_span{
            background-color: #d9edf7;
            border-color: #c6e4f3;
            color: #3a87ad;
            text-align: center;
            display: block;
            margin: 10px auto;
            padding: 14px;
            margin-bottom: 20px;
        }
    }
</style>
