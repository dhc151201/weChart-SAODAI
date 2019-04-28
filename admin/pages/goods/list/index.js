import { $wuxSelect } from './../../../libs/wux/index'
import { $wuxToptips } from './../../../libs/wux/index'

Page({
  pageConfig: {
    state: 1,
    pageNum: 1,
    pageSize: 10
  },
  data: {
    goodsList: [],
    shopList: [],
    shopIndex: 0,
    tabChose: 1,
  },
  onLoad: function (options) {
    this.GET(this.$url.shop.queryMerchantShopList, { merchantId: this.data.$state.user.merchantId }).then((res)=>{
      
      let shopList = res.data.enteredShops.concat(res.data.waitEnteredShops);
      if (!shopList.length) {
        this.alert({
          resetOnClose: true,
          title: '提示',
          content: '暂无商铺，立即前往添加商铺吧',
          onConfirm: (e)=> {
            this.redirectTo("/pages/shop/add/index")
          },
        })
        return;
      }
      this.shopOptions = shopList.map((v)=>{
        return {
          title: v.shopName,
          value: v.id
        }
      })
      this.setData({
        shopList: shopList,
        shopId: shopList[0].id,
      })
      
    })
  },
  onShow() {
    if (this.loaded) {
      this.pageConfig.pageNum = 1;
      this.getSkuSpuByState();
    }
  },
  onReachBottom() {
    if (!this.pageRequestBefore()) return;
    this.pageConfig.pageNum++;
    this.getSkuSpuByState();
  },
  watch: {
    shopId: function(newVal, oldVel){
      this.pageConfig.pageNum= 1;
      this.pageConfig.shopId = newVal;
      this.getSkuSpuByState();
    }
  },
  getSkuSpuByState() {
    this.POST(this.$url.goods.getSkuSpuByState, this.pageConfig).then((res) => {
      if (this.pageConfig.pageNum== 1){
        this.data.goodsList= [];
      }
      this.setData({
        goodsList: this.data.goodsList.concat(res.data.data)
      });
      this.pageRequestAfter(res)
    })
  },
  ontabChange({ detail }){
    this.setData({
      tabChose: detail.key
    })
    this.pageConfig.state= +detail.key;
    this.pageConfig.pageNum = 1;

    this.data.goodsList = [];

    this.getSkuSpuByState();

  },
  editHandel(e){
    wx.setStorageSync("goods-info", this.data.goodsList[this.tool.getDataset(e).index]);
    this.navigateTo("/pages/goods/add/index", {
      id: this.tool.getDataset(e).id,
      spuId: this.tool.getDataset(e).spuid
    })
  },
  choseAll() {
    this.choseAllGoods = !this.choseAllGoods;
    this.data.goodsList.map((v, i)=>{
      this.data.goodsList[i].chose = this.choseAllGoods;
      this.setData({
        goodsList: this.data.goodsList
      })
    })
  },
  choseGoodsHandel(e){
    let obj= {};
    obj["goodsList[" + this.tool.getDataset(e).index + "].chose"]= !this.data.goodsList[this.tool.getDataset(e).index].chose;
    this.setData(obj);
  },
  downGoodsGroup(){
    let skuIds = [];
    this.data.goodsList.map((v)=>{
      if(v.chose){
        skuIds.push(v.spuId); 
      }
    })
    if (!skuIds.length) {
      return $wuxToptips().warn({
        hidden: true,
        text: "请选择需要下架商品",
      })
    }
    this.POST(this.$url.goods.batchUpdateUseState + "?state=0", skuIds).then((res)=>{
      this.pageConfig.pageNum = 1;
      this.data.goodsList = [];

      this.getSkuSpuByState();
    })
  },
  upGoodsGroup() {
    let skuIds = [];
    this.data.goodsList.map((v) => {
      if (v.chose) {
        skuIds.push(v.spuId);
      }
    })
    if (!skuIds.length){
      return $wuxToptips().warn({
        hidden: true,
        text: "请选择需要上架商品",
      })
    }
    this.POST(this.$url.goods.batchUpdateUseState + "?state=1", skuIds).then((res) => {
      this.pageConfig.pageNum = 1;
      this.data.goodsList = [];

      this.getSkuSpuByState();
    })
  },
  actionsheetShow() {
    $wuxSelect().open({
      value: this.data.shopId,
      options: this.shopOptions,
      onConfirm: (value, index, options) => {
        this.setData({
          shopId: value,
          shopIndex: index
        })
      },
    })
  },

})