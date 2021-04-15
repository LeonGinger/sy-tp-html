<template>
    <div>
        <el-button type="primary" @click="savedataBase">备份数据库</el-button>
        <el-table
                    v-loading="loading"
                    :data="list"
                    style="width: 100%;">
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
    import {fileLengthFormat} from "@/utils/tool.js";
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


            }
    },
        methods:{
            getList(){
                this.loading = false;
                baseindex(this.query)
                     .then(response => {
                         //console.log(response);
                         this.loading = false;
                         this.list = response.data.list || [];
                         this.total = response.data.total || 0;
                         console.log(this.list);
                     })
                     .catch(() => {
                         this.loading = false;
                         this.list = [];
                         this.total = 0;
                     });

            },
            handleCurrentChange(val) {
               this.query.page = val;
               this.getList();
            },
            savedataBase(){

            },
            handleFormdown(index,time){
                basedown({time:time})
                    .then(response=>{
               const content = response
                    const blob = new Blob([content])
                    const fileName = '导出信息.xlsx'
                    
                         navigator.msSaveBlob(blob, fileName)
                         return;
                    
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



                        //if(response.code!=200){this.$message.error("删除失败,请稍后再试");}
                    })
                    .catch(()=>{

                    });
            },
            handleFormdel(index,time){
                basedel({time:time})
                    .then(response=>{
                        if(response.code!=200){this.$message.error("删除失败,请稍后再试");}
                        this.getList();
                    })
                    .catch(()=>{

                    });
            },

        },
        filters:{
            FilterSize(val){
                console.log(val)
                return fileLengthFormat(val,1);
            },
        },
        mounted() {
        //
        },
        created() {
            this.getList();

        }
};

</script>

<style type="text/scss" lang="scss">
</style>
