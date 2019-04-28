
import {wx_pay} from './../../../utils/public.tool.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isRadiochange: true,
        spinShow: true,
        src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4074258740,4079621130&fm=26&gp=0.jpg"
    },
    onLoadGetLocalStorage(){
        return [
            {
                pageDataKey: "choseAddress",
                localStorageKey: "choseAddress-order"
            }
        ]
    },
    onLoad(options){

            this.GET(this.$url.orders.watiPayOrderDetail, {orderId: this.options.orderId }).then((res)=>{
                res.data.arriveTime= this.filters.getDayName(res.data.arriveTime, res.data.systemTime);
                res.data.allAmountStr= (   this.getProptry(res.data, "tripAmount", 0) +
                                            this.getProptry(res.data, "goodsAmount", 0)-
                                            this.getProptry(res.data, "discountAmount", 0)
                                        ).toFixed(2);
                this.setData({
                    info: res.data,
                    spinShow: false,
                })
            })

    },
    //支付前 更新订单信息
    payHandel(){

        if(this.data.spinShow) return;

        if(!this.data.choseAddress){
            return this.toast("请完善收货地址信息");
        }

        if(!this.data.isRadiochange){
            return this.toast("请阅读并同意《捎带会员服务条款》");
        }

        this.setData({
            spinShow: true,
        })
        this.POST(this.$url.orders.updateAddress, {
            id: this.options.orderId,
            receiveUserName: this.data.choseAddress.receiveName,
            receiveUserPhone: this.data.choseAddress.receivePhone,
            receiveUserAddress: this.data.choseAddress.receiveAddress,
        }, { proxy: true }).then((res)=>{
            this.payWx(res.data);
        }).catch(()=>{
            this.setData({
                spinShow: false,
            })
        })

    },
    //未支付手动取消订单
    orderCancel(){
        this.GET(this.$url.orders.noPayCancelOrder, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            this.toast("取消成功");
            setTimeout(()=>{
                wx.reLaunch({
                    url: '/pages/with-user/index/index',
                })
                // wx.switchTab({
                //     url: "/pages/with-user/index/index"
                // })
            }, 2000)
        })
    },
    //调起微信支付
    payWx(data){
        this.POST(this.$url.orders.mbUserPrePay, { mainOrderId: this.options.orderId, serviceModel: 1 }, { proxy: true }).then((res)=>{

            this.setData({ spinShow: false });

            wx_pay(res).then((res)=>{
                this.dialog.alert({
                    title: '温馨提示',
                    content: '支付成功！',
                    onConfirm: (e)=> {
                        wx.reLaunch({
                            url: '/pages/with-user/index/index',
                        })
                        // wx.switchTab({
                        //     url: "/pages/with-user/index/index"
                        // })
                        //this.redirectTo("/packageOrder/list/with-auto/index")
                    },
                })
            }).catch((res)=>{
                this.dialog.alert({
                    title: '温馨提示',
                    content: '支付失败'+ (res.err_desc ? ','+ res.err_desc : ''),
                    onConfirm: (e)=>{

                    },
                })
            })

        }).catch(()=>{
            this.setData({ spinShow: false });
        })

    },

    radiochangeHandel({detail}){
        this.setData({
            isRadiochange: detail.value
        })
    },

})
