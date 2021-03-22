<template>

    <div>
        <!-- start search -->
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.title" placeholder="企业名称"></el-input>
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
                prop="id"
                fixed>
            </el-table-column>
            <el-table-column
                label="企业ID"
                prop="company_id"
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
                label="申请人ID"
                prop="user_id"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="申请人姓名"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="联系电话"
                prop="mobile"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilterType">{{scope.row.status | statusFilterName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
import {enterpriseList} from "@/api/enterprise/enterprise";
export default {
    data() {
        return {
            query: {
                title: "",
                page: 1,
                limit: 20
            },
            loading: true,
            list: [],
            total:0,
        }
    },
    methods:{
    //方法
       getList(){

           this.loading = false;
           enterpriseList(this.query)
                .then(response => {
                    console.log(1)
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
</style>
