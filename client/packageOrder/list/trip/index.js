
Page({
    pageConfig_index: 0,
    pageConfig: [
        {pageNum: 1, pageSize: 10},//已接单
        {pageNum: 1, pageSize: 10},//待接单
        {pageNum: 1, pageSize: 10},
        {pageNum: 1, pageSize: 10},
    ],
    data: {
        tabChose: "waiting",
        spinShow: false,
        waitingPayList: [],
        waitingList: [],
        successedList: [],
        cancelList: [],
    },
    onLoad(options){
        options.tabChose && this.setData({ tabChose: options.tabChose });
        this.getOrderList(this.get_requestData(this.data.tabChose));
    },
    onShow(){
        this.loaded && this.getOrderList(this.get_requestData(this.data.tabChose));
    },
    onReachBottom(){

        if( !this.pageRequestBefore( "loadmore_"+ this.data.tabChose ) ) return;
        this.pageConfig[this.pageConfig_index].pageNum+= 1;
        this.getOrderList(this.get_requestData());

    },

    //获取需要设置的page datakey
    get_pageDataKey(){
        switch(this.data.tabChose){
            case 'waitingPay': return "waitingPayList";
            case 'waiting': return "waitingList";
            case 'successed': return "successedList";
            case 'cancel': return "cancelList";
        }
    },

    deleteAllBubbleByStatus(){
        let status= 0;
        switch(this.get_pageDataKey()){
            case 'waitingPayList': status= 0; break;
            case 'waitingList': status= 1; break;
            case 'successedList': status= 2; break;
            case 'cancelList': status= 3; break;
        }
        this.GET(this.$url.orders.deleteAllBubbleByStatus, { status });
    },
    //获取订单列表
    getOrderList(reqData){
        this.deleteAllBubbleByStatus();
        this.POST(this.$url.orders.quertTripOrder,  reqData).then((res)=>{

            if(this.data.tabChose== 'waitingPay'){
                this.setData({
                    amount: res.data.amount,
                    tripAmount: res.data.tripAmount
                })
            }

            this.setPageList(this.get_pageDataKey(), res.data.orders.data || [], this.get_pageConfig() );

            this.pageRequestAfter({data: res.data.orders}, "loadmore_"+ this.data.tabChose );


        })
    },


    //获取get list所需参数pageConfig
    get_pageConfig(key= this.data.tabChose){
        switch(key){
            case 'waitingPay': this.pageConfig_index= 0; break;
            case 'waiting': this.pageConfig_index= 1; break;
            case 'successed': this.pageConfig_index= 2; break;
            case 'cancel': this.pageConfig_index= 3; break;
        }
        return this.pageConfig[this.pageConfig_index];
    },
    //获取get list所需参数status
    get_status(key= this.data.tabChose){
        let status= [];
        switch(key){
            case 'waitingPay': status= 1; break;
            case 'waiting': status= 2; break;
            case 'successed': status= 3; break;
            case 'cancel': status= 4; break;
        }
        return status;
    },
    //组装请求数据
    get_requestData(key){
        return Object.assign(this.get_pageConfig(key), { 
            tripId: this.options.tripId, 
            type: this.get_status(key),
            shopIds: JSON.parse(this.options.shopIds)
        });
    },


    tabChange({detail}){
        this.setData({
            tabChose: detail.key
        })
        //this.data[this.get_pageDataKey()].length || 
        this.getOrderList(this.get_requestData(detail.key));
    }


})