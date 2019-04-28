import { $sdaiActionSheet } from "./../../../components/base/index.js"
import { $wuxToptips } from './../../../libs/wux/index'

Page({
  choseId: [],
  tagIds: [],
  data: {
    uploadLogo: 0,
    shopHoursRadios: [
      { name: "营业", key: 1, checked: true },
      { name: "下架", key: 2,  }
    ],
    reqData: {
      skuHeadImageUrl: '',
      useState: 1,
      skus: [ 
        {
          salePrice: 0
        }
      ]
    }
  },
  onLoad: function (options) {
    this.setData({
      "reqData.shopIds[0]": options.id,
      "reqData.merchantId": this.data.$state.user.merchantId,
    })
    //需改商品
    if (options.spuId){
      wx.setNavigationBarTitle({
        title: '修改商品',
      });
      let info = wx.getStorageSync("goods-info");
      this.info= info;

      let obj = { spuId: options.spuId };
      if (info.useState== 0){
        obj["shopHoursRadios[0].checked"]= false;
        obj["shopHoursRadios[1].checked"] = true;
      }
      info.tagList= [];
      info.spuTags.map((v)=>{
        info.tagList.push(v.name);
        this.tagIds.push(v.id);
      })
      info.tagList = info.tagList.join(",");
      obj.categoryList= info.spuCategorys.map((v)=>{
        this.choseId.push(v.id)
        return v.name
      }).join(",");

      obj.reqData = Object.assign({}, this.data.reqData, info);

      this.setData(obj)

    }
  },
  actionsheetShow() {
    $sdaiActionSheet().show();
    /*
    this.confirm({
      resetOnClose: true,
      closable: true,
      title: '店铺名称已存在',
      content: '输入的店铺已在平台开店，提交经营资质认领您的店铺。',
      confirmText: "去认证认领",
      onConfirm(e) {
        console.log('凭什么吃我的冰淇淋！')
      },
      onCancel(e) {
        console.log('谢谢你不吃之恩！')
      },
    })
    */
  },
  
  onShow() {
    if (wx.getStorageSync("choseId") instanceof Array) {
      this.choseId = wx.getStorageSync("choseId");
      this.setData({
        categoryList: Object.values(wx.getStorageSync("choseName")).join(",")
      })
      wx.removeStorageSync("choseId");
      wx.removeStorageSync("choseName");
    }


    let notesChoseList = wx.getStorageSync("notesChoseList");
    if (notesChoseList.length) {
      let tagIdList = [], tagList = [];
      notesChoseList.map((v) => {
        tagIdList.push(v.id);
        tagList.push(v.name);
      })
      this.setData({
        "reqData.tagList": tagList.join(",")
      })
      this.tagIds = tagIdList;
    }
    wx.removeStorageSync("notesChoseList");

  },
  onGoodsType({ detail }){
    this.setData({
      "reqData.useState": detail.key== 1 ? 1 : 0,
      "shopHoursRadios[0].checked": detail.key == 1 ? true: false,
      "shopHoursRadios[1].checked": detail.key == 2 ? true : false
    })
  },
  saveNext(){
    this.next= true;
  },
  onSubmit(e) {

    if (this.data.request) return;//上次请求正在执行中

    var reqData = Object.assign({}, e.detail.value, this.data.fromData), placeholder = "";

    console.log(reqData)
    
    if (!reqData.headImage) placeholder = '请上传商品图片';
    else if (!reqData.spuName) placeholder = '请填写商品名称';
    else if (!reqData.salePrice) placeholder = '请填写销售价格';
    else if (this.data.spuId && !(reqData.tagList || '').length) placeholder = '请选择商品标签';
    else if (!(reqData.categoryList || '').length) placeholder = '请选择经营品类';

    let salePrice = (reqData.salePrice + '').split(".");
    if ( salePrice.length> 2 || (salePrice[1] || 0) > 99 ){
      placeholder = '请输入有效的销售金额';
    }

    if (placeholder) {
      return $wuxToptips().warn({
        hidden: true,
        text: placeholder,
      })
    }

    reqData.merchantId = this.data.$state.user.merchantId;
    reqData.categoryIds = this.choseId;
    reqData.tagIds = this.tagIds;
    reqData.id = this.options.spuId;
    reqData.imagas = {};
    reqData.imagas[reqData.headImage] = 1;
    reqData.shopIds= [this.options.id];
    reqData.skus = [{
      salePrice: +reqData.salePrice
    }]
    if (this.info){
      reqData.spuUnit = this.info.spuUnit;
      reqData.skus[0].id = this.info.skuId;
      reqData.skus[0].spuId = this.info.spuId;
      reqData.skus[0].skuSpec = this.info.skuSpec;
      reqData.skus[0].originPrice = this.info.originPrice;
    }

    // delete reqData.headImage;
    // delete reqData.categoryList;
    // delete reqData.tagList;

    console.log(reqData)

    this.setData({ showLoading: true, request: true });

      
      //添加商品
      if (!this.options.spuId) {
        this.POST(this.$url.goods.create, reqData).then((data) => {

          this.setData({
            "reqData.headImage": "",
            "reqData.spuName" : "",
            "reqData.salePrice": ""
          })

          if (this.next){
            this.toast({
              type: 'success',
              duration: 1500,
              color: '#fff',
              text: '新增成功',
              success: () => {

              }
            });
          }else{
            this.toast({
              type: 'success',
              duration: 1500,
              color: '#fff',
              text: '新增成功',
              success: () => this.data.$state.typeIn==1 ? wx.reLaunch({
                  url: '/pages/user/index/index',
                }) : wx.navigateBack()
            });
            
          }
          this.setData({ showLoading: false, request: false });
        })
      }
      //修改成功
      else {
        this.POST(this.$url.goods.update, reqData).then((data) => {
          this.setData({
            "reqData.headImage": "",
            "reqData.spuName": "",
            "reqData.salePrice": ""
          });
          this.toast({
            type: 'success',
            duration: 1500,
            color: '#fff',
            text: '修改成功',
            success: () => wx.navigateBack()
          });
          this.setData({ showLoading: false, request: false });
        })
      }



  },
  //上传相关的
  onuploadChange({ detail }) {
    $sdaiActionSheet().hide();
    detail.detail.file.res || this.setData({ uploadLogo: 1 });
  },
  onuploadSuccess({ detail }) {
    this.setData({
      uploadLogo: 0,
      "reqData.headImage": detail.url
    })
  }
})