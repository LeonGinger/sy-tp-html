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
                width="300"
                label="操作"
                fixed="right">
                <template slot-scope="scope">

                   <!-- <el-button  class="g-success" size="small" @click.native="handleDel(scope.$index, scope.row)">删 除</el-button> -->
                    <el-dropdown @command="handleverif">
                    <el-button size="small" type="primary" class="g-success" >
                        审 核<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">通 过</el-dropdown-item>
                        <el-dropdown-item command="2">拒 绝</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>

                    <el-button type="warning" size="small" @click.native="handleForm(scope.$index, scope.row)">查 看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.limit"
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
            <el-form :model="formData" :rules="formRules" ref="dataForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面图片（上传或填写网络地址）" prop="pic">
                    <div>
                        <el-input size="small" v-model="formData.pic" auto-complete="off" placeholder="图片路径"></el-input>

                        <upload ext="jpg,png,jpeg" :size="716800"  @on-select="onSelectPic"></upload>

                    </div>
                    <div class="upload-img" v-if="formData.pic_url">
                        <img :src="formData.pic_url" style="max-width: 200px;max-height: 200px;">
                    </div>

                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="formData.describe" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转方式" prop="jump_type">
                    <el-radio-group v-model="formData.jump_type">
                        <el-radio :label="0">web 网页</el-radio>
                        <el-radio :label="1">APP内跳转</el-radio>
                        <el-radio :label="2">小程序跳转</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="URL链接（web网页和小程序时）" prop="jump_url" v-if="formData.jump_type === 0 || formData.jump_type === 2">
                    <el-input v-model="formData.jump_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="IOS 类名（APP内跳转时）" prop="ios_url" v-if="formData.jump_type === 1">
                    <el-input v-model="formData.ios_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Android 类名（APP内跳转时）" prop="android_url" v-if="formData.jump_type === 1">
                    <el-input v-model="formData.android_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="小程序的 appid（小程序跳转时）" prop="wxa_appid" v-if="formData.jump_type === 2">
                    <el-input v-model="formData.wxa_appid" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="开始时间">

                    <el-form-item prop="start_time" style="display: inline-block;">
                        <el-date-picker
                            v-model="formData.start_time"
                            type="datetime"
                            size="mini"
                            placeholder="开始时间（默认不限制）">
                        </el-date-picker>
                    </el-form-item>
                    -
                    <el-form-item prop="end_time" style="display: inline-block;">
                        <el-date-picker
                            v-model="formData.end_time"
                            type="datetime"
                            size="mini"
                            placeholder="结束时间（默认不限制）">
                        </el-date-picker>
                    </el-form-item>

                </el-form-item>

                <el-form-item label="统计事件的名称" prop="event_name">
                    <el-input v-model="formData.event_name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button style="float: right;" type="primary" @click.native="formSubmit()" :loading="formLoading">提前提交</el-button>
                </el-form-item>

                <el-form-item label="新用户展示逻辑">
                    <div class="remove-list-box">
                        第几次展示
                        <el-form-item prop="new_show_start_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.new_show_start_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="第几次展示">
                            </el-input-number>
                        </el-form-item>
                        -
                        展示最大次数
                        <el-form-item prop="new_show_max_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.new_show_max_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="展示最大次数">
                            </el-input-number>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item label="老用户展示逻辑">
                    <div class="remove-list-box">
                        第几次展示
                        <el-form-item prop="old_show_start_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.old_show_start_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="第几次展示">
                            </el-input-number>
                        </el-form-item>
                        -
                        展示最大次数
                        <el-form-item prop="old_show_max_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.old_show_max_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="展示最大次数">
                            </el-input-number>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item>
                    <span style='color:red;'>以下内容（注意：不要输入空格和逗号，批量添加以英文逗号隔开）黑白名单用来控制屏蔽或者显示</span>
                </el-form-item>

                <el-form-item label="渠道名单" required>
                    <el-form-item prop="channel_type">
                        <el-radio-group v-model="formData.channel_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="channel_list" v-if="formData.channel_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.channel_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleChannelListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.channel_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="channelListInput"
                                placeholder="输入渠道版本插入"
                                style="width: 190px;"
                                ref="channelListRef"
                                @keyup.enter.native="handleChannelListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleChannelListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="Android版本名单" required>
                    <el-form-item prop="android_version_type">
                        <el-radio-group v-model="formData.android_version_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="android_version_list" v-if="formData.android_version_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.android_version_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleAndroidVersionListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.android_version_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="androidVersionListInput"
                                placeholder="输入Android版本插入"
                                style="width: 190px;"
                                ref="androidVersionListRef"
                                @keyup.enter.native="handleAndroidVersionListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleAndroidVersionListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="iOS版本名单" required>
                    <el-form-item prop="ios_version_type">
                        <el-radio-group v-model="formData.ios_version_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="ios_version_list" v-if="formData.ios_version_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.ios_version_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleIosVersionListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.ios_version_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="iosVersionListInput"
                                placeholder="输入iOS版本插入"
                                style="width: 190px;"
                                ref="iosVersionListRef"
                                @keyup.enter.native="handleIosVersionListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleIosVersionListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideForm">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
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
import {enterpriseList} from "@/api/enterprise/enterprise";
const formJson = {

};
export default {
    data() {
        return {
            formMap: {
                add: "新增",
                edit: "编辑"
            },
            formVisibledetails:false,
            formData: formJson,
            query: {
                title: "",
                page: 1,
                limit: 20
            },
            loading: true,
            list: [],
            total:0,
            dialogFormVisibleverif:false,
            formverif:{},
            formLabelverifWidth:'120px',

        }
    },
    methods:{
    //方法
        onReset() {
            this.$router.push({
                path: ""
            });
            this.query = {
                title: "",
                page: 1,
                limit: 20
            };
            this.getList();
        },
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
    },
    filters: {
        statusFilterType(status) {
            const statusMap = {
                0: "gray",
                1: "success"
            };
            return statusMap[status];
        },
        statusFilterName(status) {
            const statusMap = {
                0: "禁用",
                1: "正常"
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
</style>
