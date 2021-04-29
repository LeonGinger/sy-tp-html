<template>
  <div>
    <!-- start search -->
    <el-form :inline="true" :model="query" class="query-form" size="mini">
      <el-form-item class="query-form-item">
        <el-input v-model="query.name" placeholder="企业名称"></el-input>
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
          <!--   <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button> -->
        </el-button-group>
      </el-form-item>
    </el-form>
    <!-- end search -->
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="序号" type="index" fixed> </el-table-column>
      <el-table-column
        label="企业ID"
        prop="id"
        with="300"
        :show-overflow-tooltip="true"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="企业名称"
        prop="business_name"
        with="300"
        :show-overflow-tooltip="true"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="法定代表人"
        prop="responsible_name"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="申请人ID">
        <template slot-scope="scope">
          {{ scope.row.boss_user | bossFiltersId }}
        </template>
      </el-table-column>
      <el-table-column label="申请人姓名">
        <template slot-scope="scope">
          {{ scope.row.boss_user | bossFiltersName }}
        </template>
      </el-table-column>
      <!--            <el-table-column
                label="申请人姓名"
                prop="username"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column> -->
      <el-table-column
        label="联系电话"
        prop="responsible_phone"
        with="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilterType">{{
            scope.row.state | statusFilterName
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="资料审核状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.verify_if | verifyFilterType">{{
            scope.row.verify_if | verifyFilterName
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="300" label="操作" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button  class="g-success" size="small" @click.native="handleDel(scope.$index, scope.row)">删 除</el-button> -->
          <el-dropdown @command="handleverif" class="g-left-d10">
            <el-button size="small" type="primary" class="g-success">
              审 核<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="formverifBininfo(scope.row, '1')"
                >通 过</el-dropdown-item
              >
              <el-dropdown-item :command="formverifBininfo(scope.row, '2')"
                >拒 绝</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            type="warning"
            size="small"
            @click.native="handleForm(scope.$index, scope.row)"
            >查 看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size="query.size"
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
      width="85%"
      top="5vh"
    >
      <el-form
        label-position="right"
        label-width="120px"
        :model="formData"
        :rules="formRules"
        ref="dataForm"
      >
        <el-row>
          <el-col :span="1"
            ><div class="grid-content bg-purple">&nbsp;</div></el-col
          >
          <!-- 左边 -->
          <el-col :span="10"
            ><div class="grid-content bg-purple">
              <!-- 商户信息 -->
              <!--                   <el-form-item label="营业执照" prop="pic">
                        <el-image
                          style="width: 226px; height: 226px;"
                          :src="url"
                          :fit="fit"></el-image>
                   </el-form-item> -->
              <el-form-item label="商户名称" prop="title">
                <el-input
                  v-model="formData.business_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="商户地址" prop="title">
                <el-input
                  v-model="formData.business_address"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="商家姓名" prop="title">
                <el-input
                  v-model="formData.responsible_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="title">
                <el-input
                  v-model="formData.responsible_phone"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <!-- 用户信息 -->
              <!-- <el-form-item label="申请人ID" prop="title">
                <el-input
                  disabled="disabled"
                  v-model="formData.boss_user.id"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="title">
                <el-input
                  v-model="formData.boss_user.username"
                  auto-complete="off"
                ></el-input>
              </el-form-item> -->
              <el-form-item label="申请时间" prop="title">
                <el-date-picker
                  v-model="formData.create_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="default_time"
                >
                </el-date-picker>
              </el-form-item></div
          ></el-col>
          <el-col :span="1"
            ><div class="grid-content bg-purple">&nbsp;</div></el-col
          >
          <!-- 右边 -->
          <el-col :span="10"
            ><div class="grid-content bg-purple-light">
              <el-form-item label="" prop="pic" class="enterprise_logo">
                <!--                  <el-image
                            style="width: 226px; height: 226px;"
                            :src="url"
                            :fit="fit"></el-image> -->
                <span>商户证书(<span style="color : red;">点击图片查看</span>)</span>
                <swiper
                  class="swiper swiper-cer"
                  ref="mySwiper"
                  :options="swiperOption"
                >
                  <swiper-slide
                    v-for="(img, index) in swiperImgappraisal"
                    :key="index"
                  >
                    <!-- 测试 -->
                    <!--                                <swiper-slide  v-for="(img,index) in swiperImglist" :key="index"> -->
                    <img
                      @click="handlePictureCardPreview(img)"
                      class="swiperimg"
                      :src="img" style="cursor:pointer"
                    />
                  </swiper-slide>
                  <div
                    class="swiper-pagination swiper-pagination-bullets"
                    slot="pagination"
                  ></div>
                </swiper>
              </el-form-item>

              <!--                        <el-form-item label="营业执照" prop="pic">
                            <div>
                                <el-input size="small" v-model="formData.pic" auto-complete="off" placeholder="图片路径"></el-input>
                                <upload ext="jpg,png,jpeg" :size="716800"  @on-select="onSelectPic"></upload>
                            </div>
                            <div class="upload-img" v-if="formData.pic_url">
                                <img :src="formData.pic_url" style="max-width: 200px;max-height: 200px;">
                            </div>
                        </el-form-item> -->

              <!--             <el-form-item label="信用代码" prop="title">
                            <el-input v-model="formData.business_code" auto-complete="off"></el-input>
                        </el-form-item> -->
              <el-form-item label="法定代表人" prop="title">
                <el-input
                  v-model="formData.responsible_name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>

              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.state">
                  <el-radio :label="'1'">正常</el-radio>
                  <el-radio :label="'2'">冻结</el-radio>
                </el-radio-group>
              </el-form-item>
            </div></el-col
          >
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="false"
          type="primary"
          @click.native="handleInfo(formData.id)"
          >更多资料</el-button
        >
        <el-dropdown @command="handleverif" class="g-left-d10">
          <el-button type="primary" class="g-success">
            审 核<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="formverifBininfo(formData, '1')"
              >通 过</el-dropdown-item
            >
            <el-dropdown-item :command="formverifBininfo(formData, '2')"
              >拒 绝</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          type="primary"
          @click.native="formSubmit()"
          :loading="formLoading"
          >保 存</el-button
        >
        <el-button @click.native="hideFormdetails">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核拒绝表单 -->
    <el-dialog title="审核不通过" :visible.sync="dialogFormVisibleverif">
      <el-form :model="formverif" ref="formverif">
        <el-form-item label="原因:" :label-width="formLabelverifWidth">
          <el-input
            require
            v-model="formverif.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleverif = false">取 消</el-button>
        <el-button type="primary" @click="verifstate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { DOMAIN_URL } from "@/config/app.js";
import {
  enterpriseList,
  employeestate,
  employeeupdate,
} from "@/api/enterprise/enterprise";
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import time from "@/utils/utils.filter.js";
const formJson = {
  appraisal_image: "",
  business_name: "",
  company_id: "",
  id: "",
  mobile: "",
  responsible_name: "",
  status: "",
  user_id: "",
  username: "",
  boss_user: {
    id: "",
    username: "",
  },
};
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      defaultImgappraisal: DOMAIN_URL + "/static/images/loseimg1.png", //默认的商家证书模板
      swiperImglist: [
        "http://sy.zsicp.com/static/images/bg1.jpg",
        "http://sy.zsicp.com/static/images/bg2.jpg",
        "http://sy.zsicp.com/static/images/bg3.jpg",
      ],
      swiperOption: {
        // direction: 'vertical',
        // autoplay:true,
        // loop:true,
        // slidesPerView: 1,
        // spaceBetween: 30,
        // setWrapperSize: true,
        // mousewheel: true,
        autoHeight: true,
        height: 300,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom">${
              index + 1
            }</span>`;
          },
        },
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
      },
      formMap: {
        add: "新 增",
        edit: "审 核",
      },
      formVisibledetails: false,
      formData: formJson,
      query: {
        type: "apply",
        name: "",
        page: 1,
        size: 10,
        // verify_if:'3',
      },
      loading: true,
      list: [],
      total: 0,
      dialogFormVisibleverif: false,
      formverif: {
        id: "",
        verify_if: "",
        content: "",
      },
      formLabelverifWidth: "120px",
      formName: null,
      company_imgstyle: "{width: 100px; height: 100px;}",
      formLoading: false,
      default_time: "",
      fit: "contain",
      formRules: {},
      dialogVisible: false,
      dialogImageUrl: "",
      swiperImgappraisal: [],
    };
  },
  methods: {
    //方法
    //
    formverifBininfo(row, command) {
      return {
        row: row,
        command: command,
      };
    },
    // 显示表单
    handleForm(index, row) {
      console.log(row);
      // console.log(row);
      // console.log(index);
      this.formVisibledetails = true;
      // 刷新表单
      this.resetForm();
      this.formData = JSON.parse(JSON.stringify(formJson));

      if (row !== null) {
        this.formData = Object.assign({}, row);
        //商家证书
        try {
          this.swiperImgappraisal = JSON.parse(
            this.formData.business_appraisal[0].appraisal_image
          );
        } catch (e) {}
      }

      /*注册人为空-之后可删除*/
      if (this.formData.boss_user == null) {
        this.formData.boss_user = {
          id: "",
          username: "",
        };
      }

      this.formName = "add";
      if (index !== null) {
        this.index = index;
        this.formName = "edit";
      }
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
        page: 1,
        size: 10,
      };
      this.getList();
    },
    getList() {
      this.loading = false;
      enterpriseList(this.query)
        .then((response) => {
          console.log(response);
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
    onSubmit() {
      //查询
      this.$router.push({
        path: "",
        query: this.query,
      });
      this.getList();
    },
    handleCurrentChange(val) {
      this.query.page = val;
      this.getList();
    },
    handleverif(command) {
      if (command.command == "1") {
        //接受
        this.formverif.id = command.row.id;
        this.formverif.verify_if = 1;
        this.verifstate();
      }
      if (command.command == "2") {
        //拒绝
        this.formverif.id = command.row.id;
        this.formverif.verify_if = 2;
        this.dialogFormVisibleverif = true;
        return;
      }
      //
    },
    verifstate() {
      if (this.formverif.verify_if == 2 && this.formverif.content == "") {
        this.$message.error("不通过原因必须");
        return false;
      }

      const tips = this.formverif.verify_if == 1 ? "审核通过" : "审核不通过";
      var _this = this
      employeestate(this.formverif)
        .then((response) => {
          if (response.code == 12138) {
            this.$message({
              showClose: true,
              type: "warning",
              message: response.message,
            });
            setTimeout(()=>{
                _this.getList()
            }, "1000");
            return false;
          }
          this.$message({
            showClose: true,
            type: "success",
            message: tips,
          });
            setTimeout(()=>{
                _this.getList()
            }, "1000");
        })
        .catch(() => {
          this.$message.error("审核失败");
        });
      this.formverif = {};
      this.dialogFormVisibleverif = false;
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
          if (typeof data.create_time == "object") {
            data.create_time = time.formatDateTime(data.create_time);
          }
          employeeupdate({
            business_address: data.business_address,
            business_appraisal_id: data.business_appraisal_id,
            business_introduction: data.business_introduction,
            business_name: data.business_name,
            grant_code: data.grant_code,
            id: data.id,
            // img_info: null
            responsible_name: data.responsible_name,
            responsible_phone: data.responsible_phone,
            state: data.state,
            create_time: data.create_time,
          })
            .then((response) => {
              this.formLoading = false;
              if (response.code != 200) {
                this.$message.error(response.message);
                this.getList();
                return false;
              }
              this.$message.success("操作成功");
              this.formVisible = false;
            })
            .catch(() => {
              this.$message.error("操作失败");
              this.formLoading = false;
            });
          this.getList();
        }
      });
    },

    handleInfo(id) {
      this.$router.push({
        name: "信息管理",

        params: {
          business_id: id,
        },
      });
    },
    handlePictureCardPreview(url) {
          // if(is_url){
          this.dialogImageUrl = url;
          // }else{
          //     this.dialogImageUrl = file.url;
          // }
          this.dialogVisible = true;
        },
    errorImg() {
      let img = event.srcElement;
      img.src = this.defaultImgappraisal;
      img.onerror = null; //防止闪图
    },
  },
  filters: {
    bossFiltersId(boss_user) {
      if (!boss_user) {
        return "无";
      }
      return boss_user.id;
    },
    bossFiltersName(boss_user) {
      if (boss_user == null) {
        return "无";
      }
      return boss_user.username;
    },
    verifyFilterType(status) {
      const statusMap = {
        0: "gray",
        1: "success",
        2: "danger",
        3: "primary",
        undefined: "无",
      };
      return statusMap[status];
    },
    verifyFilterName(status) {
      const statusMap = {
        0: "默认",
        1: "通过",
        2: "不通过",
        3: "待审核",
        undefined: "无",
      };
      return statusMap[status];
    },
    statusFilterType(status) {
      const statusMap = {
        0: "gray",
        1: "success",
        2: "danger",
        undefined: "无",
      };
      return statusMap[status];
    },
    statusFilterName(status) {
      const statusMap = {
        0: "默认",
        1: "正常",
        2: "冻结",
        undefined: "无",
      };
      return statusMap[status];
    },
  },
  mounted() {},
  created() {
    this.default_time = time.timeTodate("H:i:s", Date.parse(new Date()));
    if (this.$route.params.verify_if) {
      this.query.verify_if = this.$route.params.verify_if;
    }
    // 加载表格数据
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.image_p {
  position: absolute;
  text-align: left;
  width: 226px;
  top: -2.2rem;
}
::v-deep.enterprise_logo {
  margin-left: 64px;
}
.swiper-cer {
  height: 226px;
}
.swiperimg {
  width: 100%;
}
</style>
