import {OrderStatusWith} from "./../../../utils/order.status.js"
import {sendTemplmsg} from "./../../../assets/js/tmplmsg.js"
import {$stopWuxRefresher} from './../../../libs/wux/index.js'
import {receiveRedPacket as order_receiveRedPacket} from "./../../../assets/js/order.tip.js"
import {$sdaiMask} from "./../../../components/base/index.js"

Page({
    data: {
        spinShow: true,
        statusStr: ['待支付', '待接单', '已接单,待送达', '已提货', '已送达', '买家已签收，订单已完成', '已取消'],
        OrderStatusWith,
    },
    onLoad: function (options) {
        this.setData({
            from: options.from || ''
        })
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
        res.data.details = res.data.details.map( v => {
            v.distance = this.filters.distance(v.distance);
            return v;
        });
        console.log("order info:: ", res.data);
        this.setData({
            info: res.data,
            spinShow: false
        })
        try{$stopWuxRefresher()}catch(e){};
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
    //确认送达
    delivery(e){
        
        this.setData({spinShow: true});

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        
        this.GET(this.$url.orders.delivery, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            this.toast("已确认送达");
            this.setData({spinShow: false});
            this.refreshInterface();
        }).catch( ()=> this.setData({spinShow: false}) );
    },
    //拒绝接单
    ignore(e){

        this.setData({spinShow: true});

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        
        this.GET(this.$url.orders.ignore, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            this.toast("已拒绝接单");
            this.setData({spinShow: false});
            this.refreshInterface();
        }).catch( ()=> this.setData({spinShow: false}) );
    },
    //接单
    accept(e){
        
        this.setData({spinShow: true});

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }

        this.GET(this.$url.orders.accept, {
            orderId: this.data.info.orderId
        }, { proxy: true }).then((res) => {
            this.toast("接单成功");
            order_receiveRedPacket.call(this, this.data.info.orderId).then((res)=>{
                if(res.data){
                    this.setData({
                        orderTipinfo: res.data
                    })
                    $sdaiMask("#mask-tip-order").show();
                }
            })
            this.setData({spinShow: false});
            this.refreshInterface();
        }).catch( ()=> this.setData({spinShow: false}) );
    },
    //帮Ta捎带
    helpWithHandel(e){

        //return this.toast("功能正在开发中");

        this.setData({spinShow: true});

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }

        this.GET(this.$url.orders.acceptTheOrder, {
            headerId: this.data.info.orderId,
            shopId: this.data.info.details[0].shopId
        }, { proxy: true }).then((res) => {
            this.toast("恭喜您，帮他捎带成功，准备好就出发吧");
            //this.options.from = '';
            order_receiveRedPacket.call(this, this.data.info.orderId).then((res)=>{
                if(res.data){
                    this.setData({
                        orderTipinfo: res.data,
                    })
                    $sdaiMask("#mask-tip-order").show();
                }
            })
            this.setData({spinShow: false});
            this.refreshInterface();
        }).catch( ()=> this.setData({spinShow: false}) );

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

    orderTipSureHandel(){
        $sdaiMask("#mask-tip-order").hide();
        this.setData({
            orderTipinfo: null
        })
    },

})