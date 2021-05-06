<template>
    <div>
        <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark">
            <el-button-group>
                <el-button type="primary" @click="legendgo">{{legendTips}}</el-button>
            </el-button-group>
            </div></el-col>
        </el-row>

        <el-row v-show="legendChanger">
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
          <el-col :span="24"><div class="grid-content bg-purple-dark">&nbsp;</div></el-col>
          <el-col :span="24"><div class="grid-content bg-purple-dark mt-10">
            <div id="myChartBar" :style="{width: '100%', height: '400px'}"></div>
          </div></el-col>
        </el-row>

            <el-row v-show="!legendChanger">
            <el-col :span="24"><div class="grid-content bg-purple-dark">
                <div class="area-tipbox">
                    <h1 class="area-h1">全国扫码累计次数:</h1>
                    <countTo class="number-box" :startVal='0' :endVal='areatotal || 0' :duration='3500'></countTo>
                </div>
            </div></el-col>

       <!-- <el-row v-show="!legendChanger"> -->
             <el-col :span="24"><div class="grid-content bg-purple">
              <div id="ChartChina" :style="{width: '800px', height: '710px'}"></div>
             </div></el-col>
             <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>

        </el-row>

    </div>

</template>

<script>
    import {sroucelogEcharts,srouceareaEcharts} from "@/api/source/sourceapi.js";
    import countTo from "vue-count-to";
    import 'echarts/map/js/china.js';
    // import '@/utils/china.js';
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
                    {value: 999, name: '暂无'},
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
    const echartMap = {
        visualMap: {           //地图图例
          show:true,
          left: 26,
          bottom: 40,
          showLabel:true,
          pieces: [        //根据数据大小，各省显示不同颜色
            {
              gte: 100,
              label: ">= 1000",
              color: "#1f307b"
            },
            {
              gte: 500,
              lt: 999,
              label: "500 - 999",
              color: "#3c57ce"
            },
            {
              gte: 100,
              lt:499,
              label: "100 - 499",
              color: "#6f83db"
            },
            {
              gte: 10,
              lt: 99,
              label: "10 - 99",
              color: "#9face7"
            },
            {
              lt:10,
              label:'<10',
              color: "#bcc5ee"
            }
          ]
        },
        geo: {                 //中国地图设置
          map: "china",
          scaleLimit: {
            min: 1,
            max: 2
          },
          zoom: 1,
          top: 120,
          label: {
            normal: {
              show:true,
              fontSize: "14",
              color: "rgba(0,0,0,0.7)"
            }
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)"
            },
            emphasis: {
              areaColor: "#f2d5ad",
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0
            }
          }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>扫码次数:{c}'
        },
        series: [
          {
            name: "地区查询次数统计",
            type: "map",
            geoIndex: 0,
            data:[
                {
                name: "浙江",
                value: 599, //  项目数量
                perf: "60%", // 项目占比
              },
            ]
          }
        ]
      };

    export default {
        components: { countTo },
        data() {
            return {
                legendChanger:true,
                legendTips:"切换到区域",
                list:[],
                listarea:[],
                loading:false,
                chartsoptionsBar:echartBar,
                chartsoptionsPerson:echartPercen,
                chartsoptionsMap:echartMap,
                areatotal:0,

            }
    },
        methods:{
            legendgo(){
                if(this.legendChanger){
                    this.legendChanger = false;
                    this.legendTips = "切换图表";
                    this.getareadata();
                    // this.drawMap();
                }else{
                    this.legendChanger = true;
                    this.legendTips = "切换到区域";
                    this.getList();
                    // this.drawBar();
                    // this.drawPercen();
                }
            },
            //echarts
            drawMap(){
                //加载echarts的代码
                let myChartMap = this.$echarts.init(document.getElementById('ChartChina'));
                myChartMap.setOption(this.chartsoptionsMap);
                window.onresize = myChartMap.resize;
            },
            drawBar(){
                // 基于准备好的dom，初始化echarts实例
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
                        /*饼图*/
                        this.chartsoptionsPerson.series[0].data = [];

                        this.list.forEach((item,index)=>{
                            this.chartsoptionsBar.dataset.source.push([item.menu_name,item.track,item.first_count]);
                            this.chartsoptionsPerson.series[0].data.push({name:item.menu_name,value:item.track});
                        });
                        //重新生成实例
                        this.drawBar();
                        this.drawPercen();

                    })
                    .catch(() => {
                        this.loading = false;
                        this.list = [];
                    });
            },
            getareadata(){
                this.loading = false;
                srouceareaEcharts(this.query)
                     .then(response => {
                         //console.log(response);
                         this.loading = false;
                         this.listarea = response.data.list || [];
                         this.areatotal = parseInt(response.data.total_search);
                         if(this.listarea.length>0){
                            this.chartsoptionsMap.series[0]['data'] = [];
                            this.listarea.forEach((item,index)=>{
                                this.chartsoptionsMap.series[0]['data'].push({'name':item.province,'value':item.track,'perf':item.track})
                            });
                         }

                         this.drawMap();
                     })
                     .catch(() => {
                         this.loading = false;
                     });
            },
        },
        filters:{},
        mounted() {
            // this.drawBar();
            // this.drawPercen();
            // this.drawMap();
        //
        },
        created() {
            this.getList();
            this.getareadata();

        }
};

</script>
<style lang="less" scoped>
        .area-h1{
            color: #303133;
            display: contents;
            margin-top: 20px;
        }
        .number-box{
            display: inline-block;

        }


</style>
