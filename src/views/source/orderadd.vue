<template>
    <div>
        <el-form ref="form" :model="formData" label-width="80px">
            <div v-for="(item,index) in number" :key="index">
                <el-row>
                    <el-col :span="4">
<<<<<<< Updated upstream
                        <el-form-item  prop="business_name" label="所属商家" v-permission="'bug/role'">
=======
                        <el-form-item  prop="business_name" label="所属商家" v-permission="'menu/menumodify/businesslist'">
>>>>>>> Stashed changes
                            <el-select @change="onselectbusiness" v-model="formData.business_name" :disabled="business_namechanger" placeholder="请选择商家">
                            <el-option
                                v-for="item in businessArr"
                                :key="item.id"
                                :label="item.business_name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="商品名称">
                            <el-select v-model="data[index].menu_id" placeholder="请选择商品">
                            <el-option v-for="(item,index) in menulist" :key="index" :label="item.menu_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="商品数量">
                            <el-input maxlength="4" v-model="data[index].number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="每箱数量">
                            <el-input maxlength="4" v-model="data[index].menu_number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" class="addNumber">
                        <i class="el-icon-circle-plus-outline" @click="numberup"></i>
                    </el-col>
                </el-row>
            </div>
          <el-form-item>
            <el-button :type="formMap.type | formFilterType" @click="onSubmit">{{formMap.type | formFilterName}}</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import {enterpriseList} from "@/api/enterprise/enterprise";
    import {menulist} from '@/api/menu/menuAll.js';
    import {orderAdd} from "@/api/source/sourceapi.js";
    const formJson = {
        id:'',
    };
    export default {
        data() {
            return {
                formMap: {
                    add: "新 增",
                    edit: "编 辑",
                    type: "add",
                },
                menu_info:{},
                formData:formJson,
                data:[{
                    menu_id:'',
                    number:'',
                    menu_number:'',
                }],
                query: {
                    title: "",
                    page: 1,
                    size: 10
                },
                menulist:[],
                number:1,
                businessArr:[],
                business_query:{
                    type:"my",
                    name: "",
                    state:'1',
                    verify_if:'1',
                    page: 1,
                    size: 9999
                },
            }
    },
        methods:{
            details(){
                //详情接口
                orderAdd({id:this.formData})
                    .then(response => {
                        console.log(response);
                        if(response.data){
                            this.formData = response.data;
                        }
                    })
                    .catch(() =>{

                    });
            },
            onSubmit(){
                //提交表单
                console.log(this.data)
                if(this.data[this.data.length-1]['menu_id'] == '' || this.data[this.data.length-1]['number'] == '' || this.data[this.data.length-1]['menu_number'] == ''){
                    this.$message({
                        message: '请输入完整再进行提交',
                        type: 'warning'
                    });
                    return false;
<<<<<<< Updated upstream
                }
                for(var i=0; i<this.data.length; i++){
                    if(this.num(this.data[i]['number']) == false || this.num(this.data[i]['menu_number']) == false){
                        this.$message({
                            message: '输入的数据有误！请重试',
                            type: 'warning'
                        });
                        // setTimeout(function(){window.location.reload()},2000);
                        return false; 
                    }
=======
>>>>>>> Stashed changes
                }
                // return false;
                this.formData.data = this.data
                orderAdd(this.formData)
                .then(response => {
                    console.log(response);
                    // this.$router.push({
                    //     name:'批次列表',
                    //     params:{
                    //         data:response.data,
                    //     }
                    // });
                    // window.sessionStorage.setItem("order_number",response.data)
                    // window.location.href = "#/source/opdencode"
                    var _this=this
                    setTimeout(function (){
                        _this.$router.push({
                            path:'opdencode',
                            query:{
                                order_number:response.data.order_number,
                                order_total:response.data.total
                            }
                        })
                    },"1000");

                })
                .catch(() =>{

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
            getList(){
                this.loading = false;
                menulist(this.query)
                    .then(response => {
                        this.menulist = response.data.list
                        console.log(this.menulist)
                    })
                    .catch(() => {

                    });
            },
            numberup(){
                console.log(this.data)
                var f_data = this.data[this.number-1]
                if(f_data['menu_id'] == '' || f_data['number'] == '' || f_data['menu_number'] == ''){
                    this.$message({
                        message: '请填写完整后再添加',
                        type: 'warning'
                    });
                    return false;
                }
                this.data.push({menu_id:'',number:'',menu_number:''})
                this.number++
            },
            onselectbusiness(e){
                //选择商家
                if(!e){return;}
                let obj = {};
                obj = this.businessArr.find(item => {
                    //这里的operateOption就是上面遍历的数据源
                    return item.id === e; //筛选出匹配数据
                });
                console.log(obj)
                this.formData.business_name = obj.business_name;
                this.formData.business_id = obj.id;
                this.query.business_id = obj.id;
                this.getList()
            },
            businesslist(){
                //商家列表
                enterpriseList(this.business_query)
                .then(response => {
                    this.loading = false;
                    this.businessArr = response.data.list || [];
                    //this.total = response.data.total || 0;
                })
                .catch(() => {
                    this.loading = false;
                    this.list = [];
                    //this.total = 0;
                });
            },
        },
        filters:{
            formFilterType(status) {
                const statusMap = {
                    'add': "gray",
                    'edit': "success"
                };
                return statusMap[status];
            },
            formFilterName(status) {
                const statusMap = {
                    'add': "提 交",
                    'edit': "修 改"
                };
                return statusMap[status];
            }
        },
        mounted() {
        //
        },
        created() {
            this.businesslist();
            if(this.$route.query.menuid){
                document.title = "修改商品 - "+document.title;
                this.formData.id = this.$route.query.menuid;
                this.formMap.type = "edit";
                this.details();
            }
            this.getList()
        },
        destroyed(){
            document.title = "溯源码平台后台管理";
        }
};

</script>

<style type="text/scss" lang="scss">
.addNumber{
    color: red;
    font-size: 1.8rem;
    line-height: 40px;
    display: block;
    text-align: center;
}
.addNumber i:hover{
    color: #147cd4;
    cursor: pointer;
}
</style>
