<template>
        <div>
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
            <el-table-column
                 label="商户名称">
                 <template slot-scope="scope">
                    {{scope.row.has_business | businessNameFilter}}
                 </template>
             </el-table-column>
            <el-table-column
                 label="权限">
                 <template slot-scope="scope">
                     <el-tag :type="scope.row.role_id | roleFilterType">{{scope.row.get_role | roleFilterName}}</el-tag>
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
                    <el-button type="success" size="small" @click.native="handleForm(scope.$index, scope.row)">编 辑</el-button>
                    <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button>
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

            <el-form :label-position="left" label-width="80px" :model="formData" :rules="formRules" ref="dataForm">
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
                    <el-form-item label="用户名称" prop="title">
                        <el-input v-model="formData.username" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="formData.phone" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户类型" prop="roleid">
                        <!-- <el-input v-model="formData.roleid" auto-complete="off"></el-input> -->
                         <el-select v-model="formData.roleid" placeholder="请选择">
                            <el-option
                              v-for="item in roleoptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <el-form-item label="所属商户" prop="business_name">
                        <el-input v-model="formData.business_name" auto-complete="off"></el-input>
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

        </div>

</template>

<script>
    import {employeelist} from "@/api/user/user.js";
    const formJson = {
        id:'',
        username:'',
        phone:'',
        roleid:'',
        business_name:'',
    };
    export default {
        data() {
            return {
                employee_id:'',
                formMap: {
                    add: "新 增",
                    edit: "员工信息"
                },
                formVisibledetails:false,
                formData: formJson,
                query: {
                    phone:"",
                    username:"",
                    business_name:"",
                    title: "",
                    page: 1,
                    size: 10
                },
                loading: true,
                list: [],
                total:0,
                dialogFormVisibleverif:false,
                formverif:{},
                formLabelverifWidth:'120px',
                formName:null,
                company_imgstyle:"{width: 100px; height: 100px;}",
                formLoading:false,
                roleoptions:[]
            }
        },
        methods:{
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
                 // console.log(row);
                 // console.log(index);
                 this.formVisibledetails = true;
                 // 刷新表单
                 this.resetForm();
                 this.formData = JSON.parse(JSON.stringify(formJson));
                 if (row !== null) {
                     this.formData = Object.assign({}, row);
                 }
                 if(row.has_business!==null){
                     this.formData.business_name = row.has_business.business_name;
                 }else{
                     this.formData.business_name = "无";
                 }
                 this.formName = "add";
                 if (index !== null) {
                     this.index = index;
                     this.formName = "edit";
                 }
             },
             //删除员工
             handleFormdel(index,row){
                this.$confirm('此操作将该员工移出, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //点击确定的操作(调用接口)
                        this.list.splice(index,1);
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
                return role.role_name;
            },
            businessNameFilter(business){
                if(business==null){return "无";}
                return business.business_name;
            },

        },
        mounted() {
        //
        },
        created() {
            if(this.$route.params.employee_id){

                this.employee_id = this.$route.params.employee_id;
            }
              console.log( this.employee_id);
            // 加载表格数据
            this.getList();
        }
}
</script>

<style type="text/scss" lang="scss">

</style>
