import { $sdaiActionSheet } from "./../../../components/base/index.js"
import { $wuxToptips } from './../../../libs/wux/index'
import config from './../../../utils/global.config.js'
const app= getApp();

Page({
  data: {
    WEBVIEW: config.WEBVIEW,
    shopHoursRadios: [
      { name: "", key: 1, checked: true }
    ],
    typeInStringBtn: ["下一步", "生成店铺"],
    uploadLogo: 0,
    logoImageUrl: "",
    principalTelphone: (wx.getStorageSync("userInfo") || {}).phone,
    choseAddress: { 
      address: "",
      cityCode: "",
      cityName: "",
      lat: "",
      lng: "",
    }
  },
  // watch: {
  //   choseAddress: function(value){
  //     this.setData({ replaceCityCode: false });
  //     this.POST(this.$url.bus.mapInverse, { 
  //         lat: value.lat, 
  //         lng: value.lng,
  //         pois: 0,
  //       }).then((data) => {
  //         this.setData({
  //           "choseAddress.cityCode": data.data.baiduAddressComponentDTO.adcode,
  //           replaceCityCode: true
  //         })
  //     })
  //   }
  // },
  onLoad(options){
      console.log(options)
      app.globalData.recommandCode = options.recommandCode;
      app.globalData.recommandCode && app.store.setState({ typeIn: 1 });
  },
  onShow(){
    if (wx.getStorageSync("choseId") instanceof Array){

      this.choseId = wx.getStorageSync("choseId");
      this.setData({
        categoryList: Object.values(wx.getStorageSync("choseName")).join(",")
      }, function(){
          wx.removeStorageSync("choseId");
          wx.removeStorageSync("choseName");
      })
      
    }
    
  },
  actionsheetShow() {
    $sdaiActionSheet().show();
  },
  onShopHoursType(e){
    this.setData({
      "shopHoursRadios[0].checked": e.detail.checked
    })
  },
  ongetphonenumber(e){
    //已授权 获取到相关参数
    if(e.detail.iv){
      wx.login({
        success: (res) => {
          e.detail.code = res.code;
          delete e.detail.errMsg;

          this.POST(this.$url.user.getPhone, e.detail).then((data) => {
            this.setData({
              principalTelphone: data.data
            })
            this.getUserInfo();
          })

        }
      })
    }
  },
  onSubmit(e){
      
      try{

            console.log("fromData::: ", this.data.fromData);
            var reqData = Object.assign({}, e.detail.value, this.data.fromData) , placeholder= "";
            
            //测试需要-----
            reqData.categoryList = this.choseId;

            //回退可修改信息 带上id
            if(this.data.shopId) {
            reqData.id = this.data.shopId;
            }

            console.log(reqData);


            if (!reqData.logoImageUrl) placeholder= '请上传店铺logo';
            else if (!reqData.shopName) placeholder = '请填写店铺名称';
            else if (!reqData.principalName) placeholder = '请填写经营者姓名';
            else if (!this.tool.isPhoneNum( reqData.principalTelphone) ) placeholder = '请填写有效的手机号';
            else if (!reqData.rebate || reqData.rebate > 50 || reqData.rebate< 0) placeholder = '请填写有效的店铺返利百分比';
            else if (!reqData.address) placeholder = '请选择店铺地址';
            else if (!reqData.categoryList) placeholder = '请选择店铺经营品类';
            //else if (!this.data.replaceCityCode) placeholder = '请稍后再试';
            else if (!this.data.shopHoursRadios[0].checked) placeholder = '请阅读并同意店铺入驻协议';

            if (placeholder){
            return $wuxToptips().warn({
                hidden: true,
                text: placeholder,
            })
            }

            this.setData({showLoading: true});
            setTimeout(()=>{
            this.setData({ showLoading: false });
            //正式入驻()
            if (this.data.$state.user.merchantId || this.data.$state.typeIn == 0) {
                reqData.merchantId= this.data.$state.user.merchantId;
                this.POST(this.$url.shop.saveShop, reqData).then((data) => {
                this.setData({
                    shopId: data.data
                })
                this.redirectTo("/pages/shop/information/index", { id: data.data })
                })
            }
            else {
                this.POST(this.$url.shop.saveTemp, reqData).then((data) => {
                this.setData({
                    shopId: data.data
                })
                this.getUserInfo().then(()=>{
                    this.navigateTo("/pages/goods/add/index", { id: data.data })
                })
                })
            }

            }, 500)

      } catch (e) {
          this.alert(e);
      }
    
  },
  //上传相关的
  onuploadChange({ detail }){
    $sdaiActionSheet().hide();
    detail.detail.file.res || this.setData({ uploadLogo: 1});
  },
  onuploadSuccess({ detail }){
    this.setData({
      uploadLogo: 0,
      logoImageUrl: detail.url
    })
  },

  hrefExampleHandel(){
    this.navigateTo("/pages/example/index", {
      config: JSON.stringify({
        title: "店铺logo",
        imageList: [
          {
            height: "320",
            src: "pic_logo.png"
          }    
        ],
        summaryList: [
          "1.请保持logo图片清晰。",
          "2.不能盗用已注册商标。",
          "3.有商标的，请上传商标。",
          "4.无商标的，个体户可上传带店面标识的照片。",
          "5.农户上传农场照片或售卖商品图。"
        ]
      }), 
    });
  }

})