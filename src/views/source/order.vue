<template>
  <div>
    <!-- start search -->
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.title" placeholder="订单编号"></el-input>
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
        label="溯源码数量"
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
            type="success"
            size="small"
            @click.native="handleForm(scope.row.order_number)"
            >批次详情</el-button>
          <el-button
            type="danger"
            size="small"
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
      width="30%"
      top="5vh"
    >
      <template>
        <el-table :data="orderData" style="width: 100%" v-loading="formLoading">
          <el-table-column prop="menu_id" label="商品名称" width="180">
          </el-table-column>
          <el-table-column prop="number" label="数量" width="180">
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
import { orderList } from "@/api/source/sourceapi.js";
import { order_demo } from "@/api/source/sourceapi.js";
import { orderdelete } from "@/api/source/sourceapi.js";
import { Loading } from "element-ui";
const formJson = {};
export default {
  data() {
    return {
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
    };
  },
  methods: {
    //方法
    // 显示表单
    handleForm(order_number) {
        this.formLoading = true
        this.formVisibledetails = true
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
      this.loading = false;
      orderList(this.query)
        .then((response) => {
          console.log(response);
          (this.order = response.data.list || 0),
            (this.total = response.data.total || 0);
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
    handleCurrentChange(val) {
      this.query.page = val - 1;
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
        this.$confirm('此操作将删除此批次的所有信息与溯源码, 是否继续?', '提示', {
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
