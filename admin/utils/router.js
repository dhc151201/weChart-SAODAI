"use strict"

//页面配置信息
// 标题 建议配置在pege.json中
const CONFIG = {
  // "pages/test/index": {
  //   meta: {
  //     mastLogin: false //不需要登录的页面 配置此项为false
  //     title: "首页"
  //   }
  // },
  "packageShare/in/shop/index": {
    meta: {
      mastLogin: false 
    }
  },
  "packageScope/pages/scope/index": {
    meta: {
      mastLogin: false
    }
  },

};


//路由跳转query组装序列化
const queryUrlString = function (query = {}) {
  let arr = [];
  for (let k in query) {
    arr.push(`${k}=${query[k]}`);
  }
  return arr.length ? `?${arr.join("&")}` : "";
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
const routerBefore = function (path, query= {}) {

  return new Promise((relsove, reject) => {
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
  routerBefore(e.currentTarget.dataset.url).then(() => {
    wx[e.currentTarget.dataset.hreftype || 'navigateTo']({
      url: e.currentTarget.dataset.url
    })
  })
}

export default {
  navigateTo, redirectTo, navigateBack, href, CONFIG
}

