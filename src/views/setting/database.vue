<template>
    <div>
        <el-button :disabled="savedataBasechanger" type="primary" @click="savedataBase">备份数据库</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="getList">刷新</el-button>
        <el-button v-if="multipleSelection.length>0" type="danger" @click="handleFormdel(-1,-1)">批量删除</el-button>
        <el-table
                    v-loading="loading"
                    :data="list"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                         type="selection"
                         width="55">
                    </el-table-column>
                    <el-table-column
                        label="序号"
                        type="index"
                        fixed>
                    </el-table-column>
                    <el-table-column
                        label="文件名称"
                        prop="name"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                        <template slot-scope="scope">{{scope.row.name}}.sql</template>
                    </el-table-column>
                    <el-table-column
                        label="文件大小"
                        prop="size"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                        <template slot-scope="scope">{{scope.row.size | FilterSize}}</template>
                    </el-table-column>
    <!--                <el-table-column
                        align="center"
                        label="文件地址"
                        prop="track"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column> -->
                    <el-table-column
                        label="备份时间"
                        prop="curtime"
                        with="300"
                        :show-overflow-tooltip="true"
                        fixed>
                    </el-table-column>
                    <el-table-column
                        width="300"
                        label="操作"
                        fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click.native="handleFormdown(scope.$index, scope.row.time)">下 载</el-button>
                            <el-button type="danger" size="small" @click.native="handleFormdel(scope.$index, scope.row.time)">删 除</el-button>
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
    import {baseindex,basedump,basedown,basedel} from "@/api/pool.js";
    import {formatFileSize} from "@/utils/tool.js";
    const formJson = {};
    export default {
        data() {
            return {
                query: {
                    page: 1,
                    size: 10,
                },
                loading: true,
                list: [],
                total:0,
                savedataBasechanger:false,
                multipleSelection:[],
                delquery:{
                    time:"",
                    type:"",
                }
            }
    },
        methods:{
            // fileLengthFormat(total, n){
            //     var format;
            //     var len = total / (1024.0);
            //     if (len > 1000) {
            //         return arguments.callee(len, ++n);
            //     } else {
            //         switch (n) {
            //             case 1:
            //                 format = len.toFixed(2) + "KB";
            //                 break;
            //             case 2:
            //                 format = len.toFixed(2) + "MB";
            //                 break;
            //             case 3:
            //                 format = len.toFixed(2) + "GB";
            //                 break;
            //             case 4:
            //                 format = len.toFixed(2) + "TB";
            //                 break;
            //         }
            //         return format;
            //     }
            // },
            getList(){
                this.loading = false;
                baseindex(this.query)
                     .then(response => {
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
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
               this.query.page = val;
               this.multipleSelection = [];
               this.getList();
            },
            savedataBase(){
                basedump()
                    .then(response=>{
                        this.$message({
                                  message: "[备份数据库]任务成功提交到后台,请稍后刷新本页面.",
                                  type: 'success'
                                });
                        this.savedataBasechanger = true;

                    })
                    .catch(()=>{

                    });
            },
            handleFormdown(index,time){
                basedown({time:time})
                    .then(response=>{
                        const content = response
                        const blob = new Blob([content])
                        const fileName = this.list[index].name+".sql";

                        if ('download' in document.createElement('a')) { // 非IE下载
                            const elink = document.createElement('a')
                            elink.download = fileName
                            elink.style.display = 'none'
                            elink.href = URL.createObjectURL(blob)
                            document.body.appendChild(elink)
                            elink.click()
                            URL.revokeObjectURL(elink.href) // 释放URL 对象
                            document.body.removeChild(elink)
                        } else { // IE10+下载
                            navigator.msSaveBlob(blob, fileName)
                        }
                        })
                    .catch(()=>{
                        this.$message.error("系统发声未知错误,请稍后再试.");
                    });
            },
            handleFormdel(index,time){
                this.$confirm('此操作将永久删除备份文件, 是否继续?', '提示', {
                         confirmButtonText: '确定',
                         cancelButtonText: '取消',
                         type: 'warning'
                       }).then(() => {
                           if(index==-1){
                               time = "";
                               this.multipleSelection.forEach((item,index)=>{
                                   time = time+item.time+",";
                               });
                               time = time.substr(0, time.length - 1);
                               this.delquery.type = "list";
                           }else{
                               this.delquery.type = "";
                           }
                           this.delquery.time = time;
                           basedel(this.delquery)
                               .then(response=>{
                                   if(response.code!=200){
                                       this.$message.error("删除失败,请稍后再试");
                                       this.delquery = {
                                           time:"",
                                           type:"",
                                       };
                                       return;
                                    }
                                   this.$message({
                                     type: 'success',
                                     message: '删除成功!'
                                   });
                                   this.delquery = {
                                       time:"",
                                       type:"",
                                   };
                                   this.getList();
                               })
                               .catch(()=>{
                                   this.delquery = {
                                       time:"",
                                       type:"",
                                   };
                               });
                        }).catch(() => {
                            this.delquery = {
                               time:"",
                               type:"",
                            };
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                       });

            },

        },
        filters:{
            FilterSize(val){
                console.log(val)
                // console.log(this.fileLengthFormat(val,1))
                // return val;
                return formatFileSize(val,1);
            },
        },
        mounted() {
        //
        },
        created() {
            this.getList();
            // this.fileLengthFormat(,1)

        }
};

</script>

<style type="text/scss" lang="scss">
</style>
