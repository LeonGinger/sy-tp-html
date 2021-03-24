<template>
    <div>
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="formData.menu_name"></el-input>
          </el-form-item>
          <el-form-item label="所属商家">
            <el-select v-model="formData.region" placeholder="请选择商家">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="商品分类">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="商品售价">
            <el-input v-model="formData.menu_money"></el-input>
          </el-form-item>
          <el-form-item label="生产源地">
            <el-input v-model="formData.menu_address"></el-input>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-input v-model="formData.menu_weight"></el-input>
          </el-form-item>
          <el-form-item label="生产日期">
             <el-date-picker
               v-model="formData.production_time"
               type="datetime"
               placeholder="选择日期时间"
               default-time="12:00:00">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="保质日期">
              <el-date-picker
                v-model="formData.quality_time"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="购买链接">
              <el-input v-model="formData.menu_url"></el-input>
            </el-form-item>
<!--          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送">
            <el-switch v-model="form.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button :type="formMap.type | formFilterType" @click="onSubmit">{{formMap.type | formFilterName}}</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import {menudetails} from "@/api/menu/menuAll.js";
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


            }
    },
        methods:{
            details(){
                //详情接口
                menudetails({id:this.formData.id})
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
                    'add': "新增",
                    'edit': "修改"
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
        },
        destroyed(){
            document.title = "溯源码平台后台管理";
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
