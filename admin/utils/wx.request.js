"use strict";

import behavior from './behavior.js'
import urlConfig from './url.config.js'
import config from './global.config.js'

// var baseUrl = "http://172.16.80.138:9010/webapi/v1/"; //亚峰服务器
// var baseUrl = 'http://172.16.80.65:9010/webapi/v1/'; //本源服务器
// var baseUrl = 'http://172.16.60.81:9010/webapi/v1/';//开发服务器
// var baseUrl = 'http://testsd.rrkd.cn:8030/webapi/v1/'; //测试服务器
var baseUrl = config.REQUEST + '/webapi/v1/';


const configDefault = function(){
  return {
    showLoading: false,
    header: { appType: 2, token: wx.getStorageSync("token") }
  }
};

var ajax = (model)=> {

  model.config = Object.assign({}, configDefault(), model.config);

  //console.log(model)
  
  model.config.showLoading && behavior.loading.show({
    text: '数据加载中',
    mask: false
  })

  //拼接url
  if (!model.url.includes('http')) model.url = baseUrl + model.url;

  console.warn("request url ::: ", model.url, model);

  //get参数拼接
  if (model.method == "get" && model.data !== undefined) {
    let arr= [];
    for (let k in model.data) {
      if (model.data[k] !== undefined && model.data[k].toString() !== '') {
        arr.push(k + "=" + model.data[k]);
      }
    };
    model.url+= '?'+ arr.join("&");
    model.data = '';
  };

  //返回Promise对象
  return new Promise(
    function (resolve, reject) {

      function ajax(model){
        return wx.request({
          header: model.config.header,
          method: model.method,
          url: model.url,
          data: model.data,
          success: (res) => {

            console.warn("response url ::: ", model.url, res);

            behavior.loading.hide();

            if (res.statusCode == 200 && res.data && res.data.code !== undefined) {
              switch (res.data.code.toString()){
                case "200": resolve(res.data); break;
                case "200004": refreshToken(model); break;
                case "100002" : 
                  wx.clearStorage();
                  wx.reLaunch({
                    url: '/packageScope/pages/scope/index',
                  });
                  break;
                default: behavior.dialog.alert(res.data.debug); reject();
              }
            }
            else {
              //错误信息处理
              behavior.dialog.alert('服务器繁忙，请联系客服');
              reject();
            };

          }
        });
      };
      //token 失效处理函数
      function refreshToken(model){
        wx.request({
          url: baseUrl + urlConfig.user.refreshToken,
          header: model.config.header,
          success(res) {

            if (res.statusCode == 200 && res.data && res.data.code !== undefined){
              switch (res.data.code.toString()) {
                case "200": 
                  wx.setStorageSync("token", res.data.data); 
                  model.config.header.token = res.data.data;
                  ajax(model); 
                  break;
                default: behavior.dialog.alert(res.data.debug); reject();
              }
            } 
            //错误信息处理
            else {
              behavior.dialog.alert('服务器繁忙，请联系客服');
              reject();
            }
            
          }
        }); 
      }

      let requestTask= ajax(model);
      //requestTask.abort();

    }
  )
}

var get = function (url = "", data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    ajax({ method: 'get', url, data, config }).then(resolve).catch(reject);
  })
}

var post = (url = "", data = {}, config = {})=> {
  return new Promise((resolve, reject) => {
    ajax({ method: 'post', url, data, config }).then(resolve).catch(reject);
  })
}

export default {
  baseUrl, 
  ajax,
  get,
  post
}