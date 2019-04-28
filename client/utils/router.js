"use strict"

import { queryUrlString } from './public.tool.js'

//页面配置信息
// 标题 建议配置在pege.json中
const CONFIG = {
  // "pages/test/index": {
  //   meta: {
  //     mastLogin: false //不需要登录的页面 配置此项为false
  //     title: "首页"
  //   }
  // },
  "packageScope/pages/scope/index": {
    meta: {
      mastLogin: false
    }
  },

};

//获取返回级数及该页面的data query设置
const getDelta = function (path = "", query) {
  let pages = getCurrentPages(), delta = 1;
  path = path.split("?")[0];
  for (let len = pages.length - 2; len >= 0; len--) {
    if ('/' + pages[len].route == path) {
      //历史存在过页面记录
      break;
    }
    delta++;
  }
  if (query instanceof Object) {
    let prevPage = pages[pages.length - delta- 1];//上一页面
    prevPage.setData(query);
    console.log(prevPage);
  }
  return delta;
};

//路由前守卫
const routerBefore = function (path= "", query= {}) {

  return new Promise((relsove, reject) => {

    console.log("routerBefore::: ", path, query);
    //路径及参数校验
    if (
        (Object.keys(query).length && path.includes("?")) ||
        (path.match(/\?/g) || []).length> 1 ||
        !path.startsWith("\/")
    ){
      try{
        let pages = getCurrentPages();
        pages.lastItem().alert("参数配置有误，请联系客服");
      }catch(e){
        wx.showModal({
          title: '温馨提示',
          content: '参数配置有误，请联系客服',
        });
      }finally{
        console.error("routerBefore ::: ", path+ queryUrlString(query) );
        return reject();
      }
    }

    let config = CONFIG[path.replace("/", "")] || {};
    console.log(path+ "路由守卫配置：：：", config)

    if (config.meta && config.meta.mastLogin === false) return relsove();

    console.warn("路由守卫信息检测：：：" + (wx.getStorageSync("userInfo") || '未登录,即将跳转授权登录'));
    if (wx.getStorageSync("userInfo")) return relsove();

    query.after = path;
    wx.navigateTo({
      url: '/packageScope/pages/scope/index' + queryUrlString(query),
    });

  })
}

//navigateTo
let navigateTo= (path, query) => {
  routerBefore(path, query).then(()=>{
    wx.navigateTo({
      url: path + queryUrlString(query)
    })
  })
}

//redirectTo
let redirectTo= (path, query) => {
  routerBefore(path, query).then(() => {
    wx.redirectTo({
      url: path + queryUrlString(query)
    })
  })
}

//history back
let navigateBack= (path, query) => {
  if (!path || path instanceof Object){
    wx.navigateBack();
    return;
  }
  else if (path instanceof Number)
    wx.navigateBack({
      delta: path
    });
  else
    wx.navigateBack({
      delta: getDelta(path, query) || 1
    });
}

//link href
let href= (e) => {
  //console.log("---------------",e)
  routerBefore(e.currentTarget.dataset.url).then(() => {
    wx[e.currentTarget.dataset.hreftype || 'navigateTo']({
      url: e.currentTarget.dataset.url
    })
  })
}

export default {
  navigateTo, redirectTo, navigateBack, href, CONFIG
}

