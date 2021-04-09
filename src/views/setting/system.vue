<template>
    <div>
        <el-tabs v-model="activeName">
                <el-tab-pane label="tab1" name="first" :key="'first'">
                        <div style="background: yellow; display: inline">
                            tab1内容
                            tab1内容
                            tab1内容
                        </div>
                </el-tab-pane>

                <el-tab-pane label="前台条例设置" name="second" :key="'second'">
                        <div style="background: green; display: inline">
                            <el-form :model="formData">
                                <el-form-item label="商家须知" prop="content">
                                    <tinymce style="display: inline-block;width: 100%;" :height="300" v-model="formData.content"/>
                                </el-form-item>
                            </el-form>

                            <el-row>
                              <el-col :span="12"><div class="grid-content bg-purple">
                                <el-form :model="formDataproblem">
                                    <el-form-item label="标题" prop="content">
                                        <el-input v-model="formDataproblem.title"></el-input>
                                     </el-form-item>
                                    <el-form-item label="内容" prop="content">
                                        <tinymce style="display: inline-block;width: 100%;" :height="300" v-model="formData.content"/>
                                    </el-form-item>
                                </el-form>
                              </div></el-col>

                              <el-col :span="2"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>

                              <el-col :span="10"><div class="grid-content bg-purple-light">
                                <h3>模拟效果</h3>
                                <el-collapse  @change="handleChange">
                                  <el-collapse-item v-for="(item,index) in list" :title="test(item,index+1)" :name="index">
                                    <div>{{item.content}}</div>
                                  </el-collapse-item>
                                </el-collapse>

                              </div></el-col>
                            </el-row>


                        </div>
                </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import Tinymce from "../../components/Tinymce/index.vue";
    import {problem_list} from "@/api/pool";

    const formJson = {};
    export default {
        components: {
            Tinymce
        },
        data() {
            return {
                formDataproblem:{
                    title:"",
                },
                formData:{
                    content:""
                },
                activeNames: ['0'],
                list:[],
            }
    },
        methods:{
            test(row,index){
                return index+"."+row.title;
            },
            handleChange(val) {
                   console.log(val);
            },
            getlist(){
                problem_list()
                    .then(response=>{
                        this.list = response.data;
                    })
                    .catch(()=>{

                    });
            }
        },
        filters:{},
        mounted() {
        //
        },
        created() {
            this.getlist();
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
