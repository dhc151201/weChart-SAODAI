// packageOrder/recede/index.js
Page({
    data: {
        spinShow: true,
        statusStr: ["", "编辑", "退款中", "退款成功", "退款失败"], //1编辑 2退款中 3退款成功 4退款失败
        statusClass: ["", "color-light", "color-light", "color-green", "color-error"]
    },
    onLoad: function (options) {
        this.GET( options.from== 'find' ? this.$url.orders.findRefundDetail : this.$url.orders.refundDetail, this.options).then((res)=>{
            // res.data.arriveTime= this.filters.getDayName(res.data.arriveTime, res.data.systemTime);
            // res.data.allAmountStr= (res.data.skuAmount+ res.data.incidentallyAmount).toFixed(2);
            this.setData({
                info: res.data,
                spinShow: false,
            })
        })
    },
    
})