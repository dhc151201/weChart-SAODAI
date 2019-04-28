
Component({
    properties: {
        orderInfo: {
            type: Object,
            value: {}
        }
    },
    data: {
        tabChose: ["waitingPay", "waiting", "successed", "cancel"]
    },
    methods: {
        detailGo(e){
            let order= this.properties.orderInfo[e.currentTarget.dataset.index];
            if (order.receiveUserAddress || order.status== 6){
                this.navigateTo("/packageOrder/detail/with-auto/index", {
                    orderId: order.orderId,
                    tabChose: this.data.tabChose[order.status],
                    from: order.sourceType== 2 ? 'find': ''
                })
            }
            else if(order.status== 6){
                this.navigateTo("/packageOrder/recede/with-auto/index", {
                    orderId: order.orderId,
                    tabChose: this.data.tabChose[order.status],
                    from: order.sourceType== 2 ? 'find': ''
                })
            }
            else{
                this.navigateTo("/packageOrder/update/with-auto/index", {
                    orderId: order.orderId,
                    tabChose: this.data.tabChose[order.status],
                    from: order.sourceType== 2 ? 'find': ''
                })
            }
            
        }
    }
})
