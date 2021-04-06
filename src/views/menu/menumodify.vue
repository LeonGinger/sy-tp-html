<template>
    <div>
        <el-form ref="form" :model="formData" label-width="120px">
          <el-form-item label="商品名称">
            <el-input v-model="formData.menu_name"></el-input>
          </el-form-item>
          <el-form-item label="所属商家" v-permission="'menu/menumodify/businesslist'">
            <el-select v-model="formData.region" placeholder="请选择商家">
               <el-option
                   v-for="item in businessArr"
                   :key="item.id"
                   :label="item.business_name"
                   :value="item.id">
                 </el-option>
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
            <!-- 商品轮播图 -->
            <el-form-item label="商品轮播图">
            <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>


            <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
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
    import {enterpriseList} from "@/api/enterprise/enterprise";
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
                businessArr:{},
                loading:false,
                business_query:{
                    type:"my",
                    name: "",
                    state:'1',
                    verify_if:'1',
                    page: 1,
                    size: 9999
                },
                dialogImageUrl:'',
                dialogVisible:false,




            }
    },
        methods:{
            businesslist(){
                //商家列表
                enterpriseList(this.business_query)
                     .then(response => {
                         console.log(response);
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
                console.log(this.formData);
                this.$refs["dataForm"].validate(valid => {
                    if (valid) {
                        //this.formLoading = true;
                        let data = Object.assign({}, this.formData);
                        employeeedit(data)
                            .then(response => {
                                this.formLoading = false;
                                if (response.code) {
                                    this.$message.error(response.message);
                                    return false;
                                }
                                this.$message.success("操作成功");
                                this.formVisible = false;
                            })
                            .catch(() => {
                                this.formLoading = false;
                            });
                    }
                });

            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
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
                //修改
                document.title = "修改商品 - "+document.title;
                this.formData.id = this.$route.query.menuid;
                this.formMap.type = "edit";
                this.details();
            }else{
                //添加
                this.businesslist();
            }
        },
        destroyed(){
            document.title = "溯源码平台后台管理";
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
