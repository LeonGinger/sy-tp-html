<template>
    <div class="child3">
        <!-- start search -->

        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <template>
                <el-select @change="onSubmit" v-model="query.value" placeholder="请选择类别">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </template>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                   
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                    <el-button type="primary" icon="search" @click="onClearmit">清空</el-button>
                </el-button-group>
                &nbsp;
                <el-button v-permission="'setting/setunit/add'"  type="success" @click.native="handleForm(null,null)">添加</el-button>
                <el-button v-if="multipleSelection.length>0" type="danger" @click="handleFormdel(-1,-1)">批量删除</el-button>
            </el-form-item>
        </el-form>

        <!-- end search -->
        <!-- 表格开始 -->
        <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column
                 type="selection"
                 width="55">
            </el-table-column>
            <!-- <el-table-column
                label="序号"
                type="index"
                fixed>
            </el-table-column> -->
            <el-table-column
                label="ID"
                prop="id"
                with="50"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="单位名称"
                prop="unit_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="类别"
                with="300"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                   <span v-if="scope.row.unit_class=='1'">商品规格</span>
                   <span v-if="scope.row.unit_class=='2'">保质期限</span>
                </template>
            </el-table-column>
            <el-table-column
                width="300"
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click.native="handleForm(scope.$index, scope.row)">编 辑</el-button>
                    <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格结束 -->
        <!-- 分页开始 -->
        <el-pagination
            :page-size="query.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
        <!-- 分页结束 -->
        
        <!-- 共用表单 -->
        <!-- 查看详情表单 -->
        <el-dialog
            :title="formMap[formName]"
            :visible.sync="formVisibledetails"
            :before-close="hideFormdetails"
            width="35%"
            top="5vh">

            <el-form label-position="left" label-width="80px" :model="formData" :rules="formRules" ref="dataForm">
                   <!-- 表单内容 -->
                  
                    <el-form-item label="ID" prop="id" v-if="formName=='edit'">
                       <el-input disabled v-model="formData.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="unit_name">
                        <el-input v-model="formData.unit_name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="unit_class">
                         <el-select v-model="formData.unit_class" placeholder="请选择">
                            <el-option
                              v-for="item in classlist"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="所属商户" prop="business_name">
                        <el-input disabled="disabled" v-model="formData.business_name" auto-complete="off"></el-input>
                    </el-form-item> -->

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">确 定</el-button>
                <el-button @click.native="hideFormdetails">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 表单结束 -->
    </div>

</template>

<script>   
    import {unitlist,unitadd,unitedit,unitdel} from "@/api/pool";
    const formJson = {
        id:'',
        unit_name:'',
        unit_class:'',
        business_id:'',
        business_name:'',
    };
    export default {
        name:"child3",
        data() {
            return {
                multipleSelection:[],
                formData:formJson,
                formRules:{
                    unit_name:[
                        {required: true,message: "请输入对应名称",trigger: "blur"}
                    ],
                    unit_class:[
                        {required: true,message: "请选择类别",trigger: "change"}
                    ]
                },
                formVisibledetails:false,
                loading: true,
                list:[],
                query: {
                    page: 1,
                    size: 10,
                    business_id:"",
                    unit_class:"",
                },
                total:0,
                options: [{
                    value: '1',
                    label: '商品规格'
                },{
                    value: '2',
                    label: '保质期限'
                }],
                formMap: {
                    add: "新 增",
                    edit: "编 辑"
                },
                formName:null,//add,edit
                classlist:[{
                    value: "1",
                    label: '商品规格'
                },{
                    value: "2",
                    label: '保质期限'
                }],
                index:''//当前编辑 或选中的条

            }
    },
        methods:{
            handleSelectionChange(val){
                //多选
                this.multipleSelection = val;
            },
            getList(){
                this.loading = true;
                unitlist(this.query)
                    .then(response => {
                        //console.log(response);
                        this.list = response.data.list || 0,
                        this.total = response.data.total || 0;
                        var _this = this;
                        this.loading = false
                    })
                    .catch(() => {
                        this.list = [];
                        this.total = 0;
                        this.loading = false
                    });
            },
            handleCurrentChange(val) {

                //这里看接口用的是哪种分页
               this.query.page = val
            //    this.query.page = (val - 1)*10 ;
               this.multipleSelection = [];
               this.getList();
               
            },
            //显示表单
            handleForm(index,row){
                this.formVisibledetails = true;
                this.formData = JSON.parse(JSON.stringify(formJson));
                if (row !== null) {
                    this.formData = Object.assign({}, row);
                }
                this.formName = "add";
                if (index !== null) {
                    this.index = index;
                    this.formName = "edit";
                }
            },
            handleFormdel(index,row){
                this.$confirm('此操作将删除该记录,是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //点击确定的操作(调用接口)
                        if(index==-1){
                            row = "";
                            this.multipleSelection.forEach((item,index)=>{
                                row = row+item.id+",";
                            });
                            row = row.substr(0, row.length - 1);
                        }else{
                            row = row.id
                        }
                        unitdel({id:row})
                            .then(response=>{
                                if(response.code!=200){this.$message.error("删除失败,请稍后再试");}
                                 this.$message({
                                          showClose: true,
                                          message: '删除成功',
                                          type: 'success'
                                        });
                                 this.getList();
                            })
                            .catch(()=>{
                                this.$message.error("系统出了点问题,请稍后再试");
                            });

                    }).catch(() => {

                        //点取消的提示
                    });
            },
            // 刷新表单(添加\编辑)
            resetForm() {
                if (this.$refs["dataForm"]) {
                    // 清空字段
                    this.$refs["dataForm"].resetFields();
                    // 清空验证信息表单
                    this.$refs["dataForm"].clearValidate();
                }
            },
            onSubmit(){
            //查询
                this.resetForm()
                this.getList();

            },
            onClearmit(){
              //清空搜索
              this.query.unit_class = "";
              this.$router.push({
                  path: "",
                  query: this.query
              });
            },
            formSubmit(){
            //表单提交
                let data = Object.assign({}, this.formData);
                //添加
                if(this.formName=='add'){
                    unitadd(data)
                        .then(response=>{
                            this.$message.success("操作成功");
                            
                        })
                        .catch(error_res=>{
                            this.$message.error("操作失败");

                        })
                    this.resetForm()
                    this.formVisibledetails = false;

                }
                //编辑
                if(this.formName=='edit'){
                    unitedit(data)
                        .then(response=>{
                            this.$message.success("操作成功");

                        })
                        .catch(error_res=>{
                            this.$message.error("操作失败");

                        })
                    this.resetForm()
                    this.formVisibledetails = false;
                }
                this.getList();
            },
            // 隐藏表单
            hideFormdetails() {
                 // 更改值
                 this.formVisibledetails = !this.formVisibledetails;
                 return true;
             },
            //删除数组中指定键-辅助方法
            delete(i){
　　            var index = arr.indexOf(i);
                arr.splice(index, 1)
            }


        },
        filters:{},
        mounted() {
        //
        },
        created() {
            if(this.$store.state.admin.business_notice){
                this.formData.business_id = this.$store.state.admin.business_notice;
            }
            // 加载表格数据
            this.getList();
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
