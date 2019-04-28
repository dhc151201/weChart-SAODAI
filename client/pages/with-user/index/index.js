import {$stopWuxRefresher} from './../../../libs/wux/index.js'
import {getStartDestName} from "./../../../utils/public.tool.js"
import {activeRedPackets} from "./../../../assets/js/trip.tip.js"
import {receiveRedPacket as order_receiveRedPacket} from "./../../../assets/js/order.tip.js"
import {sendTemplmsg} from "./../../../assets/js/tmplmsg.js"
import {$sdaiMask} from "./../../../components/base/index.js"

Page({
    /**
     * 组件的属性列表
     */
    properties: {
        allNum: {
            type: Number,
            value: 0
        }
    },
    data: {
        spinShow: true,
        showSpinTop: true,
    },
    onLoadGetLocalStorage(){
        return [
            {
                pageDataKey: "wallet", 
                localStorageKey: "user-index-wallet",
                default: {}
            },
            {
                pageDataKey: "voucher", 
                localStorageKey: "user-index-voucher",
                default: 0
            }
        ]
    },
    onLoad: function (options) {
        wx.showShareMenu();
        this.selectAll();
        this.setData({
            profession: (this.data.$state.user.profession || '').split(",").filter(v => v)
        })
    },
    onShow: function () {
        if (this.loaded) {
            this.getUserInfo().then(() => {
                this.selectAll();
                this.setData({
                    profession: (this.data.$state.user.profession || '').split(",").filter(v => v)
                })
            });
        }
        activeRedPackets.call(this);
    },
    selectAll(){
        this.getUnread()
        this.queryLatestTrip();
        this.walletQuery();
        this.queryUserNoRead();
        this.queryUserNum();
        this.getAllBubbleInfos();
    },
    queryLatestTrip() {
        this.getLatlng().then(data => {
            this.POST(this.$url.user.queryLatestTrip, data).then((res) => {
                res.data = this.getProptry(res, "data", []).map((v, i) => {
                    v.tripInfo = this.getProptry(v, "tripInfo", {});
                    v.doing = this.getProptry(v, "doing", []);
                    v.forDelivery = this.getProptry(v, "forDelivery", []);
                    v.waitingTake = this.getProptry(v, "waitingTake", []).map(m => {
                        m.tripId = v.tripInfo.id;
                        return m;
                    });
                    if (v.tripInfo.id) {
                        this.queryAcceptMainOrdersByTripId(v.tripInfo.id, i);
                        v.tripInfo = getStartDestName(v.tripInfo);
                    }
                    return v;
                });
                this.setData({
                    tripList: res.data,
                    spinShow: false,
                    showSpinTop: false
                })

                //res.data.tripInfo.id && this.queryAcceptMainOrdersByTripId(res.data.tripInfo.id);

                $stopWuxRefresher();


            })
        })
    },
    walletQuery() {
        this.POST(this.$url.wallet.query, {isQueryIncome: false}).then((res) => {
            this.setData({
                wallet: res.data
            })
            wx.setStorage({
                key: 'user-index-wallet',
                data: res.data || {}
            })
            console.log("walletQuery:::", res.data);
        })
    },
    //未支付，待收货气泡
    getAllBubbleInfos(){
        this.GET(this.$url.orders.getAllBubbleInfos).then((res) => {
            this.setData({
                bubbles: Object.values(res.data)
            })
        })
    },
    queryAcceptMainOrdersByTripId(tripId, i) {
        this.GET(this.$url.goods.queryAcceptMainOrdersByTripId, {tripId: tripId}).then((res) => {
            let obj = {};
            obj["tripList[" + i + "].tripStac"] = res.data;
            this.setData(obj);
        })
    },
    //未读红包卡券数量
    queryUserNoRead(){
        this.POST(this.$url.wallet.queryUserNum, {isRead: 0}).then((res) => {
            this.setData({voucherNoRead: res.data});
        })
    },
    //红包卡券总数量
    queryUserNum(){
        this.POST(this.$url.wallet.queryUserNum ).then((res) => {
            this.setData({voucher: res.data});
            wx.setStorage({
                key: 'user-index-voucher',
                data: res.data || {}
            })
        })
    },
    //体现
    /*
    tansferToUser(){
      if(this.data.wallet.amount< 1){
          return this.toast("提现金额不足");
      }
      this.dialog.dialog().prompt({
          resetOnClose: true,
          content: '输入提现金额',
          fieldtype: 'number',
          defaultText: '',
          placeholder: '请输入提现金额',
          maxlength: 10,
          onConfirm: (e, response)=> {

              if(response< 1){
                  return this.toast("提现金额不足1元");
              }
              else if( typeof +response == "number" ){
                  setTimeout(()=>{
                      this.POST(this.$url.wallet.tansferToUser, {
                          amount: response,
                          desc: "用户捎带收入"
                       }).then((res)=>{
                          this.toast("提现成功");
                          this.walletQuery();
                      })
                  }, 600)

              }
              else{
                  return this.toast("请输入有效的提现金额");
              }
          },
      })


    },
    */
    //暂停/开启接单模式
    initiativeUpdateStateByTripId(e) {
        this.GET(this.$url.user.initiativeUpdateStateByTripId, {
            tripId: this.getDataset(e).id,
            state: this.getDataset(e).status == 0 ? 1 : 0
        }).then(this.queryLatestTrip)
    },
    //接单
    accept(e) {

        this.setData({spinShow: true});

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        this.GET(this.$url.orders.accept, {
            orderId: this.getDataset(e).id
        }, { proxy: true }).then((res) => {
            this.toast("接单成功");
            this.setData({spinShow: false});

            order_receiveRedPacket.call(this, this.getDataset(e).id).then((res)=>{
                if(res.data){
                    this.setData({
                        orderTipinfo: res.data,
                    })
                    $sdaiMask("#mask-tip-order").show();
                }
            })
            this.queryLatestTrip();
        })

    },
    //我已送达
    sureDelivery(e) {
        this.GET(this.$url.orders.delivery, {
            orderId: this.getDataset(e).id
        }).then((res) => {
            this.toast("我已送达成功");
            this.queryLatestTrip();
        })
    },
    showAcceptedHandel() {
        this.setData({
            showAccepted: !this.data.showAccepted
        })
    },
    getUnread() {
        this.GET(this.$url.user.msgUnreadNum).then((res) => {
            this.setData({allNum: res.data})
        })
    },

    onPulling() {
        //console.log('onPulling')
    },
    onRefresh() {
        this.selectAll();
        setTimeout(() => {
            $stopWuxRefresher()
        }, 2000)
    },

    orderTipSureHandel(){
        $sdaiMask("#mask-tip-order").hide();
        this.setData({
            orderTipinfo: null
        })
    },

})
