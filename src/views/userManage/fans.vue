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
                    <el-form-item>
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                            <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                        </el-button-group>
                         &nbsp;
                        <el-button :disabled="syncchanger" type="primary" :class="syncclass" @click="handleFansys">{{syncbtntips}}</el-button>
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
                        label="昵称"
                        prop="nickname"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column>
                    <el-table-column
                        label="头像"
                        prop="headimgurl"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                            <template slot-scope="scope">
                                <el-avatar  @error="errorHandler" shape="square" size="large" fit="cover" :src="scope.row.headimgurl">
                                    <img :src="loseImg"/>
                                </el-avatar>
                            </template>
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                         label="用户类型"
                         fixed>
                         <template slot-scope="scope">
                             <el-tag :type="scope.row.is_system | sysFilterType">{{scope.row.is_system | sysFilterName}}</el-tag>
                         </template>
                     </el-table-column>


                    <el-table-column
                        label="手机号码"
                        prop="phone"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                         label="权限"
                         fixed>
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
                        prop="create_at"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                           <span>{{ scope.row.create_at }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="省"
                        prop="province"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column>
                    <el-table-column
                        label="市"
                        prop="city"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column>
<!--                    <el-table-column
                        label="县"
                        prop="nickname"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column> -->

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
                            <el-button v-permission="'userManage/fans/searchlog'" type="primary" size="small" @click="handleFormseach(scope.row,scope.$index)">查询记录</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    :page-size="query.size"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>

    </div>

</template>

<script>
    import {fans_index,fans_sync,fans_syncstate} from "@/api/pool.js";
    import {DOMAIN_URL} from "@/config/app.js";
    const formJson = {};
    export default {
        data() {
            return {
                loseImg:DOMAIN_URL+"static/images/0fc7d20532fdaf769a25683617711png.png",
                timer:"",
                syncchanger:true,
                syncclass:"g-success",
                syncbtntips:"同步粉丝",
                loading:false,
                list:[],
                total:0,
                query: {
                    phone:"",
                    username:"",
                    title: "",
                    page: 1,
                    size: 10,
                },
            }
    },
        methods:{
            errorHandler(){
                //图片丢失返回
                return true;
            },
            handleFansys(){
                //同步粉丝
                clearInterval(this.timer);
                fans_sync()
                    .then(response=>{
                        this.$message.success("成功添加[同步粉丝]任务到后台");
                        this.syncclass = "";
                        this.syncchanger = true;
                        this.timer = setInterval(this.getsyncstate, 2000);
                    })
                    .catch(()=>{
                        this.$message.error("[同步粉丝]任务提交失败");
                    });
            },
            getList(){
               //获取数据
               this.loading = false;
               fans_index(this.query)
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
            getsyncstate(){
                fans_syncstate()
                    .then(response=>{
                        if(response.code!=200){}
                        if(response.data.percen!="100%"){
                            this.syncclass = "";
                            this.syncchanger = true;
                            this.syncbtntips = response.data.percen;
                        }else if(response.data.percen=="100%"){
                            this.syncclass = "g-success";
                            this.syncchanger = false;
                            this.syncbtntips = "同步粉丝";
                            clearInterval(this.timer);
                            //this.$message.success("[同步粉丝]完成,请刷新本页面");
                        }

                    })
                    .catch(()=>{
                        this.$message.error("[同步粉丝]获取状态失败");
                    });
            },
            onSubmit(){
            //查询
                this.getList();
            },
            handleCurrentChange(val) {

               this.query.page = val;
               this.getList();
            },
            handleFormseach(row,index){
                //跳转查询记录页面
                if(!row.user_id){
                    this.$message.error("用户信息不全,无法查看");
                    return false;}
                this.$router.push({
                    name:'查询记录',
                    params:{
                        user_id:row.user_id,
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
                if(role==null){return "无";}
                return role;
            },
            sysFilterType(val){
                //系统用户是否
                const sysMap = {
                    0: "info",
                    1: "success",
                };
                return sysMap[val];

            },
            sysFilterName(val){
                //系统用户是否
                const sysnameMap = {
                    0: "仅关注",
                    1: "系统用户",
                };
                return sysnameMap[val];


            },
        },
        mounted() {
            this.timer = setInterval(this.getsyncstate, 2000);
        },
        created() {
            this.getList();

        },
        beforeDestroy() {
          clearInterval(this.timer);
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
