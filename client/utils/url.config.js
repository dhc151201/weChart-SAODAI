//公共
const bus= {
  weiChatCode: "mbuser/member/getWechatCode",
  bannerList: "common/banner/webApiList",
  professionlist: "mbuser/member/professionlist",
  getCheckCode: "mbuser/member/getCheckCode",
  messagebox: "common/messagebox/webApiList",
  userMessage: "common/messagebox/userMessage",
  eventTracking: "mbuser/stationmsg/eventTracking"
}

//行程
const trip= {
  create: "mbuser/trip/create",
  queryTripUserByShopId: "mbuser/trip/queryTripUserByShopId",
  queryById: "mbuser/trip/queryById",
  queryCustomerHeadImageByTripId: "mbuser/order/queryCustomerHeadImageByTripId",
  querySimpleUserInfoByUserId: "mbuser/member/querySimpleUserInfoByUserId",
  queryMyTripsByState: "mbuser/trip/queryMyTripsByState",
  receiveRedPacket: "mbuser/random/activity/receiveRedPacket",
  queryCurrentRedpacket: "mbuser/random/activity/queryCurrentRedpacket",
  activeRedPackets: "mbuser/random/activity/activeRedPackets"
}

//店铺
const shop= {
  queryHotwords: "search/queryHotwords",
  searchRrsdShop: "search/searchRrsdShopPost",
  //优选店铺 九宫格
  queryRecommandshop: "mbuser/shop/queryRecommandshop",

  getShopsByDistance: "mbuser/shop/getShopsByDistance",
  shopDetailForC: "mbuser/shop/shopDetailForC",
  getShopsByTripId: "mbuser/shop/getShopsByTripId",
  getChilds: "common/category/getChilds",
  getShopTripByCategory: "mbuser/shop/getShopTripByCategory",
  getHotShopSku: "mbuser/shop/getHotShopSku"
}
//商品
const goods = {
  getSkuList: "mbuser/member/getSkuList",
  getSpuCountByDistance: "mbuser/spu/getSpuCountByDistance",
  getSkuSpuByState: "merchant/sku/getSkuSpuByState",
  getSkuSpuBySpuForC: "mbuser/sku/getSkuSpuBySpuForC",
  queryAcceptMainOrdersByTripId: "mbuser/order/queryAcceptMainOrdersByTripId"
}
//用户
const user = {
  login: "mbuser/member/login",
  getPhone: "mbuser/member/getPhone",
  getUserInfo: "mbuser/member/getUserInfo",
  refreshToken: "mbuser/member/refreshToken",
  updatePhoneById: "mbuser/member/updatePhoneById",
  update: "mbuser/member/update",
  addressCreate: "mbuser/address/create",
  addressUpdate: "mbuser/address/update",
  addressList: "mbuser/address/list",
  queryLatestTrip: "mbuser/trip/queryLatestTrip",
  initiativeUpdateStateByTripId: "mbuser/trip/initiativeUpdateStateByTripId",
  stationmsgList: "mbuser/stationmsg/list",
  msgUnreadNum: "mbuser/stationmsg/countUnReadStation",
  updateMsgStatus: "mbuser/stationmsg/updateRead",
  deleteOneMsg: "mbuser/stationmsg/deleteByIds",
  clearAllMsg: "mbuser/stationmsg/clearAll"
}
//订单
const orders = {
  create: "mbuser/order/create",
  reorder: "reorder/create",
  watiPayOrderDetail: "order/watiPayOrderDetail",
  updateAddress: "mbuser/order/updateAddress",
  mbUserPrePay: "mbuser/pay/mbUserPrePay",
  list: "order/list",
  quertTripOrder: "order/quertTripOrder",
  refundDetail: "order/refundDetail",
  findRefundDetail: "reorder/refundDetail",
  ignore: "order/ignore",
  accept: "order/accept",
  acceptTheOrder: "reorder/acceptTheOrder",
  getDeliveryOrder: "order/getDeliveryOrder",
  take: "order/take",
  delivery: "order/delivery",
  noPayCancelOrder: "order/noPayCancelOrder",
  cancel: "reorder/cancel",
  signIn: "order/signIn",
  queryById: "order/queryById",
  orderDetail: "reorder/orderDetail",
  orderListByShopId: "reorder/orderListByShopId",
  queryMainOrderCountByIncidentallyId: "mbuser/order/queryMainOrderCountByIncidentallyId",
  getAllBubbleInfos: "mbuser/order/getAllBubbleInfos",
  deleteAllBubbleByStatus: "mbuser/order/deleteAllBubbleByStatus",
  //是否首单(每日)
  isFirstOrderByDays: "order/validateFirstOrder",
  // 获取求捎带待接单订单列表
  getAllDoingOrder: "reorder/getAllDoingOrder",
  // 求捎带接单
  acceptOrder: "reorder/acceptTheOrder"
}
//钱包
const wallet = {
  query: "pay/account/query",
  tansferToUser: "mbuser/pay/tansferToUser",
  detail: "pay/account/detail",
  //红包卡券
  queryUserNum: "activity/queryUserNum",
  queryUserAmount: "activity/queryUserAmount",
  queryUserTemplateList: "activity/queryUserTemplateList",
  queryUserNoRead: "activity/queryUserNoRead",
  updateReadStatus: "activity/updateReadStatus",
  
}

//活动
const activity= {
  queryTip: "mbuser/activity/queryTip",
  readUserTemplate: "mbuser/activity/readUserTemplate",
  queryActivityDetail: "mbuser/random/activity/queryActivityDetail",
  queryUserByTripId: "mbuser/random/activity/queryUserByTripId",
  queryPartActivityUsers: "mbuser/random/activity/queryPartActivityUsers",
  queryCurrentUserPartActivity: "mbuser/random/activity/queryCurrentUserPartActivity"
}


export {
  bus, shop, user, goods, orders, wallet, trip, activity
}