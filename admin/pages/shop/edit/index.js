import { $sdaiActionSheet, $sdaiPicker } from "./../../../components/base/index.js"
import { $wuxToptips } from './../../../libs/wux/index'

Page({
  weekName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  data: {
    weekName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    showLoading: true,
    shopHoursRadios: [
      { name: "每日营业时间相同", key: 1, checked: true }
    ],
    //默认每日营业时间相同
    shopHoursRadiosChose: true,
    pickerTimeDefault: "09:00",
    shopHoursList: [],

    uploadLogo: 0,
    logoImageUrl: "",
    choseAddress: {
      address: "",
      cityCode: "",
      cityName: "",
      lat: "",
      lng: "",
    },
    categoryList: "",
    tagList: "",

  },
  // watch: {
  //   choseAddress: function (value) {
  //     this.setData({ replaceCityCode: false });
  //     this.POST(this.$url.bus.mapInverse, {
  //       lat: value.lat,
  //       lng: value.lng,
  //       pois: 0,
  //     }).then((data) => {
  //       this.setData({
  //         "choseAddress.cityCode": data.data.baiduAddressComponentDTO.adcode,
  //         replaceCityCode: true
  //       })
  //     })
  //   }
  // },
  onLoad: function (options) {
    this.merchant = wx.getStorageSync("merchant-info") || {};
    this.GET(this.$url.shop.getShopDeatil, { shopId: this.options.id }).then((res)=>{
      let shopHoursRadiosChose= true;
      let defaultStartTime = res.data.hoursList[0].startTime, defaultEndTime = res.data.hoursList[0].endTime;
      res.data.hoursList.forEach((v, i)=>{
        res.data.hoursList[i].weekName = this.weekName[i];
        if (defaultStartTime != v.startTime || defaultEndTime != v.endTime){
          shopHoursRadiosChose= false;
        }
      });
    
      this.setData({
        shopHoursList: res.data.hoursList,
        "shopHoursRadios[0].checked": shopHoursRadiosChose,
        shopHoursRadiosChose: shopHoursRadiosChose,
        logoImageUrl: res.data.logoImageUrl,
        info : res.data,
        choseAddress: {
          address: res.data.address,
          cityCode: res.data.cityCode,
          cityName: res.data.cityName,
          lat: res.data.lat,
          lng: res.data.lng,
        },
        categoryList: res.data.categoryList.map((v)=>{
          return v.name
        }).join(","),
        tagList: res.data.tagList.map((v) => {
          return v.name
        }).join(","),
        showLoading: false,
      })

      this.choseId= res.data.categoryList.map((v) => {
        return v.id
      });

      this.tagIdList= res.data.tagList.map((v) => {
        return v.id
      });

    })
  },
  onShow() {
    if (wx.getStorageSync("choseId") instanceof Array) {
      this.choseId = wx.getStorageSync("choseId");
      this.setData({
        categoryList: Object.values(wx.getStorageSync("choseName")).join(",")
      })
      
    }

    let notesChoseList = wx.getStorageSync("notesChoseList");
    if (notesChoseList.length){
      let tagIdList = [], tagList= [];
      notesChoseList.map((v)=>{
        tagIdList.push(v.id);
        tagList.push(v.name);
      })
      this.setData({
        tagList: tagList.join(",")
      })
      this.tagIdList = tagIdList;
    }
  },
  closeNotice(){
    this.setData({
      closeNotice: true
    })
  },
  onUnload() {
    wx.removeStorageSync("choseId");
    wx.removeStorageSync("choseName");
    wx.removeStorageSync("notesChoseList");
  },
  pickerShow(e){
    this.shopHoursListIndex= e.currentTarget.dataset.index;
    this.position = e.currentTarget.dataset.position;
    this.setData({
      hideNavite: true,
      pickerTimeDefault: e.currentTarget.dataset.time
    })
    $sdaiPicker().show();
  },
  pickerHide() {
    this.setData({
      hideNavite: false,
    })
    $sdaiPicker().hide();
  },
  actionsheetShow() {
    this.upType = "";
    $sdaiActionSheet().show();
  },
  upCoverImageList(){
    this.upType = "imageList"
    $sdaiActionSheet().show();
  },
  onShopHoursType(e) {
    this.setData({
      shopHoursRadiosChose: e.detail.checked
    })
  },
  
  onShopHoursListConfirm(event){
    this.pickerHide();
    let value = event.detail;
    let obj= {};
    let time1 = +(value.replace(":", '.'));
    if (this.position == "startTime" ){
      let time2 = +( this.data.shopHoursList[this.shopHoursListIndex].endTime.replace(":", '.') );
      if (time1>= time2){
        return $wuxToptips().warn({
          hidden: true,
          text: "结束时间不能小于开始时间",
        })
      }
    } else if(this.position == "endTime"){
      let time2 = +(this.data.shopHoursList[this.shopHoursListIndex].startTime.replace(":", '.'));
      if (time1 <= time2) {
        return $wuxToptips().warn({
          hidden: true,
          text: "结束时间不能小于开始时间",
        })
      }
    }
    obj["shopHoursList[" + this.shopHoursListIndex + "]." + this.position] = value;
    this.setData(obj);
  },
  getShopHoursList(){
    //每日营业时间相同
    if (this.data.shopHoursRadiosChose) {
      let arr = JSON.parse(JSON.stringify([
        this.data.shopHoursList[1], this.data.shopHoursList[1], this.data.shopHoursList[1],
        this.data.shopHoursList[1], this.data.shopHoursList[1], this.data.shopHoursList[1],
        this.data.shopHoursList[1]
      ]));
      arr.forEach((v, i) => {
        delete arr[i].weekName;
        // if (i == 6) arr[i].weekDay = 0;
        // else arr[i].weekDay = ++i;
        arr[i].weekDay = i;
      });
      return arr;

    }else{
      //每日营业时间不相同
      return this.data.shopHoursList;

    }
  },
  onSubmit(e) {

    var reqData = Object.assign({}, e.detail.value, this.data.fromData), placeholder = "";
  
    console.log(this.fileList)
    reqData.shopHoursList = this.getShopHoursList();
    
    //测试需要-----
    reqData.categoryList = this.choseId;
    reqData.tagIdList = this.tagIdList;
    reqData.imageList = this.data.info.shopImageList;

    reqData.id= this.options.id;
    reqData.shopNo = this.merchant.merchantNo;
    reqData.merchantId = this.merchant.id;
    reqData.shopType = this.merchant.type;
    reqData.useState = this.merchant.useState;

    console.log(reqData);

    if (!reqData.logoImageUrl) placeholder = '请上传店铺logo';
    else if (!reqData.shopName) placeholder = '请填写店铺名称';
    else if (!reqData.principalName) placeholder = '请填写经营者姓名';
    else if (!this.tool.isPhoneNum(reqData.principalTelphone)) placeholder = '请填写有效的手机号'; 
    else if (!reqData.shopTelephone) placeholder = '请填写店铺固话';
    else if (!reqData.rebate || reqData.rebate > 50 || reqData.rebate < 0) placeholder = '请填写有效的店铺返利百分比';
    else if (!reqData.address) placeholder = '请选择店铺地址';
    else if (!(reqData.categoryList && reqData.categoryList.length > 0)) placeholder = '请选择店铺经营品类';
    else if (!(reqData.tagIdList && reqData.tagIdList.length> 0)) placeholder = '请选择店铺标签';
    else if (!(reqData.imageList && reqData.imageList.length > 0)) placeholder = '请上传店面图片';
    //else if (!this.data.replaceCityCode) placeholder = '请稍后再试';

    if (placeholder) {
      return $wuxToptips().warn({
        hidden: true,
        text: placeholder,
      })
    }

    this.setData({ showLoading: true });
    this.POST(this.$url.shop.updateShop, reqData).then((data) => {
      this.setData({ showLoading: false, hideNavite: true });
      this.toast({
        type: 'success',
        duration: 1500,
        color: '#fff',
        text: '修改成功',
        success: () => wx.navigateBack()
      });
    })
      
  },
  //上传相关的
  onuploadChange({ detail }) {
    $sdaiActionSheet().hide();
    if (this.upType == "imageList") return;
    detail.detail.file.res || this.setData({ uploadLogo: 1 });
  },
  onuploadSuccess({ detail }) {

    if (this.upType == "imageList"){
      this.data.info.shopImageList.push(detail.url);
      this.setData({
        "info.shopImageList": this.data.info.shopImageList
      })
    }
    else{
      this.setData({
        uploadLogo: 0,
        logoImageUrl: detail.url
      })
    }
    
  },
  removeImageHandel(e){
    this.data.info.shopImageList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      "info.shopImageList": this.data.info.shopImageList
    })
  }
})