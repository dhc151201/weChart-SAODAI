import {getStartDestName} from "./../../../utils/public.tool.js";
Page({
    pageConfig_index: 0,
    pageConfig: [
        {pageNum: 1, pageSize: 10},//待支付： 0
        {pageNum: 1, pageSize: 10},//待收货： - 待接单(待接单) 1 - 已接单(待提货) 2 - 已提货 (送货中) 3 - 已送达 4
        {pageNum: 1, pageSize: 10},//已完成： - 已确认收货 5
        {pageNum: 1, pageSize: 10},//已取消： 6
    ],
    data: {
        tabChose: "successed",
        spinShow: false,
        waitingPayList: [],
        waitingList: [],
        successedList: [],
        cancelList: [],
    },
    onLoad(options){
        options.tabChose && this.setData({ tabChose: options.tabChose });
        this.queryMyTripsByState(this.get_requestData(this.data.tabChose));
    },
    onReachBottom(){

        if( !this.pageRequestBefore( "loadmore_"+ this.data.tabChose ) ) return;
        this.pageConfig[this.pageConfig_index].pageNum+= 1;
        this.queryMyTripsByState(this.get_requestData());

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


    //获取订单列表
    queryMyTripsByState(reqData){
        this.POST(this.$url.trip.queryMyTripsByState, reqData).then((res)=>{

            res.data.data= this.getProptry(res, 'data.data', []).map(v=>{
                v= getStartDestName(v);
                return v;
            }) 
            
            this.setPageList(this.get_pageDataKey(), res.data.data || [], this.get_pageConfig() );

            this.pageRequestAfter(res, "loadmore_"+ this.data.tabChose );


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
            case 'waitingPay': status= [0]; break;
            case 'waiting': status= [1,2,3,4]; break;
            case 'successed': status= 3; break;
            case 'cancel': status= 2; break;
        }
        return status;
    },
    //组装请求数据
    get_requestData(key){
        return Object.assign(this.get_pageConfig(key), { status: this.get_status(key)});
    },


    tabChange({detail}){
        this.setData({
            tabChose: detail.key
        })
        this.data[this.get_pageDataKey()].length || this.queryMyTripsByState(this.get_requestData(detail.key));
    }


})