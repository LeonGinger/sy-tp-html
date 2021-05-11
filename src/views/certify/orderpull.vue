<template>
    <div>
        <!-- start search -->
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.source_code" placeholder="溯源码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                </el-button-group>
            </el-form-item>
            <el-form-item>
                 <el-button v-if="query.user_id" plain @click="returnPage">返回上一页</el-button>
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
<!--            <el-table-column
                label="缩略图">
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.menu_images_json"
                        fit="cover"></el-image>
                </template>
            </el-table-column> -->
            <el-table-column
                label="商品"
                prop="menu_name"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <template slot-scope="scope">
                    {{scope.row.menu_name}}({{scope.row.menu_weight}})
                </template>
            </el-table-column>
            <el-table-column
                label="收件人"
                prop="goto_user"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <!-- <template slot-scope="scope">
                    {{scope.row.goto_user}}
                </template> -->
            </el-table-column>
            <el-table-column
                label="收件人手机号"
                prop="goto_mobile"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                align="center"
                label="快递单号"
                prop="goto_order"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <!-- <template slot-scope="scope">
                    <el-tag  effect="plain" :type="scope.row.track | FilterTracktype">{{scope.row.track | FilterTrack}}</el-tag>
                </template> -->
            </el-table-column>
            <el-table-column
                align="center"
                label="发货人"
                prop="out_user"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="发货时间"
                prop="deliver_time"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
           
<!--                end wait add -->
            <el-table-column
                width="300"
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="success" v-if="scope.row.state == '已出库'" size="small" @click="ordergoto(scope.$index)">寄件信息修改</el-button>
                    <!-- <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
        <!-- 修改发货信息 -->
        <el-dialog
        :title="'修改信息'"
        :visible.sync="gotoformshow"
        :before-close="hideFormdetailss" 
        width="480px"
        top="5vh"
        >
            <el-form label-position="right" label-width="120px" :model="findsource" :rules="formRules" ref="dataForm">
                <el-form-item label="快递单号">
                    <el-col :span="12" style="max-width:300px">
                        <el-input v-model="findsource.goto_order"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="收件人姓名">
                    <el-col :span="12" style="max-width:300px" maxlength="4">
                        <el-input v-model="findsource.goto_user"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="收件人手机号">
                    <el-col :span="12" style="max-width:300px">
                        <el-input v-model="findsource.goto_mobile" maxlength="11"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                        <el-button type="primary" @click="submit">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>

    import {sourceLogindex,sourceLogDel} from "@/api/source/sourceapi.js";
    import {DOMAIN_URL} from "@/config/app.js";
    import {sourceListWhere,orderupdate} from '@/api/source/sourceapi.js';
    import { Loading } from 'element-ui';
    const formJson = {};
    export default {
        data() {
            return {
                loseImg:DOMAIN_URL+"static/images/0fc7d20532fdaf769a25683617711png.png",
                formData: formJson,
                formRules:{},
                formLoading:true,
                query: {
                    business_id:"",
                    user_id:"",
                    source_code: "",
                    page: 1,
                    limit: 10,
                },
                loading: true,
                list: [],
                total:0,
                gotoformshow:false,
                findsource: [],
            }
    },
        methods:{
            errorHandler(){
                //图片丢失返回
                return true;

            },
            returnPage(){
                //返回上一页
                if (window.history.length <= 1) {
                    this.$router.push({ path: "/userManage/fans" });
                    return false;
                } else {
                    this.$router.go(-1);
                }
            },
            getList(){
               this.loading = false;
               sourceListWhere(this.query)
                    .then(response => {
                        //console.log(response);
                        this.loading = false;
                        this.list = response.data.list || [];
                        this.total = response.data.total || 0;
                        console.log(this.list);
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
            hideFormdetailss(){
                // 更改值
                this.gotoformshow = !this.gotoformshow;
                return true;
            },
            handleFormdel(index,row){

                this.$confirm('此操作将记录,是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //点击确定的操作(调用接口)
                        sourceLogDel({id:row.id})
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
            handleCurrentChange(val) {
               this.query.page = val;
               this.getList();
            },
            ordergoto(index){
                this.formLoading = true
                this.gotoformshow = true;
                // 刷新表单
                // this.resetForm();
                var find = this.list[index]
                this.findsource = JSON.parse(JSON.stringify(find))
                // console.log(this.findsource)
            },
            submit(){
                console.log(this.findsource)
                console.log(this.list)
                var _this = this
                orderupdate(this.findsource)
                    .then(response=>{
                        if(response.code == 200){
                            this.$message({
                                showClose: true,
                                message: '修改成功',
                                type: 'success'
                            });
                        this.gotoformshow = !this.gotoformshow;
                        _this.getList()
                        }
                    })
                    .catch(()=>{

                    })
            }
        },
        filters:{
            FilterMenuname(row){
                if(row==null){return "无";}
                return row.menu_name;
            },
            FilterUsername(row){
                if(row==null){return "无";}
                return row.username;
            },
            FilterUserhead(row){
                if(row==null){return "无";}
                return row.user_image;
            },
            FilterTracktype(val){
                if(val=='1'){
                    return "success";
                }
                return "";

            },
            FilterTrack(val){
                if(val=='1'){
                    return "首次查询";
                }
                return val;
            },
            
        },  
        mounted() {
        //
        },
        created() {
            if(this.$route.params.user_id){

                this.query.user_id = this.$route.params.user_id;
                // this.user_id = this.$route.params.user_id;
            }
            if(this.$store.state.admin.business_notice){
                this.query.business_id = this.$store.state.admin.business_notice;
            }
            this.getList();

        }
};

</script>

<style type="text/scss" lang="scss">
</style>
