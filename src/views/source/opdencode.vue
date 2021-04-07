<template>
  <div>

      <div id="qrcode" class="qrcode" ref="qrcodeContainer" style="display: none;">
      </div>
  <el-row>
      <el-col :span="2" v-for="(item, index) in sourceCode" :key="index">
         <!-- <div class="qrcode" ref="qrcodeContainer"></div> -->
     <!--  <div class="qrcode" :ref="'qrcodeContainer'+index"></div> -->
        <div class="box">
 <!--     <div :id="'qrCode'+index" :ref="'qrcodeContainer'+index"></div> -->
          <img :src="sourceSrc[index]" />
         <div style="margin-top: 10px;"></div>
          <a :title="item">{{ item }}</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ScodeList } from "@/api/source/sourceapi.js";
import QRCode from 'qrcodejs2';
const formJson = {
  id: "",
};
export default {
  data() {
    return {
      bannerUrl: "",
      sourceCode: [],
      sourceSrc:[],
      orderNumber: "",
      test2:{},
      qrcodetext:"",

    };
  },
  methods: {
    getbase(e){

        console.log(e)
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
        });
    },
    html(value) {
      // console.log(value)
      ScodeList({ order_number: value })
        .then((response) => {
          this.sourceCode = response.data;
          // for (let i = 0; i < this.sourceCode.length; i++) {
          //     this.sourceCode[i]
          // }
         this.sourceCode.forEach((item,index)=>{

             this.makeqrcode(index)

          });
        })
        .catch(() => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });

        // this.makeqrcode(0);
        // this.sourceCode.forEach((item,index)=>{
        //     this.QRCodetext = '123';
        //     this.makeqrcode(index);
        // });

    },
    makeqrcode(index){

        let qrtext = this.sourceCode[index];
        this.$nextTick(() => {
        let qrcode = new QRCode(document.getElementById("qrcode"), {
        // let qrcode = new QRCode(this.$refs.qrcodeContainer, {
            width: 100,// 二维码的宽
            height: 100,// 二维码的高
            text: qrtext, // 二维码的内容
            // text: "123", // 二维码的内容
            colorDark: '#000',// 二维码的颜色
            colorLight: '#fff',
            correctLevel: QRCode.CorrectLevel.H
        })

    setTimeout(() =>{
        let qwe = this.$refs.qrcodeContainer.innerHTML;
        console.log(qwe)
        var patt = /<img[^>]+src=['"]([^'"]+)['"]+/g;
        let tmpSrc = patt.exec(qwe);
        console.log(tmpSrc)
        this.sourceSrc[index] =tmpSrc[1];
        this.$forceUpdate();
        //document.getElementById("qrcode").innerHTML = "";
        // console.log("妙啊~");
        // console.log(this.sourceSrc);
    },3000);

       });
    },
  },
  filters: {},
  props: {
   QRCodetext: {
     type: String,//类型限定
     default: '' //默认
   }
  },
  mounted() {

    //
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
