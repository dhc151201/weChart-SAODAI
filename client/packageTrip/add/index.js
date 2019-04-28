import { $wuxSelect } from "./../../libs/wux/index.js"; 
import { $sdaiPicker } from './../../components/base/index.js'
import miment from './../../libs/moment/miment.min.js'
import {sendTemplmsg} from "./../../assets/js/tmplmsg.js"
import {geocoder} from "./../../utils/wx.capacity.js"
import {getGoodsPuttype} from "./../../utils/public.tool.js"

var splitTime= 0.5; //出发与到达默认间隔时间，单位：小时

var nowTime = function(){
  return new Date().getTime();
}
var startTime = function(){
  return nowTime() + 1000 * 60 * 10;
} 
var endTime = function(){
  return startTime() + 1000* 60* 60 * splitTime;
}
//到达时间限制，最早8点，最晚23点整
var ressetEndTime= function(endTime, _startTime= startTime(),  minHours= 8, maxHours= 22){

    let startDate= new Date(_startTime), endDate= new Date(endTime), 
        startHour= startDate.getHours(), endHour= endDate.getHours(); 

    if(endHour < minHours){
      //出发时间在当天，返回当天的早8点
      if(startDate.getDate() == endDate.getDate()){
        return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), minHours).getTime();
      }
      //出发时间在今天，传入的达到时间在明天
      return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+ 1, minHours).getTime();
    }
    else if(endHour > maxHours){
      return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+ 1, minHours).getTime();
    }

    return endTime;

}
//达到时间可选最小时间限制，传入出发时间
var resetMinDateEnd= function(startTime, minHours= 8, maxHours= 22){
  
  let date= new Date(startTime);
  if(date.getHours() > maxHours){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()+ 1, minHours).getTime();
  }
  else if(date.getHours() < minHours){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), minHours).getTime();
  }
  return startTime;
  
}

var minutesToTime= function(minutes){
  return 60000 * minutes;
}

Page({
  fromData: {},
  shopsInfo: [],
  endAd: wx.getStorageSync("trip-find-choseAddress"),
  data: {

    start: "",
    dest: ( wx.getStorageSync("histroy-address") || [{}] )[0],

    crosscityCharge: 2,
    argumentStatus: true,

    goodsPuttype: getGoodsPuttype(),
    putType: 0,

    spinShow: true,

  },
  onLoad(options){
    this.setData(options);

    this.onLoadFindDefaultFun();

    this.setTimeDefault();

  },
  watch: {
    choseAddress: function(value){
      this.addressChange= true;
      this.setData({
        dest: value,
      })
      if(this.options.from == 'find'){
        if(value.lat){
          value.address= value.receiveAddress+ value.houseNo;
          wx.setStorageSync("trip-find-choseAddress", value);
          this.endAd= value;
          console.log(value);
        }else{
          this.setData({
            spinShow: true
          });
          geocoder(value.receiveAddress+ value.houseNo).then((res)=>{
            wx.setStorageSync("trip-find-choseAddress", value);
            this.endAd= res;
            console.log(res);
            this.setData({
              spinShow: false
            })
          });
        }
        
      }
      
    }
  },
  onShow(){

    if(this.data.spinShow){
      this.setData({
        spinShow: false,
      })
    }
  
  },
  setTimeDefault(){
    this.setData({

      setOutTime: startTime(),
      arriveTime: ressetEndTime(endTime()),
  
      minDate: nowTime() + minutesToTime(10),
      minDateEnd: resetMinDateEnd(startTime()),
      maxDate: nowTime()+ minutesToTime(60 * 24 * 90), //延后至90天
  
      moment_setOutTime: miment(startTime()).format("YYYY-MM-DD hh:mm"),
      moment_arriveTime: miment(ressetEndTime(endTime())).format("YYYY-MM-DD hh:mm"),
      
    })
  },
  onLoadFindDefaultFun(){
    if(this.options.from == 'find'){

      splitTime= 5 - 0.15;  //当前时间往后推5小时
      wx.setNavigationBarTitle({
        title: "完善收货信息"
      })
      this.getShopsInfo();

      this.setData({
        choseAddress: wx.getStorageSync("trip-find-choseAddress")
      })

    }
    else{

      //预防上次缓存
      splitTime= 0.5; //当前时间往后推0.5小时

    }
  },
  getShopsInfo(){
    (this.options.shopId+ '').split(",").filter(v=> v).map(v=> {
      this.POST(this.$url.shop.shopDetailForC, {
        shopId: v,
        lat: this.data.$state.location.location.lat,
        lng: this.data.$state.location.location.lng
      }).then((res)=>{
        geocoder(res.data.address).then(n => {
          res.data.coder= n;
          this.shopsInfo.push(res.data);
          console.log(this.shopsInfo);
        })
      })
    })
  },
  //开始时间
  showStartPicker(){
    this.setData({
      showPicker: true,
      minDate: this.data.minDate,
      maxDate: this.data.maxDate,
    }, ()=>{
      $sdaiPicker("#sdai-picker-start").show();
    })
  },
  onConfirmStart({detail}){
    if( this.data.arriveTime - detail< minutesToTime(10)  && false){
      this.toast("出发时间不得晚于到达时间10分钟");
    }else{
      this.setData({
        setOutTime: detail,
        moment_setOutTime: miment(detail).format("YYYY-MM-DD hh:mm"),
        arriveTime:  ressetEndTime(detail + minutesToTime(60 * splitTime), detail),
        moment_arriveTime: miment(ressetEndTime(detail+ minutesToTime(60* splitTime), detail)).format("YYYY-MM-DD hh:mm"),
        showPicker: false,
      })
    }
    this.onCancelStart();
  },
  onCancelStart(){
    $sdaiPicker("#sdai-picker-start").hide();
  },
  //到达时间
  showEndPicker(){
    this.setData({
      showPicker: true,
      minDateEnd: resetMinDateEnd(this.data.setOutTime+ minutesToTime(60* (this.options.from == 'find' ? 0.5 : splitTime))),
      maxDate: this.data.arriveTime+ minutesToTime(60* 24* 90),
    }, ()=>{
      $sdaiPicker("#sdai-picker-end").show();
    })
  },
  onConfirmEnd({detail}){
    if( detail- this.data.setOutTime< minutesToTime(10) ){
      this.toast("到达时间不得早于出发时间10分钟");
    }else{
      this.setData({
        arriveTime: ressetEndTime(detail),
        moment_arriveTime: miment(ressetEndTime(detail)).format("YYYY-MM-DD hh:mm"),
        showPicker: false,
      })
    }
    this.onCancelEnd();
  },
  onCancelEnd(){
    $sdaiPicker("#sdai-picker-end").hide();
  },

  sliderChange({detail}){
    this.setData({
      crosscityCharge: detail.value[0],
    })
  },

  argumentHandel(){
    this.setData({
      argumentStatus: !this.data.argumentStatus
    })
  },

  submit(e){

    if (this.request) return;

    let reqData= Object.assign({}, this.fromData, {
      
      crosscityCharge: this.data.crosscityCharge,

      setOutTime: this.data.setOutTime,
      arriveTime: this.data.arriveTime,

      userId: this.data.$state.user.id,

      startRegion: this.data.$state.location_indexhelp.adcode || this.data.$state.location.ad_info.adcode, //出发地区域编码
      startProvinceName: this.data.$state.location_indexhelp.province || this.data.$state.location.ad_info.province, //出发地省名
      startCityName: this.data.$state.location_indexhelp.city || this.data.$state.location.ad_info.city, //出发地市名
      startAddress: this.data.$state.location_indexhelp.address || this.data.$state.location.address, //出发地详细地址
      startLongitude: this.data.$state.location_indexhelp.lng || this.data.$state.location.location.lng, //出发点经度
      startLatitude: this.data.$state.location_indexhelp.lat || this.data.$state.location.location.lat, //出发点纬度

      destRegion: this.data.dest.adcode, 
      destProvinceName:this.data.dest.province,
      destCityName:this.data.dest.city,
      destAddress:this.data.dest.address,
      destLongitude:this.data.dest.lng,
      destLatitude:this.data.dest.lat,

      shopIds: (this.options.shopId+ '').split(",").map(v=> +v)

    })

    if(!reqData.destAddress){
      return this.toast("请选择到达目的地");
    }
    else if(!this.data.argumentStatus){
      return this.toast("请阅读并同意《捎带服务协议》");
    }

    console.log(reqData);

    this.request= true;
    this.setData({
        spinShow: true,
    })

    if(e.detail.formId){
        sendTemplmsg.call(this, e.detail.formId);
    }

    this.POST(this.$url.trip.create, reqData, { proxy: true }).then((res)=>{
        this.setData({
            spinShow: false,
        })
        this.toast({
            type: 'success',
            duration: 1000,
            color: '#fff',
            text: '行程发布成功',
            success: () => this.redirectTo("/packageTrip/detail/index", {
                tripId: res.data,
                from: "create"
            })
        })
    }).catch(()=>{
        this.request= false;
        this.setData({
            spinShow: false,
        })
    })

  },
  // 选择快递方式
  chosePuttype(){
    $wuxSelect().open({
      value: this.data.goodsPuttype[this.data.putType],
      options: this.data.goodsPuttype,
      onConfirm: (value, index, options) => {
          if (value != this.data.goodsPuttype[this.data.putType]){
              this.setData({ putType: index});
          } 
      },
    })
  },
  // 找人捎带下单
  creatFindOrder(e){

    if(!this.data.choseAddress){
      return this.toast("请选择收货人信息");
    }
    else if(!this.data.argumentStatus){
      return this.toast("请阅读并同意《捎带服务协议》");
    }

    var getStartAd= ()=> {
      return this.shopsInfo.map( v=> {
        return {
          startRegion: v.coder.ad_info.adcode,
          startProvinceName: v.coder.address_components.province,
          startCityName: v.coder.address_components.city,
          startAddress: v.address,
          startLongitude: v.coder.location.lng,
          startLatitude: v.coder.location.lat
        }
      }).filter(v=> v)[0];
    }

    var getEndAd= ()=>{
      
      if(this.endAd.lng){
        return {
          destRegion: this.endAd.regionArea,
          destProvinceName: this.endAd.provinceName,
          destCityName: this.endAd.cityName,
          destAddress: this.endAd.address,
          destLongitude: this.endAd.lng,
          destLatitude: this.endAd.lat
        }
      }else{
        return {
          destRegion: this.endAd.ad_info.adcode,
          destProvinceName: this.endAd.address_components.province,
          destCityName: this.endAd.address_components.city,
          destAddress: this.data.choseAddress.receiveAddress+ this.data.choseAddress.houseNo,
          destLongitude: this.endAd.location.lng,
          destLatitude: this.endAd.location.lat
        }
      }
      
    }

    let reqData= Object.assign({}, this.fromData, {
      
      tripAmount: this.data.crosscityCharge,

      arriveTime: this.data.arriveTime,

      userId: this.data.$state.user.id,

      shopIds: (this.options.shopId+ '').split(",").map(v=> +v),

      receiveUserName: this.data.choseAddress.receiveName,
      receiveUserPhone: this.data.choseAddress.receivePhone,
      receiveUserAddress: this.data.choseAddress.receiveAddress,
      houseNo: this.data.choseAddress.houseNo,

      receiveType: this.data.putType, //快递方式
      lines: JSON.parse(this.options.skus)

    }, getStartAd(), getEndAd());

    console.log(reqData);

    this.setData({
        spinShow: true,
    })
    
    if(e.detail.formId){
        sendTemplmsg.call(this, e.detail.formId);
    }

    this.POST(this.$url.orders.reorder, reqData, {proxy: true}).then((res)=>{
        this.setData({
            spinShow: false,
        })
        this.toast({
            type: 'success',
            duration: 1000,
            color: '#fff',
            text: '订单需求发布成功',
            success: () => this.redirectTo("/packageOrder/detail/with-auto/index", {
                orderId: res.data,
                from: "find"
            })
        })
    }).catch(()=>{
        this.request= false;
        this.setData({
            spinShow: false,
        })
    })
  }


})