<template>

    <div>
        <!-- start search -->
        <div
        id="qrcode"
        class="qrcode"
        ref="qrcodeContainer"
        style="display:none"
        ></div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.title" placeholder="溯源编号"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <template>
                <el-select @change="onSubmit" v-model="query.value" placeholder="请选择状态">
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
                width="500"
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
                    <el-button
                    type="success"
                    size="small"
                    @click.native="handleForm(scope.$index)"
                    >溯源详情</el-button>
                    <el-button type="success" size="small" @click="sourceAdd(scope.row.source_code,scope.row.source_code_img)">溯源码打印</el-button>
                    <el-button type="success" v-if="scope.row.state == '已出库'" size="small" @click="ordergoto(scope.$index)">寄件信息修改</el-button>
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
        <!-- 查看详情表单 -->
        <el-dialog
        :title="formMap[formName]"
        :visible.sync="formVisibledetails"
        :before-close="hideFormdetails"
        width="50%"
        top="5vh"
        >
            <el-form label-position="right" label-width="120px" :model="findsource" :rules="formRules" ref="dataForm">
                <el-row>
                  <!-- 左边 -->
                  <el-form-item prop="">
                       <el-image
                         style="width: 20%; height: 20%; margin-left:27%;"
                         :src="findsource.source_code_img"
                         :fit="fit"></el-image>
                    </el-form-item>
                  <el-col :span="12"><div class="grid-content bg-purple">
                   <!-- 商户信息 -->

                    <el-form-item label="商品名称:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.menu_name||"暂无"}}
                    </el-form-item>
                    <!-- <el-form-item label="所属商家:" prop="business.business_name">
                        {{findsource.business.business_name||"暂无"}}
                    </el-form-item> -->
                    <el-form-item label="批次编号:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.order_number||"暂无"}}
                    </el-form-item>
                    <el-form-item label="扫码次数:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.source_number||'0'}}
                    </el-form-item>
                    <el-form-item label="生产源地:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.menu_address||"暂无"}}
                    </el-form-item>

                    <el-form-item label="商品规格:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.menu_weight||"暂无"}}
                    </el-form-item>

                    <el-form-item label="生产日期:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.production_time||"暂无"}}
                    </el-form-item>

                    <el-form-item label="保质日期:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.quality_time||"暂无"}}
                    </el-form-item>
                  </div></el-col>
                  <el-col :span="12">
                      <div class="grid-content bg-purple">
                    <el-form-item label="溯源编号:" prop="">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.source_code||"暂无"}}
                    </el-form-item>


                    <el-form-item label="码数量/批:" prop="quality_time">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.source_code_number||"暂无"}}
                    </el-form-item>


                    <el-form-item label="入库人员:" prop="enter_user">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.enter_user||"暂无"}}
                    </el-form-item>


                    <el-form-item label="入库时间:" prop="storage_time">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.storage_time||"暂无"}}
                    </el-form-item>


                    <el-form-item label="出库人员:" prop="out_user">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.out_user||"暂无"}}
                    </el-form-item>


                    <el-form-item label="出库时间:" prop="deliver_time">
                       <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                        {{findsource.deliver_time||"暂无"}}
                    </el-form-item>
                      </div>
                  </el-col>
                    <el-col :span="1"><div class="grid-content bg-purple">&nbsp;</div></el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 修改发货信息 -->
        <el-dialog
        :title="formMap[formName]"
        :visible.sync="gotoformshow"
        :before-close="hideFormdetailss"
        width="480px"
        top="5vh"
        >
            <el-form label-position="right" label-width="120px" :model="findsource" :rules="formRules" ref="dataForm">
                <el-row>
                  <!-- 左边 -->
                  <el-form-item prop="">
                       <el-image
                         style="width: 200px; height: 200px;"
                         :src="findsource.source_code_img"
                         :fit="fit"></el-image>
                    </el-form-item>
                  <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <p style="text-align:center;color:red;">请用手机扫码修改↑</p>
                        <!-- 商户信息 -->
                        <el-form-item label="快递单号" prop="">
                        <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                            {{findsource.goto_order||"暂无"}}
                        </el-form-item>
                        <el-form-item label="收件人名称" prop="">
                        <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                            {{findsource.goto_user||"暂无"}}
                        </el-form-item>
                        <el-form-item label="收件人手机号" prop="">
                        <!-- <el-input v-model="formData.business_name" auto-complete="off"></el-input> -->
                            {{findsource.goto_mobile||"暂无"}}
                        </el-form-item>
                    </div>
                  </el-col>
                    <el-col :span="1"><div class="grid-content bg-purple">&nbsp;</div></el-col>
                </el-row>
            </el-form>
        </el-dialog>
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
            gotoformshow:false,
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
            findsource: [],
            formRules:{},
            fit:"contain",
            options: [{
                value: '1',
                label: '未入库'
            },{
                value: '2',
                label: '已入库'
            },{
                value: '3',
                label: '已出库'
            }],
        }
    },
    methods:{
    //方法
        // 显示表单
        handleForm(index) {
            this.formLoading = true
            this.formVisibledetails = true;
            // 刷新表单
            this.resetForm();
            this.findsource = this.order[index]
            // this.formLoading=false
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
                limit: 10,
                menu_id:'',
            };
            this.getList();
        },
        getList(){
            this.loading = true;
            sourceList(this.query)
                .then(response => {
                    //console.log(response);
                    this.order = response.data.list || 0,
                    this.total = response.data.total || 0;
                    var _this = this;
                    this.loading = false
                    if(this.order != 0){
                        this.codeselect(response.data.list);
                        this.findsource = this.order[0]
                    }
                })
                .catch(() => {
                    // this.loading = false;
                    this.list = [];
                    this.total = 0;
                });
        },
        onSubmit(){
        //查询
            this.query.source_number = this.query.title
            this.resetForm()
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
        hideFormdetailss(){
            // 更改值
            this.gotoformshow = !this.gotoformshow;
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
            var order = data
            // console.log(order)
            var tmpg = 0;
            var set_go = 1;
            var _this = this;
            var count_qrcode = order.length
            // for(let i=0;i<order.length;i++){
            //     var code_number = order[i]['source_code']
            //     console.log(code_number)
            //     _this.makeqrcode(code_number,i)
            // }
            var showcode = setInterval(function () {
                for (var i = tmpg; i < set_go; i++) {
                    var code_number = order[i]['source_code']
                    setTimeout(function(){_this.makeqrcode(code_number,i)},500*(i+1))
                }
                tmpg += 1;
                set_go += 1;
                if (tmpg >= count_qrcode) {
                    clearInterval(showcode);
                    // setTimeout(function(){loading.close();},300*(count_qrcode+1))
                }
            });
            //console.log(this.order)
        },
        makeqrcode(code_number,index) {
            var index = index-1
            // if(index!=0){
                //console.log(index+"////"+code_number)
                this.$refs.qrcodeContainer.innerHTML = '';
            // }
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
                    //console.log(qwe);
                    var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
                    let tmpSrc = patt.exec(qwe);
                    // console.log(tmpSrc);
                    // this.sourceSrc[index] = tmpSrc[1];

                    //document.getElementById("qrcode").innerHTML = "";
                    // console.log("妙啊~");
                    // console.log(this.sourceSrc);
                    this.order[index]['source_code_img'] = tmpSrc[1];
                    this.$forceUpdate();
                });
            });
        },
        sourceAdd(source,code){
            //console.log(code)
            this.$prompt('请输入打印数量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if(this.num(value)){
                    window.sessionStorage.setItem('source',source)
                    window.sessionStorage.setItem('sourcecode',code)
                    window.sessionStorage.setItem('sourcecode_number',value)
                    window.location.href = "#/source/opdencode"
                }else{
                    this.$message({
                    type: 'warning',
                    message: '请输入纯数字的数量'
                });
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消打印'
                });
            });
        },
        //验证全是数字
        num(value){
            var n = /^[0-9]*$/;
            var re = new RegExp(n);
            if (re.test(value))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        ordergoto(index){
            this.formLoading = true
            this.gotoformshow = true;
            // 刷新表单
            this.resetForm();
            this.findsource = this.order[index]
            // console.log(this.findsource)
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
        if(this.$route.query.menu_id){
            this.query.menu_id = this.$route.query.menu_id;
        }
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
