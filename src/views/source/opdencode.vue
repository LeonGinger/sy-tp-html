<template>
  <div>
    <el-row>
      <el-col :span="2" v-for="(item, index) in sourceCode" :key="index">
        <div class="box">
          <div id="qrCode" ref="qrCodeDiv"></div>
          <a :title="item">{{ item }}</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ScodeList } from "@/api/source/sourceapi.js";
const formJson = {
  id: "",
};
export default {
  data() {
    return {
      bannerUrl: "",
      sourceCode: [],
      orderNumber: "",
    };
  },
  methods: {
    open() {
      this.$prompt("请输入批次编号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.orderNumber = value;
          this.html(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    html(value) {
      // console.log(value)
      ScodeList({ order_number: value })
        .then((response) => {
          this.sourceCode = response.data;
        })
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });
    },
  },
  filters: {},
  mounted() {
    //
    var qrcode = new QRCode(this.$refs.qrCodeUrl, {
            text: 'xxxx', // 需要转换为二维码的内容
            width: 100,
            height: 100,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        })
  },
  created() {
    this.open();
    // this.html();
  },
  destroyed() {
    document.title = "溯源码平台后台管理";
  },
};
</script>

<style type="text/scss" lang="scss">
.box {
  width: 100%;
  color: black;
  font-size: 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
