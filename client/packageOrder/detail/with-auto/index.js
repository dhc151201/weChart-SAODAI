import {wx_pay} from './../../../utils/public.tool.js';
import {OrderStatus} from "./../../../utils/order.status.js"
import {$stopWuxRefresher} from './../../../libs/wux/index.js'
import {activeRedPackets} from "./../../../assets/js/order.tip.js"
import {getGoodsPuttype} from "./../../../utils/public.tool.js"

Page({

    data: {
        spinShow: true,
        src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4074258740,4079621130&fm=26&gp=0.jpg",
        OrderStatus,
        //送货方式列表
        goodsPuttype: getGoodsPuttype(),
    },
    onLoad: function (options) {
        if(options.from== 'find'){
            this.setData({
                from: 'find'
            })
        }
        this.refreshInterface();
    },
    onShow: function(){
        if(this.loaded){
            this.refreshInterface();
        }
    },
    refreshInterface(){
        if(this.options.from== 'find'){
            this.getLatlng().then(this.orderDetail);
        }
        else{
            this.getLatlng().then(this.queryById);
        }
    },
    //订单详情自定义数据处理
    callDetail(res){

        if(!res.data.isCreateByOneself && this.options.from== 'find' && this.options.share== 'true'){
            this.redirectTo("/packageOrder/detail/with-help/index?from=find&share=true&orderId="+ this.options.orderId);
        }

        res.data.allAmountStr= (   this.getProptry(res.data, "tripAmount", 0) + 
                                    this.getProptry(res.data, "goodsAmount", 0)- 
                                    this.getProptry(res.data, "discountAmount", 0) 
                                ).toFixed(2);
        res.data.details = res.data.details.map( v => {
            v.distance = this.filters.distance(v.distance);
            return v;
        });
        res.data.statusStrIndex =  `_${res.data.status}_${(res.data.payStatus> 0 && res.data.payStatus< 4 ) ? '*' : res.data.payStatus}${this.options.from== 'find' ? '_find' : ''}`;

        console.log("order info:: ", res.data);

        this.setData({
            info: res.data,
            spinShow: false
        })

        try{$stopWuxRefresher()}catch(e){};

        return res;

    },
    queryById(data){
        this.GET(this.$url.orders.queryById, Object.assign(data, this.options)).then(this.callDetail)
    },
    orderDetail(data){
        this.POST(this.$url.orders.orderDetail, Object.assign(data, this.options)).then(this.callDetail)
    },
    showTimeLine(){
        this.setData({
            showtimeline: true
        })
    },
    //确认收货
    signIn(){
        this.GET(this.$url.orders.signIn, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            this.toast("已确认收货");
            activeRedPackets.call(this, this.data.info.orderId);
            this.refreshInterface();
        })
    },
    //未支付手动取消订单
    orderCancel(){
        this.setData({ spinShow: true });
        this.GET(this.options.from== 'find' ? this.$url.orders.cancel : this.$url.orders.noPayCancelOrder, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            //setTimeout(()=>{
                this.toast("取消成功");
                this.refreshInterface();
                this.setData({ spinShow: false });
            //}, this.options.from== 'find' ? 5000 : 0);
        })
    },
    //调起微信支付
    payWx(data){
        this.POST(this.$url.orders.mbUserPrePay, { mainOrderId: this.options.orderId, serviceModel: this.options.from == 'find' ? 2 : 1 }, { proxy: true }).then((res)=>{

            this.setData({ spinShow: false });
    
            wx_pay(res).then((res)=>{
                this.dialog.alert({
                    title: '温馨提示',
                    content: '支付成功！',
                    onConfirm: (e)=> {
                        this.refreshInterface();
                    },
                })
            }).catch((res)=>{
                if(res.errMsg== 'requestPayment:fail cancel') return;
                this.dialog.alert({
                    title: '温馨提示',
                    content: '支付失败'+ (res.err_desc ? ','+ res.err_desc : ''),
                    onConfirm(e) {
                        
                    },
                })
            })

        }).catch(()=>{
            this.setData({ spinShow: false });
        })

    },
    onPulling() {
        //console.log('onPulling')
    },
    onRefresh() {
        this.refreshInterface();
        setTimeout(() => {
            $stopWuxRefresher()
        }, 2000)
    },
    onShareAppMessage: function (e) {
        
        return {
            title: `[${this.data.$state.user.wxNickname}]正在找人帮买[${this.data.info.details[0].shopName}]的商品，求顺路捎带~~~`,
            path: `/packageOrder/detail/with-auto/index?from=find&share=true&orderId=${this.options.orderId}`,
        }
    
    },
})