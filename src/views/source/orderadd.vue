<template>
    <div>
        <el-form ref="form" :model="formData" label-width="80px">
            <div v-for="(item,index) in number">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="商品名称">
                            <el-select v-model="data[index].menu_id" placeholder="请选择商品">
                            <el-option v-for="(item,index) in menulist" :label="item.menu_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="商品数量">
                            <el-input v-model="data[index].number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="每箱数量">
                            <el-input v-model="data[index].menu_number"></el-input>
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
                        window.sessionStorage.setItem("order_number",response.data)
                        window.location.href = "#/source/opdencode"
                    })
                    .catch(() =>{
                        
                    });

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
            }
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
