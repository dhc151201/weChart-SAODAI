"use strict";

import behavior from './behavior.js'
import { user } from './url.config.js'
import config from './global.config.js'
import store from "./../store/index.js"

var baseUrl = config.REQUEST + '/webapi/v1/';


const configDefault = function(){
  return {
    showLoading: false,
    header: { 
        appType: 1, 
        token: wx.getStorageSync("token"),
        versionType: config.environment,
        'Cache-Control': 'public, max-age=31536000'
    }
  }
};

var ajax = (model)=> {

    //if (!store.networkType()) return ;

  model.config = Object.assign({}, configDefault(), model.config);

  //console.log(model)

  model.config.showLoading && behavior.loading.show({
    text: '数据加载中',
    mask: false
  });

  //拼接url
  if (!model.url.includes('http')) model.url = baseUrl + model.url;

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

      console.warn("Request Model : ", model.url.replace('//testsd.rrkd.cn:8030/webapi/v1/', ''), model);

      function ajax(model){
        return wx.request({
          header: model.config.header,
          method: model.method,
          url: model.url,
          data: model.data,
          success: (res) => {

            behavior.loading.hide();

            if (res.statusCode == 200 && res.data && res.data.code !== undefined) {

              console.warn(`Response Model: ${model.url.replace('//testsd.rrkd.cn:8030/webapi/v1/', '')}`);
              console.warn(res.data);

              switch (res.data.code.toString()){
                case "200": resolve(res.data); break;
                case "200004": refreshToken(model); break;
                case "200009" : 
                case "200005" :
                case "100002" :
                  wx.clearStorage();
                  //const app= getApp();
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

          },
          fail: (res)=>{
              //检查网络状态，并更新到app，无网络则跳转尝试连接页
              const app = getApp();
              wx.getNetworkType({
                  success: (res) => {
                      app.globalData.networkType = res.networkType;
                      wx.setStorageSync("parms", store.$state.parms);
                      res.networkType == 'none' && wx.redirectTo({
                          url: '/pages/no-network/index?after=/' + store.$state.route,
                      })
                  }
              })
          }
        });
      };
      //token 失效处理函数
      function refreshToken(model){
        wx.request({
          url: baseUrl + user.refreshToken,
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

      if( wx.getStorageSync("token") || (store.$state.route || '').includes('pages/scope/index') ) {
        let requestTask= ajax(model);
        //requestTask.abort();
      }
      else{
        return reject();
      }

    }
  )
};

//储存需要防止连续请求的map数据结构(动态的)
var proxySplitMap= new Map();

var SingletonProxyAjax= function(){

  var ProxyAjax= function(){
    this.defaultConfig= {
      splitTime: 3000
    };
  }
  ProxyAjax.prototype.send= function(model){

    return new Promise((resolve, reject)=>{
      
      if(model.config.proxy){
        model.mapKey= JSON.stringify(model);
        //console.log(model.mapKey, proxySplitMap.has(model.mapKey))
        if(proxySplitMap.has(model.mapKey)){
          console.error("继续请求已被拦截。。。。。")
          reject();
        }
        else{
          this.push(model);
          //console.log("正常发起请求。。。。。")
          ajax(model).then(resolve).catch(reject);
          this[model.mapKey]= setTimeout(()=>{
            console.warn("清除timeout")
            this.pop(model);
            clearTimeout(this[model.mapKey]);
            this[model.mapKey]= null;
          }, model.config.splitTime || this.defaultConfig.splitTime);
        }

      }
      else{
        ajax(model).then(resolve).catch(reject);
      }
    })
    
  }
  ProxyAjax.prototype.push= function(model){
    proxySplitMap.set(model.mapKey, 1);
    //console.log(model.mapKey, proxySplitMap)
  }
  ProxyAjax.prototype.pop= function(model){
    proxySplitMap.delete(model.mapKey);
  }

  var proxy;

  var init= function(model){
    return new Promise((resolve, reject)=>{
      if(proxy=== undefined){
        proxy= new ProxyAjax();
      }
      proxy.send(model).then(resolve).catch(reject);
    })
    
  }

  return {
    init
  }
}


var get = function (url = "", data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    SingletonProxyAjax().init({ method: 'get', url, data, config }).then(resolve).catch(reject);
  })
};

var post = (url = "", data = {}, config = {})=> {
  return new Promise((resolve, reject) => {
    SingletonProxyAjax().init({ method: 'post', url, data, config }).then(resolve).catch(reject);
  })
};

export {
  baseUrl,
  //ajax,
  get,
  post
}
