<template>

    <div>
        <!-- start search -->
        <div
      id="qrcode"
      class="qrcode"
      ref="qrcodeContainer"
      style="display: none"
    ></div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.title" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                </el-button-group>
                &nbsp;
                <!-- <el-button v-permission="'menu/menulist/add'" class="g-success" type="success" @click.native="handleForm(null,null)">新建批次</el-button> -->
                <!-- <el-button v-permission="'menu/menulist/del'" type="danger" @click.native="handleFormdell(null,null)">删除</el-button> -->
            </el-form-item>
        </el-form>
        <!-- end search -->
        <el-table
            v-loading="loading"
            :data="order"
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
                label="二维码"
                prop="order_number"
                with="300"
                >
                <template slot-scope="scope">
                    <el-image :src="scope.row.source_code_img">
                        <div slot="error" class="image-slot">
                        正在加载中...
                    </div>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="商品名称"
                prop="menu_name"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="溯源编号"
                prop="source_code"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="被扫码次数"
                prop="source_number"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="状态"
                prop="state"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
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
                    <el-button type="success" size="small" @click="sourceAdd(scope.row.source_code,scope.row.source_code_img)">溯源码打印</el-button>
                    <!-- <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row)">删 除</el-button> -->
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
import QRCode from "qrcodejs2";
import { MY_CODE_URL } from "../../config/app";
import {sourceList} from '@/api/source/sourceapi.js';
import { Loading } from 'element-ui';
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
            query: {
                title: "",
                page: 0,
                limit: 10
            },
            loading: true,
            list: [],
            total:0,
            dialogFormVisibleverif:false,
            formverif:{},
            formLabelverifWidth:'120px',
            formName:null,
            company_imgstyle:"{width: 100px; height: 100px;}",
            formLoading:true,
            order: [],
            sourceSrc: [],
        }
    },
    methods:{
    //方法
        // 显示表单
        handleForm(index, row) {
            this.$router.push({
                path:'menumodify',
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
                page: 0,
                limit: 10
            };
            this.getList();
        },
        getList(){
            // this.loading = false;
            sourceList(this.query)
                .then(response => {
                    console.log(response);
                    this.order = response.data.list || 0,
                    this.total = response.data.total || 0;
                    var _this = this;
                    this.loading = false
                    this.codeselect(response.data);
                })
                .catch(() => {
                    // this.loading = false;
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

           this.query.page = (val - 1)*10 ;
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
        hideFormdetails(){
            // 更改值
            this.formVisibledetails = !this.formVisibledetails;
            return true;
        },
        formSubmit(){
            this.$refs["dataForm"].validate(valid => {
                if (valid){
                    this.formLoading = true;
                    let data = Object.assign({}, this.formData);
                    adSave(data, this.formName)
                    .then(response => {
                        // this.formLoading = false;
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
                        // this.formLoading = false;
                    });
                }
            });
        },
        codeselect(data){
            var order = data.list
            var _this = this
            console.log(order.length)
            for(let i=0;i<order.length;i++){
                var code_number = order[i]['source_code']
                // console.log(i)
                _this.makeqrcode(code_number,i);
            }
            console.log(this.order)
        },
        makeqrcode(code_number,index) {
            let qrtext = MY_CODE_URL + "?source_code=" + code_number;
            // console.log(qrtext)
            this.$nextTick(() => {
                let qrcode = new QRCode(document.getElementById("qrcode"), {
                    // let qrcode = new QRCode(this.$refs.qrcodeContainer, {
                    width: 100, // 二维码的宽
                    height: 100, // 二维码的高
                    text: qrtext, // 二维码的内容
                    // text: "123", // 二维码的内容
                    colorDark: "#000", // 二维码的颜色
                    colorLight: "#fff",
                    correctLevel: QRCode.CorrectLevel.H,
                });
                setTimeout(() => {
                    let qwe = this.$refs.qrcodeContainer.innerHTML;
                    console.log(qwe);
                    var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
                    let tmpSrc = patt.exec(qwe);
                    // console.log(tmpSrc);
                    this.sourceSrc[index] = tmpSrc[1];
                    this.$forceUpdate();
                    //document.getElementById("qrcode").innerHTML = "";
                    // console.log("妙啊~");
                    // console.log(this.sourceSrc);
                    this.order[index]['source_code_img'] = tmpSrc[1];
                });
            });
        },
        sourceAdd(source,code){
            console.log(code)
            this.$prompt('请输入打印数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                window.sessionStorage.setItem('source',source)
                window.sessionStorage.setItem('sourcecode',code)
                window.sessionStorage.setItem('sourcecode_number',value)
                window.location.href = "#/source/opdencode"
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消'
                });       
            });
        }
    },
    filters: {
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
    .image-slot{
        width:100px;
        height:100px;
        text-align: center;
        line-height: 100px;
        background-color: #e6e6e6;
        color: #999999;
    }
</style>
