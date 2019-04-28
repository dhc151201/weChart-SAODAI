// packageFindWith/near/index.js
import { $stopSdaiRefresher } from './../../libs/sdai/index.js';
import { $sdaiPicker } from './../../components/base/index.js';
import areaList from "./../../utils/city.js";
// import moment from './../../libs/moment/moment.min.js'
import miment from './../../libs/moment/miment.min.js'
import { sendTemplmsg } from "./../../assets/js/tmplmsg.js"

Page({
  config: {
    //分页相关控制
    page: {
      waitAccept: {
        pageNum: 1,
        pageSize: 10,
      }
    }
  },
  pageConfig: {},
  endRegion: {},
  trip: {
    tripId:1039
  },
  /**
   * 页面的初始数据
   */
  data: {
    loadmore: 0,
    allWaitAcceptList: [],
    professionData: [],
    spinShow: true,
    choseAddress: {},
    areaList: areaList,
    cityName: "全国"
  },
  watch: {
    choseAddress: function (value) {

      this.latLng = {
        lat: value.lat,
        lng: value.lng
      };
      this.region = value.districtCode;
      this.config.page.waitAccept.pageNum = 1;
      this.getAllDoingOrder(this.config.page.waitAccept, this.endRegion);
      console.log("2")
    }
  },
  getRegionLatlng() {
    Promise.all([this.getDistrictCode(), this.getLatlng()]).then(([region, latLng]) => {
      this.region = region;
      console.log("第一次加载:"+region);
      this.latLng = latLng;
      this.getAllDoingOrder();
      console.log("1");
    })
  },
  getAllDoingOrder(pageConfig) {
    this.POST(this.$url.orders.getAllDoingOrder, Object.assign({tripId: this.options.tripId}, this.latLng, { startRegion: this.region }, this.config.page.waitAccept, pageConfig, this.endRegion)).then((res) =>{
      // console.log(res.data)
      res.data.data = this.getProptry(res, 'data.data', []);
      let profession = res.data.data
      profession.forEach((item) =>{
        item.profession = this.getStr(item.profession)
        
      })
      //分页数据设置
      this.setPageList("allWaitAcceptList", profession, this.config.page.waitAccept);
      console.log(this.data.allWaitAcceptList)
      //分页结果处理
      this.pageRequestAfter(res);

      if (this.config.page.payShop.pageNum == 1) {
        wx.setStorage({
          key: 'findwith-near-allWaitAcceptList',
          data: this.data.allWaitAcceptList || []
        })
        this.setData({ spinShow: false });
      }

      try {
        $stopSdaiRefresher();
      } catch (e) { }
    }).catch(() => {
      this.setData({ spinShow: false });
      try {
        $stopSdaiRefresher();
      } catch (e) { }
    })
  },
  getStr (str) {
    let theStr = '';
    if (str == null) {
      theStr = null;
    } else {
      var result = str.split(",");
      theStr = result[0];
      // console.log(theStr)
    }
    return theStr
  },
  getOrder(e) {
    // console.log(e);
    var headerid = e.currentTarget.dataset.headerid;
    var shopid = e.currentTarget.dataset.shopid;
    var arrivetime = e.currentTarget.dataset.arrivetime
    arrivetime = miment(arrivetime).format("YYYY-MM-DD hh:mm");
    console.log(arrivetime)
    if (e.detail.formId) {
      sendTemplmsg.call(this, e.detail.formId);
    }
    this.confirm({
      content: '该行程捎带费' + e.currentTarget.dataset.tripamount+'元,是否仍要接单？',
      onConfirm: (e) => {
        this.GET(this.$url.orders.acceptOrder, Object.assign({}, {
          headerId: headerid,
          shopId: shopid
        })).then((res) => {
          if (res.code == 200) {
            console.log("接单成功");
            this.toast("接单成功，记得到店铺去取货," + arrivetime +"前送达");
            this.getAllDoingOrder(this.pageConfig);
          } else {
            console.log("接单失败");
            this.toast(res.debug);
            this.getAllDoingOrder(this.pageConfig);
          }
        })
        console.log('凭什么吃我的冰淇淋！')
      },
      onCancel(e) {
        console.log('谢谢你不吃之恩！')
      }
    })
  },
  showArea() {
    $sdaiPicker("#area").show();
  },
  areaCancel() {
    $sdaiPicker("#area").hide();
    if (!this.pageConfig.cityCode) return;
    this.config.page.waitAccept.pageNum = 1;
    this.pageConfig.cityCode = undefined;
    this.endRegion.cityCode = undefined;
    this.setData({
      cityName: "全国"
    })
    this.getLatlng().then(this.getAllDoingOrder(this.pageConfig));
  },
  areaConfirm(e) {
    console.log(e)
    $sdaiPicker("#area").hide();
    this.config.page.waitAccept.pageNum = 1;
    if (e.detail.values[1]) {
      this.pageConfig.cityCode = e.detail.values[1].code;
      this.endRegion.cityCode = e.detail.values[1].code;
      this.setData({
        cityName: e.detail.values[1].name
      })
      this.getLatlng().then(this.getAllDoingOrder(this.pageConfig));
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.$state.location_indexhelp.address && this.options.from != 'grab') {
      // this.data.choseAddress = this.data.$state.location_indexhelp;
      this.setData({ choseAddress: this.data.$state.location_indexhelp});
      // this.getRegionLatlng();
      console.log("在地图上选好了地址")
    } else {
      this.getRegionLatlng();
      console.log('获取定位地址')
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})