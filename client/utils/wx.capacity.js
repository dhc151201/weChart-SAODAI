"use strict";
import config from './global.config.js'

//qq地图 https://lbs.qq.com/qqmap_wx_jssdk/index.html
const QQMapWX = require('./../libs/qqmap/qqmap-wx-jssdk.min.js');

const qqmapsdk = new QQMapWX({
  key: config.QQMapKey
});

//检验授权项及提示前往授权
const getSetting = function (scope = 'scope.userLocation'){
  return new Promise((resolve, reject) => {
    if (!scope) return reject("scope授权项为空（string）.");
    wx.getSetting({ //授权校验
      success(res) {
        switch (res.authSetting[scope]){
          case false: //已拒绝过授权
            wx.showModal({
              title: '提示',
              content: '是否前往设置允许获取位置信息',
              success({ confirm }) {
                confirm && wx.openSetting();
              }
            })
            break;
          case undefined: //第一次授权
            wx.authorize({
              scope: scope,
              success() {
                resolve()
              },
              fail() {
                console.log("用户拒绝了授权");
              }
            })
            break;
          case true: //已授权
            resolve()
            break;
        }
      }
    });
  })
};

//qq地图定位 ---------
//地址解析
const geocoder= function (address){
  return new Promise((resolve, reject) => {
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        resolve(res.result);
      },
      fail: function (res) {
        console.log(res);
        reject()
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  })
};

//地址逆解析
const reverseGeocoder= function (latitude, longitude){

    return new Promise((resolve, reject) => {
      //授权验证
      getSetting().then(() => {
        qqmapsdk.reverseGeocoder({
          location: latitude ? {
            latitude: latitude,
            longitude: longitude
          } : '',
          success: function (res) {
            if (res.result) {
              resolve(res.result);
            } else {
              console.warn("腾讯地图错误.")
            }
          },
          fail: function (res) {
            console.log(res);
            reject()
          },
          complete: function (res) {
            //console.log(res);
          }
        });

      })

    })

};

//搜索
const search= function (keyword, location){
  return new Promise((resolve, reject)=>{
    qqmapsdk.search({
      keyword: keyword,  //搜索关键词
      page_size:  20,
      location: location,  //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        resolve(res.data);
      },
      fail: function (res) {
        console.log(res);
        reject()
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  })
};

//距离计算
const calculateDistance= function(object){
  return new Promise((resolve, reject) => {
    qqmapsdk.calculateDistance({
      from: object.from,
      to: object.to,
      success: function (res) {
        resolve(res.result);
      },
      fail: function (res) {
        console.log(res);
        reject()
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  })
};

//腾讯地图定位
const getLocation= function(){
  return new Promise((resolve, reject)=>{
    getSetting("scope.userLocation").then(()=>{
      wx.getLocation({
        type: 'wgs84',
        altitude: "true",
        success(res) {
          console.log("定位成功：", res);
          resolve(res);
        },
        fail() {
          console.warn("定位失败！");
          reject()
        }
      });
    })
  })
};


export {
  getLocation,
  calculateDistance,
  search,
  reverseGeocoder,
  geocoder,
  getSetting
}
