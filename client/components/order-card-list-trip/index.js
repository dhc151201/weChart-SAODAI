
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

            this.navigateTo("/packageOrder/detail/with-help/index", {
                orderId: order.orderId
            })

            // if(order.status== 2){
            //     this.navigateTo("/packageOrder/detail/with-help/index", {
            //         orderId: order.orderId
            //     })
            // }
            // else{
            //     this.navigateTo("/packageOrder/detail/with-help/index", {
            //         orderId: order.orderId
            //     })
            // }

        }
    }
})
