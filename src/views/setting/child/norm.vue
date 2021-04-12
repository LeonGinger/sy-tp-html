<template>
    <div class="child2">
        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple-dark">
          <p class="el-form-item__label">商家须知</p>
          </div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple-dark">

           <!-- <el-button type="primary" @click="addProblem">添加</el-button> -->
           <el-button type="primary" @click="editbnNotice">修改</el-button>
           <el-button type="success" @click="rebnNotice">恢复</el-button>
           <!-- <el-button type="primary" @click="delPorblem">删除</el-button> -->

           </div></el-col>
        </el-row>


        <el-form :model="formData" ref="dataForm">
            <el-form-item label="内容" prop="content">
                <tinymce ref="bntinymceedit" style="display: inline-block;width: 100%;" :height="300" v-model="formData.content"/>
            </el-form-item>
        </el-form>

        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple-dark">
           <p class="el-form-item__label">常见问题</p>
           </div></el-col>
           <el-col :span="24"><div class="grid-content bg-purple-dark">

            <el-button type="primary" @click="addProblem">添加</el-button>
            <el-button type="info" @click="clearProblem">清空</el-button>
            <el-button type="warning" @click="editPorblem">修改</el-button>
            <el-button type="danger" @click="delPorblem">删除</el-button>

            </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple">
            <el-form :model="formDataproblem" :rules="formDataproblem_rule" ref="problemformData">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formDataproblem.title"></el-input>
                 </el-form-item>
                <el-form-item label="内容" prop="content">
                    <tinymce ref="tinymceedit" style="display: inline-block;width: 100%;" :height="300" v-model="formDataproblem.content"/>
                </el-form-item>
            </el-form>
          </div></el-col>

          <el-col :span="2"><div class="grid-content bg-purple-light">&nbsp;</div></el-col>

          <el-col :span="10"><div class="grid-content bg-purple-light">
            <h3 class="h3problem">模拟效果</h3></br>
            <el-collapse  @change="handleChange" accordion>
              <el-collapse-item v-for="(item,index) in list" :title="test(item,index+1)" :name="index">
                <div v-html="item.content">{{item.content}}</div>
              </el-collapse-item>
            </el-collapse>

          </div></el-col>
        </el-row>


    </div>
</template>

<script>
    import Tinymce from "@/components/Tinymce/index.vue";
    import {problem_list,problem_add,problem_edit,problem_del,
            buNotice_index,buNotice_edit} from "@/api/pool";
    const formJson = {
        content:""
    };
    const problemJson = {
        id:"",
        title:"",
        content:"",
        onoff:"",
        orderid:"",
    };
    export default {
        components: {
            Tinymce
        },
        name:"child2",
        data() {
            return {
                formDataproblem:problemJson,
                formDataproblem_rule:{
                    title: [
                        {
                            required: true,
                            message: "请输入标题",
                            trigger: "blur"
                        },
                    ],
                    content: [
                        {
                            required: true,
                            message: "请输入内容",
                            trigger: "blur"
                        },
                    ]
                },
                formData:formJson,
                list:[],
                bnNoticelist:[],
            }
    },
        methods:{
            test(row,index){
                return index+"."+row.title;
            },
            handleChange(val) {
                   try{
                    this.formDataproblem = this.list[val];
                    this.$refs.tinymceedit.setContent(this.formDataproblem.content);
                   }catch(e){
                        this.clearProblem();
                       //TODO handle the exception
                   }

            },
            getbnNotice(){
                buNotice_index()
                    .then(response=>{
                        this.bnNoticelist = response.data.list;
                        /*!start one*/
                        // this.formData = response.data.list;
                        this.$refs.bntinymceedit.setContent(this.bnNoticelist.content);
                        /*end*/
                    })
                    .catch(()=>{});


            },
            editbnNotice(){
                this.$confirm('此操作将修改商家须知内容, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    /*is one*/
                    buNotice_edit({
                        id:1,
                        content:this.formData.content,
                        onoff:"",
                    })
                        .then(response=>{
                            if(response.code!=200){this.$message.error("修改失败,请稍后再试");return false;}
                            this.$message({
                                    showClose: true,
                                    message: '修改成功',
                                    type: 'success'
                            });


                        })
                        .cathc(()=>{});
                }).catch(() => {
                    return;
                });
            },
            rebnNotice(){
                /*is one checl*/
                this.$refs.bntinymceedit.setContent(this.bnNoticelist.content);
            },
            getlist(){
                problem_list()
                    .then(response=>{
                        this.list = response.data.list;
                    })
                    .catch(()=>{

                    });
            },
            clearProblem(){
                this.formDataproblem = problemJson;
                this.formDataproblem.content = "";
                this.formDataproblem.id = "";
                this.formDataproblem.onoff = "";
                this.formDataproblem.orderid = "";
                this.formDataproblem.title = "";
                this.$refs.tinymceedit.setContent("");
            },
            addProblem(){
                this.formDataproblem.orderid = this.list.length==0?1:this.list.length;
                this.$refs["problemformData"].validate(valid => {
                     if (valid) {
                         problem_add(this.formDataproblem)
                             .then(response=>{
                                 if(response.code!=200){this.$message.error("添加失败,请稍后再试");return false;}
                                 this.$message({
                                           showClose: true,
                                           message: '添加成功',
                                           type: 'success'
                                         });
                                 this.getlist();
                                 this.clearProblem();
                             })
                             .catch(()=>{
                                 this.clearProblem();
                                 this.$message.error("添加失败,请稍后再试");
                                 return false;
                             });
                     }
                });
            },
            editPorblem(){
                console.log(this.formDataproblem)
                if(!this.formDataproblem.id){this.$message.error("请从右边选择编辑项");return false;}
                problem_edit(this.formDataproblem)
                    .then(response=>{
                        if(response.code!=200){this.$message.error("添加失败,请稍后再试");return false;}
                        this.getlist();
                        this.clearProblem();
                        this.$message({
                                  showClose: true,
                                  message: '修改成功',
                                  type: 'success'
                                });
                    })
                    .catch(()=>{
                        this.$message.error("添加失败,请稍后再试");
                        return false;
                    });


            },
            delPorblem(){
                if(!this.formDataproblem.id){this.$message.error("请从右边选择编辑项");return false;}
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    problem_del({id:this.formDataproblem.id})
                        .then(response=>{
                            this.$message({
                                      showClose: true,
                                      message: '删除成功',
                                      type: 'success'
                                    });
                            this.getlist();
                            this.clearProblem();
                        })
                        .catch(()=>{
                            this.$message.error("添加失败,请稍后再试");
                            return false;
                        });

                }).catch(()=>{
                    return;
                });
            },
        },
        filters:{},
        mounted() {
        //
        },
        created() {
            this.getbnNotice();
            this.getlist();
        }
};

</script>

<style type="text/scss" lang="scss">
</style>
