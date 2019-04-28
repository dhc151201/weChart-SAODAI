import { search, geocoder, reverseGeocoder } from './../../../../utils/wx.capacity.js';
import { filters } from './../../../../utils/public.tool.js'

Page({
  data: {
    history: [],
    sugData: [],
    opiData: [],
    choseCity: "",
    value: ""
  },
  onLoad(){
      if (this.options.after == '/pages/with-help/index/index' || this.options.after == '/pages/with-help/shop-list/index') {
        wx.setNavigationBarTitle({
            title: '选择出发地'
        })
    }
    this.poiSearch();
  },
  onShow(){
    this.setData({
        history: wx.getStorageSync("histroy-address") || [],
    })
  },
  watch:{
    choseCity: function(value, oldVel){
      if(value== oldVel) return;
      geocoder(value).then((result) => {
        this.location = result.location;
        //this.poiSearch();
          this.onInput({ detail: { value: this.data.value } })
      })
    }
  },
  //转换是否需要传入经纬度，城市变化时用到
  getBeforeQQmap(){
    return this.location ? this.location.lat + "," + this.location.lng : null;
  },

  onInput: function(e){  
    e.detail.value && search(e.detail.value, this.getBeforeQQmap() ).then((result)=>{
      result.map((vel, i)=>{
        result[i]._distance = filters.distance(result[i]._distance); 
      })
      this.setData({
        value: e.detail.value,
        sugData: result
      });
    })
    
  },
  poiSearch(){
    search("商铺", this.getBeforeQQmap() ).then((result) => {
      console.log(result)
      result.map((vel, i) => {
        result[i]._distance = filters.distance(result[i]._distance);
      })
      this.setData({
        opiData: result
      });
    })
  },
  choseMap(){
    wx.chooseLocation({
      success: (res)=> {
        //console.log("小程序自带地图选择结果：：：", res);
        reverseGeocoder(res.latitude, res.longitude).then((result) => {
            console.log("result", result);
          this.back({
              title: res.name,
              address: res.address,
              adcode: result.ad_info.adcode,
              city: result.ad_info.city,
              lat: result.location.lat,
              lng: result.location.lng,
              province: result.ad_info.province,
          })
        })

      },
    })
    
  },
  searchResultList(e){
    this.back(e.currentTarget.dataset);
  },
  searchResultListNear(e) {
    // let chose = this.data.opiData[e.currentTarget.dataset.index];
    // console.log(chose)
    // chose.cityCode = this.data.$state.location.originalData.result.cityCode;
    // chose.cityName = this.data.$state.location.originalData.result.addressComponent.city;
    // chose.lat = chose.latitude;
    // chose.lng = chose.longitude;
    this.back(e.currentTarget.dataset);
  },
  back(chose){
    var choseAddress = chose;
    choseAddress.districtCode = chose.adcode;
    choseAddress.cityCode = +((chose.adcode+ '').slice(0, 4)+ '00');
    choseAddress.cityName = chose.city;
    console.log(choseAddress);

    let list = (wx.getStorageSync("histroy-address") || []).filter((v) => {
        return v.address != choseAddress.address
    }).slice(0, 10);
    list.unshift(choseAddress);

    if (this.options.after != '/pages/with-help/index/index' && this.options.after != '/pages/with-help/shop-list/index') {
        wx.setStorageSync("histroy-address", list);
    }

    if(choseAddress.address.indexOf(choseAddress.cityName) < 0 ||
       choseAddress.address.indexOf(choseAddress.province) < 0
    ){
      choseAddress.address= `${choseAddress.cityName}${choseAddress.title}${choseAddress.address}`;
      if(choseAddress.address.length> 50){
        choseAddress.address= choseAddress.address.substr(0, 50)+ '...';
      }
    }

    // console.log(choseAddress);
    // debugger;

    this.navigateBack(this.options.after, {
      choseAddress
    })
  }
})