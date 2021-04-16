<template>
    <div>
        <el-row :gutter="20">

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">商家</span>
                <p class="bg-blue" style="float: right; padding: 3px 0">总</p>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
               <countTo class="number-box" :startVal='0' :endVal='panelinfo.business_count || 0' :duration='3500'></countTo>
               <span class="number-span">总计</span>
                  <!-- <div class="number-box"><span class="main-number">{{panelinfo.business_count||'0'}}</span>总计</div> -->
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="number-title">商家申请</span>
                    <!-- <p class="bg-blue" style="float: right; padding: 3px 0">总</p> -->
                    <el-button @click="goapply" style="float: right; padding: 3px 0" type="text">前往审核</el-button>
                </div>
                <countTo class="number-box" :startVal='0' :endVal='panelinfo.businessapply_count || 0' :duration='3500'></countTo>
                <span class="number-span">总计</span>
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">商品</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">总</p>
              </div>
                <countTo class="number-box" :startVal='0' :endVal='panelinfo.menu_count || 0' :duration='3500'></countTo>
                <span class="number-span">总计</span>
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">商品</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">月</p>
              </div>
                  <countTo class="number-box" :startVal='0' :endVal='panelinfo.menumonth_count || 0' :duration='3500'></countTo>
                  <span class="number-span">总计</span>
            </el-card>
        </div></el-col>


        <div style="margin-top: 1.25rem;">&nbsp;</div>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">用户</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">总</p>
              </div>
                  <countTo class="number-box" :startVal='0' :endVal='panelinfo.user_count || 0' :duration='3500'></countTo>
                  <span class="number-span">总计</span>
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">用户</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">月</p>
              </div>
                <countTo class="number-box" :startVal='0' :endVal='panelinfo.usermonth_count || 0' :duration='3500'></countTo>
                <span class="number-span">本月新增</span>
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">溯源查询</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">今</p>
              </div>
                  <countTo class="number-box" :startVal='0' :endVal='panelinfo.source_count || 0' :duration='3500'></countTo>
                  <span class="number-span">今日查询</span>
            </el-card>
        </div></el-col>

        <el-col :span="6"><div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="number-title">溯源查询</span>
               <p class="bg-blue" style="float: right; padding: 3px 0">月</p>
              </div>
                <countTo class="number-box" :startVal='0' :endVal='panelinfo.sourcemonth_count || 0' :duration='3500'></countTo>
                <span class="number-span">本月查询</span>
            </el-card>
        </div></el-col>
        </el-row>
        <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark index-border">&nbsp;</div></el-col>
        </el-row>



        <div class="echartsbox">
            <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
        </div>
    </div>
</template>

<script>
    import {getindex_data,getecharts_data} from "@/api/pool.js";
    import countTo from "vue-count-to";
    const formJson = {};
    const echartsoptions = {
        color: ['#5470C6', '#EE6666'],

        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data:['查询量', '用户量']
        },
        grid: {
            top: 70,
            bottom: 50,
            containLabel:true
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#EE6666',
                    }
                },
                axisPointer: {
                    label: {
                        // formatter: function (params) {
                        //     return '降水量  ' + params.value
                        //         + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        // }
                    }
                },
                //下面的X轴
                data: []
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#5470C6'
                    }
                },
                axisPointer: {
                    label: {
                        // formatter: function (params) {
                        //     return '降水量  ' + params.value
                        //         + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        // }
                    }
                },
                data: [],
                //上面的X周
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '查询量',
                type: 'line',
                xAxisIndex: 1,
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                data: []
            },
            {
                name: '用户量',
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series'
                },
                data: []
            }
        ]
    };
    export default {
        components: { countTo },
        data() {
            return {
                panelinfo:{},
                echartsdata:{},
                chartsoptions:echartsoptions,
                query:{
                    month:'',
                },

            }
    },
        methods:{
            goapply(){
                this.$router.push({
                    name:'商户申请管理',
                    params:{
                        verify_if:3,
                    }
                });
            },
            //echarts
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                // let echarts = require('echarts');
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption(this.chartsoptions);
                window.onresize = myChart.resize;
            },
            getcharts(){
                //表格数据
                getecharts_data(this.query)
                .then(response=>{
                    //console.log(this.chartsoptions)
                    this.echartsdata = response.data;
                    //待优化 这里循环速度慢
                    this.echartsdata.forEach((item,index)=>{
                        this.chartsoptions.xAxis[0].data.push(item.day);
                        this.chartsoptions.series[0].data.push(item.user_num);
                        this.chartsoptions.series[1].data.push(item.order_num);
                    })
                    //重新生成实例
                    this.drawLine();
                })
                .catch(()=>{

                });
            },
            paneldata(){
                //面板数据
                getindex_data()
                    .then(response=>{
                        console.log(response);
                        this.panelinfo = response.data;

                    })
                    .catch(()=>{

                    });
            },
        },
        filters:{},
        mounted() {
            this.drawLine();
        //
        },
        created() {
            this.paneldata();
            this.getcharts();


        }
};

</script>

<style type="text/scss" lang="scss">
    .echartsbox{
        margin-top:40px;

    }
    .bg-blue{
        border-radius: 0.225rem;
        font-size: 0.1rem;
        width: 30px;
        text-align: center;
        background-color: #0392e4;
        color: #FFFFFF;
    }
    .number-title{
        color: #6b6b6b;
        font-weight: bold;
    }
    .number-box{
        color: #6b6b6b;
        padding-right: 0.225rem;
        font-size: 2rem;

    }
    .number-span{
        padding-right: 0.225rem;
    }

</style>
