
<template>
  <div>
    <!-- <div>
      <vue-qr :correctLevel="3" :autoColor="false" colorDark="#000" :text="codeUrl" :size="60" :margin="0" :logoMargin="3"></vue-qr>
    </div> -->
    <el-button type="primary" class="button" v-print="'#sourcebox'"
      >打印</el-button
    >
    <div
      id="qrcode"
      class="qrcode"
      ref="qrcodeContainer"
      style="display:none;"
    ></div>
    <!-- <el-row>
      <el-col> -->
    <!-- <div class="qrcode" ref="qrcodeContainer"></div> -->
    <!--  <div class="qrcode" :ref="'qrcodeContainer'+index"></div> -->
    <!--startprint-->
    <div id="sourcebox">
      <div
        v-for="(item, index) in sourceCode"
        :key="index">
        <div
         class="box"
         id="box"
         v-for="(itemm, indexx) in item.source_number"
        :key="indexx">
        <!--     <div :id="'qrCode'+index" :ref="'qrcodeContainer'+index"></div> -->
        <!-- <img :src="sourceSrc[index]" style="width:15mm;height:15mm"/> -->
          <template>
            <vue-qr 
              :correctLevel="1" 
              :binarizeThreshold="255"
              :autoColor="false" 
              colorDark="#147" 
              :text="sourceSrc[index]" 
              :size="100" 
              :margin="0"></vue-qr>
          </template>
        <div style="margin-top: 0mm"></div>
        <a :title="item.source_code">{{ item.source_code }}</a>
        </div>
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
import VueQr from 'vue-qr'
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
      sourceNumber:[],
      codebox:"",
      codeUrl: 'https://sy.zsicp.com/web/urlGo?code=SUE-99999A'
    };
  },
  components: {
    VueQr
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
          console.log(value)
          if(value == null){
            this.$message({
              message: '请输入订单编号',
              type: 'warning'
            });
            window.location.reload();
            return false;
          }
          this.orderNumber = value;
          this.html(value,0);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
          window.location.href = "#/source/order";
        });
    },
    html(value,total) {
      console.log(total)
      ScodeList({ order_number: value,total:total })
        .then((response) => {
          console.log(response)
          // return false;
          if(response.code == 555){
            this.$message({
              message: '批次号'+value+'错误，请重试',
              type: 'warning'
            });
            // window.location.reload();
            return false;
          }else if(response.code == 963){
            this.$message({
              message: '批次生成中，请稍后....',
              type: 'warning'
            });
            setTimeout(function(){window.location.reload()},"3000")
            return false;
          }
          this.sourceCode = response.data;
          var _this = this;
          const loading = this.$loading({
            lock: true,
            text: "正在生成二维码种请稍后...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          for( var i=0;i <this.sourceCode.length;i++){
            this.sourceSrc[i] = MY_CODE_URL + '?code=' + this.sourceCode[i]['source_code']
            // this.sourceSrc[0] = 'http://sy.zsicp.com?c=12345'
            // this.sourceSrc[0] = 'sy.zsicp.com'
          }
          console.log(this.sourceSrc)
          // console.log(count_qrcode);
          // var showcode = setInterval(function () {
          //   for (var i = tmpg; i < set_go; i++) {
          //     setTimeout(function(){_this.makeqrcode(i)},300*(i+1))
          //   }
          //   tmpg += 1;
          //   set_go += 1;
          //   if (tmpg >= count_qrcode) {
          //     clearInterval(showcode);
          //     setTimeout(function(){loading.close();},300*(count_qrcode+1))
          //   }
          // });
          loading.close();
          var _this = this;
          _this.PrintRow();
        }, 100)
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });
        console.log(this.sourceSrc)
    },
    // makeqrcode(index) {
    //   console.log(this.sourceCode);
    //   var index = index-1
    //   if(index!=0){
    //     console.log(index+"////"+this.$refs.qrcodeContainer.innerHTML)
    //     this.$refs.qrcodeContainer.innerHTML = '';
    //   }
    //   let qrtext = MY_CODE_URL + "?code=" + this.sourceCode[index]['source_code'];
    //   this.$nextTick(() => {
    //     let qrcode = new QRCode(document.getElementById("qrcode"), {
    //       // let qrcode = new QRCode(this.$refs.qrcodeContainer, {
    //       width: 120, // 二维码的宽
    //       height: 120, // 二维码的高
    //       text: qrtext, // 二维码的内容
    //       // text: "123", // 二维码的内容
    //       colorDark: "#000", // 二维码的颜色
    //       colorLight: "#fff",
    //       correctLevel: QRCode.CorrectLevel.H,
    //     });
    //     setTimeout(() => {
    //       let qwe = this.$refs.qrcodeContainer.innerHTML;
    //       console.log(this.$refs.qrcodeContainer);
    //       var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
    //       let tmpSrc = patt.exec(qwe);
    //       console.log(tmpSrc);
    //       this.sourceSrc[index] = tmpSrc[1];
          
          
    //       // console.log(qrtext);
    //       //document.getElementById("qrcode").innerHTML = "";
    //       // console.log("妙啊~");
    //       // console.log(this.sourceSrc);
          
    //     // this.$refs.qrcodeContainer.innerHTML = ""; 
    //       this.$forceUpdate();
          
    //     });
    //   });
    // },
    smallcode(source,code,number) {
      console.log(source+"/"+code+'/'+number)
      this.sourceCode = [{source_number:'',source_code:''}]
      console.log(this.sourceCode)
      this.sourceCode[0]['source_number'] = parseInt(number)
      this.sourceSrc[0] = code
      this.sourceCode[0]['source_code'] = source 
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
    if (this.$route.query.order_number) {
      var order_number = this.$route.query.order_number
      var order_total = this.$route.query.order_total 
      setTimeout(this.html(order_number,order_total),"1000")
      console.log("Add")
      // window.sessionStorage.removeItem("order_number");
    } else if (typeof window.sessionStorage.sourcecode_number != "undefined") {
      var source = window.sessionStorage.getItem("source");
      var sourcecode = window.sessionStorage.getItem("sourcecode");
      var sourcecode_number = window.sessionStorage.getItem("sourcecode_number");
      console.log("source++")
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
  // border: 1px solid black;
  // padding: 10px;
  // width: 20mm;
  // height: 20mm;
  float: left;
  // margin: 3px;
}
</style>
