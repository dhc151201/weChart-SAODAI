import { $sdaiActionSheet } from "./../../../components/base/index.js"
import { $wuxToptips } from './../../../libs/wux/index'

Page({
  data: {
    uploadcardFrontImageUrl: 0,
    uploadcardBackImageUrl: 0,
    uploadlicenseImageUrl: 0,
    upTarget: "",
    merchantInfo: {}
  },
  onLoadGetLocalStorage() {
    return [
      {
        pageDataKey: "merchantInfo",
        localStorageKey: "merchant-info",
        default: {}
      }
    ]
  },
  onLoad: function (options) {

  },
  actionsheetShow(e) {
    //console.log(e);
    this.setData({
      upTarget: e.currentTarget.dataset.key
    })
    $sdaiActionSheet().show();
  },
  //上传相关的
  onuploadChange(info) {
    $sdaiActionSheet().hide();
    let key = info.currentTarget.dataset.key;
    let obj = {};
    obj["upload"+ key] = 1;
    //console.log(obj)
    info.detail.detail.file.res || this.setData(obj);
  },
  onuploadSuccess(info){
    //console.log(info);
    let key = info.currentTarget.dataset.key;
    let obj= {};
    obj[key]= info.detail.url;
    obj["upload" + key] = 0;
    this.setData(obj)
  },
  submit(){

    let reqData =this.options;
    Object.assign(reqData, {
      cardFontImageUrl: this.data.cardFrontImageUrl,
      cardBackImageUrl: this.data.cardBackImageUrl,
      licenseImageUrl: this.data.licenseImageUrl
    }) 

    var placeholder = "";

    if (!reqData.cardFontImageUrl) placeholder = '请上传身份证正面';
    else if (!reqData.cardBackImageUrl) placeholder = '请上传身份证背面';
    else if (!reqData.licenseImageUrl) placeholder = '请上传营业执照';

    if (placeholder) {
      return $wuxToptips().warn({
        hidden: true,
        text: placeholder,
      })
    }

    this.POST(this.$url.shop.submitShopCert, reqData).then((data) => {
      this.toast({
        type: 'success',
        duration: 3000,
        color: '#fff',
        text: '提交审核成功',
        success: () => wx.reLaunch({ url: '/pages/user/index/index', })
      })
      
      

    })
  },


  hrefExampleHandelCard() {
    this.navigateTo("/pages/example/index", {
      config: JSON.stringify({
        title: "身份证反面",
        imageList: [
          {
            height: "440",
            src: "pic_id.png"
          }  
          
        ],
        summaryList: [
          "1.请保持营业执照各项信息清晰可见，无遮挡"
        ]
      }),
    });
  },
  hrefExampleHandel() {
    this.navigateTo("/pages/example/index", {
      config: JSON.stringify({
        title: "店铺营业执照",
        imageList: [
          {
            height: "640",
            src: "pic_license.png"
          }  
          
        ],
        summaryList: [
          "1.请保持营业执照各项信息清晰可见，无遮挡"
        ]
      }),
    });
  }

})