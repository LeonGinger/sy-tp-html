<template>
  <div>
    <!-- start search -->
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.title" placeholder="批次编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.username" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="getList"
          ></el-button>
          <el-button type="primary" icon="search" @click="onSubmit"
            >查询</el-button
          >
          <el-button type="primary" icon="search" @click="where(1)" v-if="thismypc == false"
            >我创建的批次</el-button
          ><el-button type="primary" icon="search" @click="where(2)" v-if="thismypc == true"
            >恢复</el-button
          >
        </el-button-group>
        &nbsp;
        <!-- <el-button v-permission="'menu/menulist/add'" class="g-success" type="success" @click.native="handleForm(null,null)">新建订单</el-button> -->
        <el-button
          v-permission="'source/order/add'"
          class="g-success"
          type="success"
          @click="open"
          >新建批次</el-button
        >
        <!-- <el-button
          v-permission="'menu/menulist/del'"
          type="danger"
          @click.native="handleFormdell(null, null)"
          >删除</el-button
        > -->
      </el-form-item>
    </el-form>
    <!-- end search -->
    <el-table v-loading="loading" :data="order" style="width: 100%">
      <el-table-column label="序号" type="index" fixed> </el-table-column>
      <el-table-column
        label="ID"
        prop="id"
        with="50"
        :show-overflow-tooltip="true"
        fixed
      >
      </el-table-column>
      <!-- <el-table-column
                label="缩略图"
                >
                <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        src="http://qp9mr1fhs.hn-bkt.clouddn.com/img/xiangjiao.jpg">
                    </el-image>
                </template>
            </el-table-column> -->
      <el-table-column
        label="批次编号"
        prop="order_number"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label=""
        prop="order_number"
        with="50"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <i
            class="el-icon-copy-document"
            @click="copy(scope.row.order_number)"
          ></i>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        prop="create_time"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="user_name"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="溯源码总数量"
        prop="source_code_number"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="扫码总次数"
        prop="order_code_number"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column width="300" label="操作" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button  class="g-success" size="small" @click.native="handleDel(scope.$index, scope.row)">删 除</el-button> -->

          <!--  <el-dropdown @command="handleverif" class="g-left-d10">
                    <el-button size="small" type="primary" class="g-success" >
                        审 核<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">通 过</el-dropdown-item>
                        <el-dropdown-item command="2">拒 绝</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown> -->
          <el-button
            type="primary"
            size="small"
            @click.native="opdencode(scope.row.order_number)"
            >打印</el-button>
          <el-button
            type="success"
            size="small"
            @click.native="handleForm(scope.row.order_number)"
            >批次详情</el-button>
          <el-button
            type="danger"
            size="small"
            v-permission="'order/list/delete'"
            @click.native="orderdelete(scope.row.id,scope.$index)"
            >删 除</el-button>
          <!--  <el-button type="primary" size="small" @click.native="handleFormemployee(scope.row.company_id)">员 工</el-button> -->
          <!-- <el-button :type="scope.row.status | statusFilterType_handle" size="small" @click.native="handleFormstatus(scope.$index, scope.row)">{{scope.row.status | statusFilterName_handle}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="query.limit"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>

    <!-- 查看详情表单 -->
    <el-dialog
      :title="formMap[formName]"
      :visible.sync="formVisibledetails"
      :before-close="hideFormdetails"
      width="720px"
      top="5vh"
    >
      <template>
        <el-table :data="orderData" style="width: 100%" 
                  :expand-row-keys="sourceexpends" 
                  :row-key="getRowKeys"
                  v-loading="formLoading"  
                  @expand-change="zydescription" 
                  @row-dblclick="dbclickOrderdata">
          <el-table-column label="详情" width="140" type="expand">
            <!-- 每条商品的详情 -->
            <template slot-scope="props">
              <span style="color:#ff0000" @dblclick="dbclickOrderdata(props)">*(双击编辑信息)</span>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品名称" v-if="props.row.source.menu_name">
                  <el-input v-if="props.row.isOK" v-model="props.row.source.menu_name"></el-input>
                  <span v-if="!props.row.isOK" title="双击编辑信息">{{ props.row.source.menu_name }}</span>
                </el-form-item>
                <br>
                <el-form-item label="商品规格">
                  <!-- 1-{{props.row.isOK}} -->
                  <span v-if="!props.row.isOK">{{ props.row.source.menu_weight }}</span>
                  <!-- <el-input  v-if="props.row.isOK" v-model="props.row.source.menu_weight" @input="change($event)" maxlength="3"></el-input> -->
                  <el-row  v-if="props.row.isOK">
                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-input v-model="props.row.source.menu_weightt" @input="change($event)" maxlength="3"></el-input>
                    </div></el-col>
    
                    <el-col :span="12" style="width:120px;"><div class="grid-content bg-purple-light">
                        <el-select v-model="props.row.source.menu_weight" placeholder="请选择">
                            <el-option
                                v-for="item in optionsweight"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </div></el-col>
                  </el-row>
                
                
                
                </el-form-item>
                <br>
                <el-form-item label="生产源地">
                  <span v-if="!props.row.isOK">{{ props.row.source.menu_address }}</span>
                  <el-input v-if="props.row.isOK" v-model="props.row.source.menu_address"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="批次编号" v-if="props.row.source.order_number">
                  <span>{{ props.row.source.order_number }}</span>
                </el-form-item>
                <br>
                <el-form-item label="生产日期">
                  <span v-if="!props.row.isOK">{{ props.row.source.production_time }}</span>
                  <el-date-picker
                    v-if="props.row.isOK"
                    v-model="props.row.source.production_time"
                    type="date"
                    placeholder="选择生产日期">
                  </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item label="保质日期">
                  <span v-if="!props.row.isOK">{{ props.row.source.quality_time }}</span>
                  <el-row v-if="props.row.isOK">
                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-input v-model=" props.row.source.quality_timee" maxlength="4"></el-input>
                    </div></el-col>
                    <el-col :span="12" style="width:120px;"><div class="grid-content bg-purple-light">
                        <el-select v-model=" props.row.source.quality_time" placeholder="请选择">
                            <el-option
                                v-for="item in optionstime"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </div></el-col>
                  </el-row>
                </el-form-item>
                <br>
                <el-form-item label="入库时间" v-if="props.row.source.storage_time">
                  <span>{{ props.row.source.storage_time }}</span>
                </el-form-item>
                <br>
                <el-form-item label="操作员工" v-if="props.row.source.goto_user">
                  <span>{{ props.row.source.goto_user }}</span>
                </el-form-item>
                <br>
               <el-form-item label="出库时间" v-if="props.row.source.deliver_time">
                  <span>{{ props.row.source.deliver_time }}</span>
                </el-form-item>
                <br>
               <el-form-item label="用户扫码" v-if="props.row.source.scan_time">
                  <span>{{ props.row.source.scan_time }}</span>
                </el-form-item>
                <br>
               <el-form-item label="扫码次数" v-if="props.row.source.source_number">
                  <span>{{ props.row.source.source_number }}</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmitorderData(props)">{{props.row.isOK | ordertipsFilters}}</el-button>
                  <el-button v-if="props.row.isOK" @click="cancelSubmitOrderData(props)">取消</el-button>
                </el-form-item>
              </el-form>
            </template>
            <!-- END 详情 -->
          </el-table-column>
          <el-table-column prop="menu_id" label="商品名称" width="140">
          </el-table-column>
          <el-table-column prop="menu_weight" label="规格" width="140">
          </el-table-column>
          <el-table-column prop="number" label="数量" width="140">
          </el-table-column>
          <el-table-column prop="menu_number" label="个/箱"> </el-table-column>
        </el-table>
      </template>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click.native="formSubmit()"
          :loading="formLoading"
          >保 存</el-button
        >
        <el-button @click.native="hideFormdetails">取 消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { menulist } from "@/api/menu/menuAll.js";
import { orderList,order_demo,orderdelete } from "@/api/source/sourceapi.js";
import { Loading } from "element-ui";
const formJson = {};
export default {
  data() {
    return {
      sourceexpends:[],
      optionstime:[
          {
              value: '1',
              label: '年'
          },
          {
              value: '2',
              label: '月'
          },
          {
              value: '3',
              label: '日'
          },
          {
              value: '4',
              label: '季度'
          }
      ],
      optionsweight:[
          {
              value: '1',
              label: '个'
          },
          {
              value: '2',
              label: '箱'
          },
          {
              value: '3',
              label: 'L/升'
          },
          {
              value: '4',
              label: 'ML/毫升'
          },
          {
              value: '5',
              label: 'G/克'
          },
          {
              value: '6',
              label: 'KG/千克'
          },
          {
              value: '7',
              label: '公斤'
          },
          {
              value: '8',
              label: '斤'
          },
      ],
      orderDataTips:"修 改",
      formMap: {
        add: "新 增",
        edit: "编 辑",
      },
      formVisibledetails: false,
      formData: formJson,
      query: {
        title: "",
        page: 0,
        limit: 10,
      },
      loading: true,
      list: [],
      total: 0,
      dialogFormVisibleverif: false,
      formverif: {},
      formLabelverifWidth: "120px",
      formName: null,
      company_imgstyle: "{width: 100px; height: 100px;}",
      formLoading: false,
      order: [],
      orderData: [],
      thismypc: false
    };
  },
  methods: {
    getRowKeys(row){
      if(row.source==null){
        return [];
      }
      //通过getRowKeys方法获取到row的行id值
      return row.source.id
    },
    zydescription(row,expandedRows){
      //控制台报错的话是正常 因为 source null 渲染不出
      if(row.source==null){
        this.$message({
          showClose: true,
          message: "该批次还没有溯源信息",
          type: "warning",
        });
        return false
      }
      //每次限制展开一行
      const that = this
      if (expandedRows.length) {

        that.sourceexpends = []
        if (row) {
          // console.log("弹开")
          that.sourceexpends.push(row.source.id)
        }
      }else{
        // console.log("关闭")
        that.sourceexpends = []
      }
      //每次点击都恢复显示状态
      //code......
  
    },
    //方法
    //取消修改溯源信息
    cancelSubmitOrderData(row){
      console.log(row)
      this.orderDataTips = "修 改";
      const order_number = row.row.source.order_number
      this.formLoading = true;
      order_demo({order_number})
      .then((response) => {
        this.orderData = response.data
        this.formLoading=false
      })
      .catch(() => {
        
      });
      this.$nextTick(()=>{
          this.orderData[row.$index].isOK = false;
      })

    },
    //修改保存溯源信息
    onSubmitorderData(row){
      console.log(row)
      //修改
      
      if(this.orderDataTips=="修 改"){
        // console.log("走着？")
        // return;
        this.$set(this.orderData[row.$index], 'isOK', true)
        this.$nextTick(()=>{
            this.$set(this.orderData[row.$index], 'isOK', true)
        })
        this.orderDataTips = this.orderDataTips=="修 改"?"保 存":"修 改";
        //处理商品规格、保质日期
        //待优化循环 start
        if(this.orderData[row.$index].source.menu_weight){
            try{
                this.optionsweight.forEach((item,index)=>{
                    if(this.orderData[row.$index].source.menu_weight.indexOf(item.label)!=-1){
                        const tmp_weight = this.orderData[row.$index].source.menu_weight;
                        this.orderData[row.$index].source.menu_weight = item.label;
                        this.$set(this.orderData[row.$index].source, 'menu_weightt', tmp_weight.replace(item.label,""))
                    }
                })
            }catch(e){
                console.log("失败")

            }
        }
        if(this.orderData[row.$index].source.quality_time){
            //待优化循环
            this.optionstime.forEach((item,index)=>{
                if(this.orderData[row.$index].source.quality_time.indexOf(item.label)!=-1){
                  
                    const tmp_quality_time = this.orderData[row.$index].source.quality_time;
                    this.orderData[row.$index].source.quality_time = item.label;
                    this.$set(this.orderData[row.$index].source, 'quality_timee', tmp_quality_time.replace(item.label,""))
                }
            })
        }
        return;
      }
      //保存
      if(this.orderDataTips=="保 存"){
        //请求保存API
        // console.log(this.orderData[row.$index])
        // debugger
        //重新组合保质日期、商品规格
        this.orderData[row.$index].source.menu_weight = this.orderData[row.$index].source.menu_weightt + 
                                                        this.orderData[row.$index].source.menu_weight;
                                                        
        this.orderData[row.$index].source.quality_time = this.orderData[row.$index].source.quality_timee + 
                                                        this.orderData[row.$index].source.quality_time;
                                                        


        //END API
        this.$set(this.orderData[row.$index], 'isOK', false)
        this.$nextTick(()=>{
            this.$set(this.orderData[row.$index], 'isOK', false)
        })
        this.orderDataTips = this.orderDataTips=="修 改"?"保 存":"修 改";
      }
      
    },
    dbclickOrderdata(row){
      console.log(row)
      // if(row.isOK){
      this.$nextTick(()=>{
        this.$set(this.orderData[row.$index], 'isOK', this.orderData[row.$index].isOK =! this.orderData[row.$index].isOK)
      })
      this.$forceUpdate()
      // row.source.isOK =!row.source.isOK
      // }
      //  row.isOK =!row.isOK
    },
    // 显示表单
    handleForm(order_number) {
        this.formLoading = true
        this.formVisibledetails = true
        this.orderData = [];
        order_demo({order_number})
        .then((response) => {
          this.orderData = response.data
          this.formLoading=false
        })
        .catch(() => {
          
        });
    },
    handleFormstatus(index, row) {
      if (row.status == 1) {
        this.list[index].status = 2;
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
      } else {
        this.list[index].status = 1;
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
      }
    },
    //员工
    handleFormemployee(employee_id) {
      this.$router.push({
        name: "员工管理",
        params: {
          employee_id: employee_id,
        },
      });
    },
    // 刷新表单
    resetForm() {
      if (this.$refs["dataForm"]) {
        // 清空字段
        this.$refs["dataForm"].resetFields();
        // 清空验证信息表单
        this.$refs["dataForm"].clearValidate();
      }
    },
    onReset() {
      this.$router.push({
        path: "",
      });
      this.query = {
        title: "",
        page: 0,
        limit: 10,
      };
      this.getList();
    },
    getList() {
      this.loading = true;
      orderList(this.query)
        .then((response) => {
          console.log(response);
          (this.order = response.data.list || 0),
          (this.total = response.data.total || 0);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });
    },
    onSubmit() {
      //查询
      this.query.order_number = this.query.title
      this.getList();
    },
    where(key){
      if(key == 1){
        this.query.thismy = true
        console.log(this.query)
        this.getList()
        this.thismypc = true
      }else if(key == 2){
        this.query.thismy = false
        this.getList()
        this.thismypc = false
      }
      
    },
    handleCurrentChange(val) {
      this.query.page = (val - 1)*10;
      // this.query.limit = this.query.page + 10;
      this.getList();
    },
    handleverif(command) {
      if (command == "1") {
        //接受
      }
      if (command == "2") {
        //拒绝
        this.dialogFormVisibleverif = true;
      }
    },
    onSubmitverif() {
      //审核不通过
    },
    // 隐藏表单
    hideFormdetails() {
      // 更改值
      this.formVisibledetails = !this.formVisibledetails;
      return true;
    },
    formSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.formLoading = true;
          let data = Object.assign({}, this.formData);
          adSave(data, this.formName)
            .then((response) => {
              this.formLoading = false;
              if (response.code) {
                this.$message.error(response.message);
                return false;
              }
              this.$message.success("操作成功");
              this.formVisible = false;
              if (this.formName === "add") {
                // 向头部添加数据
                data.ad_id = response.data.ad_id;
                this.list.unshift(data);
              } else {
                this.list.splice(this.index, 1, data);
              }
            })
            .catch(() => {
              this.formLoading = false;
            });
        }
      });
    },
    opdencode(this_order_number){
      var _this = this
      _this.$router.push({
          path:'opdencode',
          query:{
              order_number:this_order_number,
              order_total:0
          }
      })
    },
    open() {
      window.location.href = "#/source/orderadd";
    },
    copy(order_number) {
      var copylist = order_number;
      var ele = document.createElement("input"); //创建一个input标签
      ele.setAttribute("value", copylist); // 设置改input的value值
      document.body.appendChild(ele); // 将input添加到body
      ele.select(); // 获取input的文本内容
      document.execCommand("copy"); // 执行copy指令
      document.body.removeChild(ele); // 删除input标签
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    orderdelete(id,index){
      // orderdelete({order_id:id})
      //   .then((response) => {
      //     // console.log(response);s
      //     (this.order = response.data.list || 0),
      //       (this.total = response.data.total || 0);
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //     this.list = [];
      //     this.total = 0;
      //   });
        this.$confirm('此操作将删除此批次的所有信息与溯源码,此操作不可逆转！ 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderdelete({order_id:id})
          .then((response) => {
            if(response.code!=200){this.$message.error(response.message);}
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.order.splice(index,1);
          })
          .catch(() => {
            this.loading = false;
            this.list = [];
            this.total = 0;
            this.$message.error("系统出了点问题,请稍后再试");
          });
        }).catch(() => {

        });
    }
  },
  filters: {
    statusFilterType(status) {
      const statusMap = {
        1: "success",
        2: "danger",
      };
      return statusMap[status];
    },
    statusFilterName(status) {
      const statusMap = {
        1: "正常",
        2: "冻结",
      };
      return statusMap[status];
    },
    //相反操作按钮
    statusFilterType_handle(status) {
      const statusMap = {
        1: "danger",
        2: "success",
      };
      return statusMap[status];
    },
    statusFilterName_handle(status) {
      const statusMap = {
        1: "冻结",
        2: "解冻",
      };
      return statusMap[status];
    },
  },
  filters: {
    ordertipsFilters(row){
        if(!row){return "修 改";}
        return "保 存";
    },
  },
  mounted() {
    //
  },
  created() {
    //
    // 加载表格数据
    this.getList();
  },
};
</script>

<style type="text/scss" lang="scss">
.image_p {
  position: absolute;
  text-align: left;
  width: 226px;
  top: -2.2rem;
}
/deep/.enterprise_logo {
  margin-left: 64px;
}
.el-icon-copy-document:hover {
  color: #147cd4;
  cursor: pointer;
}
</style>
