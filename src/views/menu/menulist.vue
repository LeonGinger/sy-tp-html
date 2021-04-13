<template>

    <div>
        <!-- start search -->
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.title" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                </el-button-group>
                &nbsp;
                <el-button v-permission="'menu/menulist/add'" class="g-success" type="success" @click.native="handleForm(null,null)">发布商品</el-button>
                <el-button v-permission="'menu/menulist/del'" type="danger" @click.native="handleFormdell(null,null)">删除</el-button>
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
                label="ID"
                prop="id"
                with="50"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="缩略图">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.menu_images_json"
                        fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                prop="menu_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="商品规格"
                prop="menu_weight"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="售价"
                prop="menu_money"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="所属商家"
                prop="business_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="create_time"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
<!--            <el-table-column
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

                  <!--  <el-dropdown @command="handleverif" class="g-left-d10">
                    <el-button size="small" type="primary" class="g-success" >
                        审 核<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">通 过</el-dropdown-item>
                        <el-dropdown-item command="2">拒 绝</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown> -->
                    <el-button type="success" size="small" @click.native="handleForm(scope.$index, scope.row)">编 辑</el-button>
                    <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button>
                  <!--  <el-button type="primary" size="small" @click.native="handleFormemployee(scope.row.company_id)">员 工</el-button> -->
                   <!-- <el-button :type="scope.row.status | statusFilterType_handle" size="small" @click.native="handleFormstatus(scope.$index, scope.row)">{{scope.row.status | statusFilterName_handle}}</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
    </div>

</template>

<script>
import {menulist,menudel} from '@/api/menu/menuAll.js';
const formJson = {

};
export default {
    data() {
        return {
            formMap: {
                add: "新 增",
                edit: "编 辑"
            },
            formVisibledetails:false,
            formData: formJson,
            formRules:{},
            query: {
                title: "",
                page: 1,
                size: 10,
                business_id:"",
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

        }
    },
    methods:{
    //方法
        // 显示表单 新增或编辑
        handleForm(index, row) {
            // //添加
            if(index==null && row==null){
            this.$router.push({
                path:'add',
            })
            }
            //编辑
            this.$router.push({
                path:'edit',
                query:{
                    menuid:row.id
                }
            })
        },
        handleFormstatus(index,row){
            if(row.status==1){
                this.list[index].status = 2;
                this.$message({
                         showClose: true,
                         message: '操作成功',
                         type: 'success'
                       });
            }else{
                this.list[index].status = 1;
                this.$message({
                          showClose: true,
                          message: '操作成功',
                          type: 'success'
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
                limit: 10
            };
            this.getList();
        },
        getList(){
           this.loading = false;
           if(this.$store.state.admin.business_notice){this.query.business_id = this.$store.state.admin.business_notice;}
           menulist(this.query)
                .then(response => {
                    //console.log(response);
                    this.loading = false;
                    this.list = response.data.list || [];
                    this.total = response.data.total || 0;
                    for(var i=0;i<this.list.length;i++){
                        try{
                            this.list[i]['menu_images_json'] = this.list[i]['menu_images_json'][0];
                        }catch(e){
                            this.list[i]['menu_images_json'] = "";
                            //diu
                            //TODO handle the exception
                        }
                    }
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
        handleFormdel(index,row){

            this.$confirm('此操作将删除该商品和相关的溯源信息,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //点击确定的操作(调用接口)
                    menudel({id:row.id})
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
    filters: {
        getlistmenuimg(row){
            if(!row.menu_images_json){return;}
            let tmpmenu_img = JSON.parse(row.menu_images_json);
            try{
                return tmpmenu_img[0];
            }catch(e){
                return;
            }
        },
        statusFilterType(status) {
            const statusMap = {
                1: "success",
                2: "danger"
            };
            return statusMap[status];
        },
        statusFilterName(status) {
            const statusMap = {
                1: "正常",
                2: "冻结"
            };
            return statusMap[status];
        },
        //相反操作按钮
        statusFilterType_handle(status) {
            const statusMap = {
                1: "danger",
                2: "success"
            };
            return statusMap[status];
        },
        statusFilterName_handle(status) {
            const statusMap = {
                1: "冻结",
                2: "解冻"
            };
            return statusMap[status];
        }
    },
    mounted() {
    //
    },
    created() {
    //
        // 加载表格数据
        this.getList();
    }

};
</script>

<style type="text/scss" lang="scss">
    .image_p{
        position: absolute;
        text-align: left;
        width: 226px;
        top: -2.2rem;
    }
/deep/.enterprise_logo{
        margin-left: 64px;
    }
</style>
