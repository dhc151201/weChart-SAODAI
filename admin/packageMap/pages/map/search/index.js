import capacity from './../../../../utils/wx.capacity.js';

Page({
  data: {
    sugData: [],
    opiData: [],
    choseCity: ""
  },
  onLoad(){
    this.poiSearch();
  },
  onShow(){
    
  },
  watch:{
    choseCity: function(value, oldVel){
      if(value== oldVel) return;
      capacity.mapQQ.geocoder(value).then((result) => {
        this.location = result.location;
        this.poiSearch();
      })
    }
  },
  //转换是否需要传入经纬度，城市变化时用到
  getBeforeQQmap(){
    return this.location ? this.location.lat + "," + this.location.lng : null;
  },

  onInput: function(e){  
    capacity.mapQQ.search(e.detail.value, this.getBeforeQQmap() ).then((result)=>{
      result.map((vel, i)=>{
        result[i]._distance = this.filters.distance(result[i]._distance); 
      })
      this.setData({
        sugData: result
      });
    })
    
  },
  poiSearch(){
    capacity.mapQQ.search("商铺", this.getBeforeQQmap() ).then((result) => {
      result.map((vel, i) => {
        result[i]._distance = this.filters.distance(result[i]._distance);
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
        capacity.mapQQ.reverseGeocoder(res.latitude, res.longitude).then((result) => {
          console.log(result);
          this.back({
              address: res.address,
              adcode: result.ad_info.adcode,
              city: result.ad_info.city,
              lat: result.location.lat,
              lng: result.location.lng,
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
    this.navigateBack(this.options.after, {
      choseAddress
    })
  }
})