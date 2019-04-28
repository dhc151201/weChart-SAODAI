import { $stopWuxRefresher, $wuxSelect } from './../../../libs/wux/index.js'

Page({
  pageConfig: {
    status: [0, 1, 2],
    pageNum: 1,
    pageSize: 20
  },
  data: {
    orderList: [],
    shopIndex: 0,
  },
  onLoad: function (options) {
    //未登录
    if (!this.data.$state.user.id) {
      return wx.reLaunch({
        url: "/packageScope/pages/scope/index?after=/pages/order/list/index"
      })
      return;
    }
    //未入驻商户
    if (!this.data.$state.user.merchantId){
      //正式入驻
      if (this.data.$state.typeIn== 0){
        wx.reLaunch({
          url: "/pages/user/join/index"
        })
        return;
      }else{
        wx.reLaunch({
          url: "/pages/shop/add/index"
        })
        return;
      }
    }

    this.getShopList();
  },
  watch: {
    shopId: function(newValue, oldValue){

      if (newValue != oldValue){
        this.pageConfig.shopId= newValue;
        this.getList();
      }

    }
  },
  onPulling() {
    //console.log('onPulling')
  },
  onRefresh() {

      this.POST(this.$url.orders.list, Object.assign({}, {
          status: this.pageConfig.status,
          pageNum: 1,
          pageSize: this.pageConfig.pageSize * this.pageConfig.pageNum,
          shopId: this.data.shoplist[this.data.shopIndex].id,
      })).then((res) => {
          this.setData({
              orderList: res.data.data
          });
          this.pageRequestAfter(res)
      })

    setTimeout(() => {
      $stopWuxRefresher()
    }, 2000)
  },
  getList(){
      this.POST(this.$url.orders.list, Object.assign(this.pageConfig, {
          shopId: this.data.shoplist[this.data.shopIndex].id,
          lastDate: this.data.orderList.length ? this.data.orderList[this.data.orderList.length-1].createTime : undefined
        })).then((res) => {
              if (this.pageConfig.pageNum == 1) {
                this.data.orderList = [];
              }
              this.setData({
                orderList: this.data.orderList.concat(res.data.data)
              });
              this.pageRequestAfter(res)
        })
  },
  ontabChange({ detail }) {
      //console.log(detail)
    this.pageConfig.status = [[], [], [0, 1, 2], [], [], [3, 4, 5], [6]][detail.key];
    this.pageConfig.pageNum = 1;

      this.setData({
          orderList: []
      }, this.getList)

  },
  onReachBottom(){
    if (!this.pageRequestBefore()) return;
    this.pageConfig.pageNum++;
    this.getList();
  },
  getShopList(){
      this.GET(this.$url.shop.queryMerchantShopList, { merchantId: this.data.$state.user.merchantId }).then(res => {
          let list = (res.data.enteredShops || []).concat(res.data.waitEnteredShops);
          this.setData({
              shoplist: list,
              shopIndex: 0,
          })
          list.length && this.getList();
      })
  },
  openPickerShops(){
      $wuxSelect().open({
          value: this.data.shoplist[this.data.shopIndex].shopName,
          options: this.data.shoplist.map(v=>{
              return v.shopName
          }).filter(v=>v),
          onConfirm: (value, index, options) => {
              this.setData({
                  shopIndex: index,
                  orderList: []
              }, this.getList)

          },
      })
  },

  accept(e){
    if(!e.currentTarget.dataset.orderid){
      return this.alert('订单识别有误，请重试！')
    }
    wx.navigateToMiniProgram({
      appId: "wxb3c9cf1fb1e3dc79",
      path: "packageOrder/detail/with-help/index?share=true&from=find&orderId="+ e.currentTarget.dataset.orderid,
      envVersion: true ? "trial" : "release",
      success: ()=>{
          // wx.reLaunch({
          //     url: "/pages/with-help/index/index"
          // })
        //this.redirectTo("/pages/with-help/index/index");
      }
    })
  }

})
