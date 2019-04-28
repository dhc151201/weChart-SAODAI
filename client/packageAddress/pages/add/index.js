import {isPhoneNum} from './../../../utils/public.tool.js'
Page({
  fromData: {},
  /**
   * 页面的初始数据
   */
  data: {
    info:{
      receiveName: "",
      receivePhone: "",
      receiveAddress: "",
      houseNo: ""
    },
    choseAddress: {}
  },
  watch: {
    choseAddress: function(value){
      this.setData({
        "info.receiveAddress": value.address,
        "info.regionArea": value.adcode,
        "info.lat": value.lat,
        "info.lng": value.lng,
        "info.provinceName": value.province,
        "info.cityName": value.cityName,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.info){
      this.setData({
        info: JSON.parse(options.info) 
      })
      wx.setNavigationBarTitle({
        title: '修改收货信息'
      })
    }
  },
  save(){

    let data= Object.assign({}, this.data.info, this.fromData);

    if(!data.receiveName){
      return this.toast("请输入收货人姓名");
    }else if(!isPhoneNum(data.receivePhone)){
      return this.toast("请输入正确的收货人电话");
    }else if(!data.receiveAddress){
      return this.toast("请输入收货人地址");
    } 

    if(this.data.info.id){
      this.POST(this.$url.user.addressUpdate, data, {proxy: true}).then(()=>{
        this.navigateBack();
      })
    }else{
      this.POST(this.$url.user.addressCreate, data, {proxy: true}).then(()=>{
        this.navigateBack();
      })
    }
    

  }
})