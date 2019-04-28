import url from './url.config.js';
import $ from './wx.request.js';
import store from '../store/index.js';

var joinLocation = function (reqData) {
  return Object.assign({}, {
    lat: store.$state.location.wxMarkerData[0].latitude,
    lng: store.$state.location.wxMarkerData[0].longitude
  }, reqData);
};

//公用的
const bus = {
  banner: () => {
    return new Promise((r, j) => {
      $.get(url.bus.banner).then(r);
    });
  }
}

//店铺
const shop = {
  hotShopList: (reqData)=>{
    return new Promise((r, j) => {
      $.post(url.shop.hotShopList, joinLocation(reqData) ).then(r);
    });
  },
  payShopList: (reqData) => {
    return new Promise((r, j) => {
      $.post(url.shop.payShopList, joinLocation(reqData) ).then(r);
    });
  },
}
//商品
const goods = {
  
}
//用户
const user = {
  login: (reqData)=>{
    return new Promise((r, j)=>{
      $.get(url.user.login, reqData).then( r );
    });
  }
}
//订单
const orders = {
  
}
//钱包
const wallet = {
  
}

export default {
  bus, shop, user, goods, orders, wallet
}