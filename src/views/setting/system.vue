<template>
    <div>
        <el-tabs v-model="activeName">
                <el-tab-pane label="基础设置" name="first" :key="'first'">
                        <div style="background: yellow; display: inline">
                            <child1></child1>
                        </div>
                </el-tab-pane>

                <el-tab-pane label="前台条例设置" name="second" :key="'second'">
                        <div style="background: green; display: inline">
                            <child2></child2>
                        </div>
                </el-tab-pane>

                <el-tab-pane label="商品单位设置" name="four" :key="'four'">
                        <div style="background: green; display: inline">
                            <child3></child3>
                        </div>
                </el-tab-pane>

                <el-tab-pane label="常用工具" name="third" :key="'third'">
                        <div style="background: green; display: inline">
                            <el-row>
<!--                              <el-button>默认按钮</el-button> -->
                              <el-button type="primary" @click="cearcache">清理缓存</el-button>
       <!--                       <el-button type="success">成功按钮</el-button>
                              <el-button type="info">信息按钮</el-button>
                              <el-button type="warning">警告按钮</el-button>
                              <el-button type="danger">危险按钮</el-button> -->
                            </el-row>
                        </div>
                </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import child1 from "@/views/setting/child/base.vue";
    import child2 from "@/views/setting/child/norm.vue";
    import child3 from "@/views/setting/child/setunit.vue";
    export default {
        components: {
            child1,
            child2,
            child3
        },
        data() {
            return {
                activeName: 'first',
                clearchanger:true,
            }
    },
        methods:{
            cearcache(){
                if(!this.clearchanger){this.$message('完成');return;}
                this.$message('正在清理缓存......');
                /**
                 * API......
                 * */
                setTimeout(()=>{
                    this.$message({
                      message: '清理完成',
                      type: 'success'
                    });
                    this.clearchanger = false;
                },2000)


            },
        },
        filters:{},
        mounted() {
        //
        },
        created() {
        }
};

</script>

<style type="text/scss" lang="scss">
    .problem{
        color: #000000;
    }
    .h3problem{
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
    }
</style>
