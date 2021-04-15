
<template>
  <div>
    <el-button type="primary" class="button" v-print="'#sourcebox'"
      >打印</el-button
    >
    <div
      id="qrcode"
      class="qrcode"
      ref="qrcodeContainer"
      style="display: none"
    ></div>
    <!-- <el-row>
      <el-col> -->
    <!-- <div class="qrcode" ref="qrcodeContainer"></div> -->
    <!--  <div class="qrcode" :ref="'qrcodeContainer'+index"></div> -->
    <!--startprint-->
    <div id="sourcebox">
      <div
        class="box"
        id="box"
        v-for="(item, index) in sourceCode"
        :key="index">
        <!--     <div :id="'qrCode'+index" :ref="'qrcodeContainer'+index"></div> -->
        <img :src="sourceSrc[index]" />
        <div style="margin-top: 10px"></div>
        <a :title="item">{{ item }}</a>
      </div>
    </div>
    <!--endprint-->
    <!-- </el-col>
    </el-row> -->
  </div>
</template>
<script>
import { ScodeList } from "@/api/source/sourceapi.js";
import QRCode from "qrcodejs2";
import { MY_CODE_URL } from "../../config/app";
const formJson = {
  id: "",
};
export default {
  data() {
    return {
      bannerUrl: "",
      sourceCode: [],
      sourceSrc: [],
      orderNumber: "",
      test2: {},
      qrcodetext: "",
    };
  },
  methods: {
    getbase(e) {
      console.log(e);
    },
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
          window.location.href = "#/source/order";
        });
    },
    html(value) {
      // console.log(value)
      ScodeList({ order_number: value })
        .then((response) => {
          console.log(response)
          if(response.code == 555){
            window.location.reload();
            this.$message({
              message: '订单号错误，请重试',
              type: 'warning'
            });

            return false;
          }  
          this.sourceCode = response.data;
          var count_qrcode = this.sourceCode.length;
          var tmpg = 0;
          var set_go = 5;
          var _this = this;
          const loading = this.$loading({
            lock: true,
            text: "正在生成二维码种请稍后...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          console.log(count_qrcode);
          var showcode = setInterval(function () {
            for (var i = tmpg; i < set_go; i++) {
              _this.makeqrcode(i);
            }
            tmpg += 5;
            set_go += 5;
            if (tmpg >= count_qrcode) {
              clearInterval(showcode);
              loading.close();
            }
          });
          var _this = this;
          _this.PrintRow();
        }, 100)
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });

    },
    makeqrcode(index) {
      let qrtext = MY_CODE_URL + "?source_code=" + this.sourceCode[index];
      this.$nextTick(() => {
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          // let qrcode = new QRCode(this.$refs.qrcodeContainer, {
          width: 100, // 二维码的宽
          height: 100, // 二维码的高
          text: qrtext, // 二维码的内容
          // text: "123", // 二维码的内容
          colorDark: "#000", // 二维码的颜色
          colorLight: "#fff",
          correctLevel: QRCode.CorrectLevel.H,
        });
        setTimeout(() => {
          let qwe = this.$refs.qrcodeContainer.innerHTML;
          console.log(qwe);
          var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
          let tmpSrc = patt.exec(qwe);
          // console.log(tmpSrc);
          this.sourceSrc[index] = tmpSrc[1];
          this.$forceUpdate();
          //document.getElementById("qrcode").innerHTML = "";
          // console.log("妙啊~");
          // console.log(this.sourceSrc);
        });
      });
    },
    smallcode(source,code,number) {
      for(var ii = 0;ii<number;ii++){
        this.sourceCode[ii] = source;
        this.sourceSrc[ii] = code;
      }
    },
    PrintRow(index, row) {
      this.$print(this.$refs.print); // 使用
    },
  },
  filters: {},
  props: {
    QRCodetext: {
      type: String, //类型限定
      default: "", //默认
    },
  },
  mounted() {
    // var qrcode = new QRCode(this.$refs.qrCodeUrl, {
    //         text: 'xxxx', // 需要转换为二维码的内容
    //         width: 100,
    //         height: 100,
    //         colorDark: '#000000',
    //         colorLight: '#ffffff',
    //         correctLevel: QRCode.CorrectLevel.H
    //     })
  },
  created() {
    if (typeof window.sessionStorage.order_number != "undefined") {
      var order_number = window.sessionStorage.getItem("order_number");
      window.sessionStorage.removeItem("order_number");
      this.html(order_number);
      // window.sessionStorage.removeItem("order_number");
    } else if (typeof window.sessionStorage.sourcecode_number != "undefined") {
      var source = window.sessionStorage.getItem("source");
      var sourcecode = window.sessionStorage.getItem("sourcecode");
      var sourcecode_number = window.sessionStorage.getItem("sourcecode_number");
      // console.log(sourcecode)
      // console.log(sourcecode_number)
      this.smallcode(source, sourcecode, sourcecode_number);
      window.sessionStorage.removeItem("sourcecode");
      window.sessionStorage.removeItem("sourcecode_number");
    } else {
      this.open();
    }

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
  text-align: center;
  border: 1px solid black;
  padding: 10px;
  width: 138px;
  height: 149px;
  float: left;
  margin: 3px;
}
</style>
