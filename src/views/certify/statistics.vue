<template>
    <div>
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple-dark">
            <el-table
                :data="list"
                stripe
                style="width: 100%">
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
                    label="商品名称"
                    prop="menu_name"
                    with="300"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    label="总查询次数"
                    prop="track"
                    with="300"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    label="首查查询次数"
                    prop="first_count"
                    with="300"
                    :show-overflow-tooltip="true">
                </el-table-column>
            </el-table>

          </div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-dark">
            <div id="myChartPercen" :style="{width: '100%', height: '400px'}"></div>
          </div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple-dark mt-10">
            <div id="myChartBar" :style="{width: '100%', height: '400px'}"></div>
          </div></el-col>
        </el-row>

    </div>

</template>

<script>
    import {sroucelogEcharts} from "@/api/source/sourceapi.js"
    const formJson = {};
    const echartBar = {
        legend: {},
        tooltip: {},
        dataset: {
            source: [
                ['product', '查询总次数', '首查查询次数'],
                ['商品1', 43.3, 85.8,12],
                ['商品2', 83.1, 73.4,12],
                ['商品3', 86.4, 65.2,23],
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
            {type: 'bar'},
            {type: 'bar'},
            // {type: 'bar'}
        ]
    };
    const echartPercen = {
        title: {
            text: 'Top10-商品查询占比',
            // subtext: '纯属虚构',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '查询占比',
                type: 'pie',
                radius: '50%',
                data: [
                    {value: 1048, name: '商品1'},
                    {value: 735, name: '商品2'},
                ],
                label: {
                      formatter: '{b}: {@2012} ({d}%)'
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    export default {
        data() {
            return {
                list:[],
                loading:false,
                chartsoptionsBar:echartBar,
                chartsoptionsPerson:echartPercen,

            }
    },
        methods:{
            //echarts
            drawBar(){
                // 基于准备好的dom，初始化echarts实例
                // let echarts = require('echarts');
                let myChartBar = this.$echarts.init(document.getElementById('myChartBar'))
                // 绘制图表
                myChartBar.setOption(this.chartsoptionsBar);
                window.onresize = myChartBar.resize;
            },
            drawPercen(){
                let myChartPercen = this.$echarts.init(document.getElementById('myChartPercen'))
                myChartPercen.setOption(this.chartsoptionsPerson);
                window.onresize = myChartPercen.resize;
            },
            getList(){
               this.loading = false;
               sroucelogEcharts(this.query)
                    .then(response => {
                        //console.log(response);
                        this.loading = false;
                        this.list = response.data.top_ten || [];
                        /*初始化*/
                        this.chartsoptionsBar.dataset.source = [];
                        this.chartsoptionsBar.dataset.source.push(['product', '查询总次数', '首查查询次数'])
                        this.list.forEach((item,index)=>{
                            this.chartsoptionsBar.dataset.source.push([item.menu_name,item.track,item.first_count]);
                        });
                        console.log(this.chartsoptionsBar)
                        //重新生成实例
                        this.drawBar();

                        console.log(this.list);
                    })
                    .catch(() => {
                        this.loading = false;
                        this.list = [];
                    });
            },

        },
        filters:{},
        mounted() {
            this.drawBar();
            this.drawPercen();
        //
        },
        created() {
            this.getList();

        }
};

</script>

<style type="text/scss" lang="scss">
</style>
