//公共
const bus= {
  "mapInverse": "common/map/inverse",
  "weiChatCode": "merchant/member/getWechatCode",
    preAuth: "public/wechat/preAuth"
}

//店铺
const shop= {
  //生成临时店铺
  saveTemp: "merchant/shop/saveTempShop",
  //生成正式店铺
  saveShop: "merchant/shop/saveShop",
  submitShopCert: "merchant/shop/submitShopCert",
  queryMerchantShopList: "merchant/shop/queryMerchantShopList",
  getShopDeatil: "merchant/shop/getShopDeatil",
  updateShop: "merchant/shop/updateShop",
  tagQueryList: "common/tag/queryList",
}
//商品
const goods = {
  getChilds: "common/category/getChilds",
  getSkuSpuByState: "merchant/sku/getSkuSpuByState",
  batchUpdateUseState: "merchant/spu/batchUpdateUseState",
  update: "merchant/spu/update",
  create: "merchant/spu/create"
}
//用户
const user = {
  login: "merchant/member/login",
  getUserInfo: "merchant/member/getUserInfo",
  refreshToken: "merchant/member/refreshToken",
  getPhone: "merchant/member/getPhone",
  saveMerchant: "merchant/merchant/saveMerchant",
  getMerchant: "merchant/merchant/getMerchant",
}
//订单
const orders = {
  list: "merchant/order/shopOrder",
  detail: "merchant/order/shopOrderByMainId"
}
//钱包
const wallet = {

}

export default {
  bus, shop, user, goods, orders, wallet
}
