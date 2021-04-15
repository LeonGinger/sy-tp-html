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
                label="商品名称"
                prop="menu_name"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <template slot-scope="scope">
                    {{scope.row.gmemu | FilterMenuname}}
                </template>
            </el-table-column>
            <el-table-column
                label="溯源码"
                prop="source_code"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                align="center"
                label="查询次数"
                prop="track"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <template slot-scope="scope">
                    <el-tag  effect="plain" :type="scope.row.track | FilterTracktype">{{scope.row.track | FilterTrack}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="查询时间"
                prop="track_time"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="用户名"
                prop="username"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                <template slot-scope="scope">
                    {{scope.row.guser | FilterUsername}}
                </template>
            </el-table-column>
            <el-table-column
                label="头像"
                prop="headimgurl"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
                    <template slot-scope="scope">
                        <el-avatar shape="square" :size="100" fit="cover" :src="scope.row.guser | FilterUserhead"></el-avatar>
                    </template>
            </el-table-column>
        <!--    待添加 -->
<!--            <el-table-column
                label="IP"
                prop="IP"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="经纬度"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="省"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="市"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="县"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column> -->
<!--                end wait add -->
            <el-table-column
                width="300"
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button>
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

    import {sourceLogindex,sourceLogDel} from "@/api/source/sourceapi.js";
    const formJson = {};
    export default {
        data() {
            return {
                formData: formJson,
                formRules:{},
                query: {
                    business_id:"",
                    user_id:"",
                    source_code: "",
                    page: 1,
                    size: 10,

                },
                loading: true,
                list: [],
                total:0,

            }
    },
        methods:{
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
               sourceLogindex(this.query)
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
            console.log(this.$store);
            if(this.$store.state.admin.business_notice){
                this.query.business_id = this.$store.state.admin.business_notice;
            }
            this.getList();

        }
};

</script>

<style type="text/scss" lang="scss">
</style>
