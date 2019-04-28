Page({

    pageConfig : {
        pageNum: 1,
        pageSize: 10
    },

    data: {
        tabChose: "linegoods",
        spinShow: false,
        goodsList: [],
        tripList: []
    },

    onLoad: function (options) {

        wx.showShareMenu();
        this.setData({
            tripId: this.options.tripId || '',
            from: options.from || '',
        })
        this.pageConfig.pageNum = 1;
        this.getLatlng().then(this.ressetShop);

        this.getIsFirstOrderByDays();

        this.sideToIndexComp = this.selectComponent("#side-to-index");

    },
    onReachBottom() {

        if (!this.pageRequestBefore()) return;
        this.pageConfig.pageNum += 1;
        this.getSkuSpuBySpuForC().then((res) => {
            this.setPageList("goodsList", res.data.data, this.pageConfig);
            this.pageRequestAfter(res);
        })

    },
    onShareAppMessage: function () {
        return {
            path: `/pages/with-auto/shop-detail/index?shopId=${this.options.shopId}&share=true`,
        }
    },
    ressetShop() {

        // console.time("one")

        this.shopDetailForC().then((res_info)=>{
            this.setData({
                shopInfo: res_info.data,
                spinShow: false
            })
        })

        this.getSkuSpuBySpuForC().then((res_goods)=>{
            this.setData({
                goodsList: res_goods.data.data,
            })
            this.pageRequestAfter(res_goods);
        })

        this.queryTripUserByShopId().then((res_trip)=>{
            this.setData({
                tripList: res_trip.data
            })
        })

        /*
        Promise.all([this.shopDetailForC(), this.getSkuSpuBySpuForC(), this.queryTripUserByShopId()]).then(([res_info, res_goods, res_trip]) => {
            //res_info.data.distance = this.filters.distance(res_info.data.distance);
            this.setData({
                shopInfo: res_info.data,
                goodsList: res_goods.data.data,
                tripList: res_trip.data,
                spinShow: false
            })

            this.pageRequestAfter(res_goods);

        })
        */
    },
    _getLatlngShopid(){
        if(this.options.from== 'canpay' && this.data.$state.location_indexauto.address){
            return {
                shopId: this.options.shopId,
                lat: this.data.$state.location_indexauto.lat,
                lng: this.data.$state.location_indexauto.lng,
                regionCode: this.data.$state.location_indexauto.cityCode
            }
        }
        else{
            return {
                shopId: this.options.shopId,
                lat: this.data.$state.location.location.lat,
                lng: this.data.$state.location.location.lng,
                regionCode: this.data.$state.location.ad_info.adcode.toString().substring(0, 4) + "00"
            }
        }
    },
    //店铺详情
    shopDetailForC() {
        return this.POST(this.$url.shop.shopDetailForC, this._getLatlngShopid() )
    },
    //店铺下可购买商品
    getSkuSpuBySpuForC() {
        return this.POST(this.$url.goods.getSkuSpuBySpuForC, Object.assign({
            shopId: this.options.shopId
        }, this.pageConfig))
    },
    //店铺下的捎带者列表
    queryTripUserByShopId() {
        return this.POST(this.$url.trip.queryTripUserByShopId, this._getLatlngShopid() )
    },
    getIsFirstOrderByDays(){
        // this.GET(this.$url.orders.isFirstOrderByDays).then((res)=>{
        //     if(res.data){
        //         this.setData({
        //             maxDiscountsVel: res.data
        //         })
        //     }
        // })
    },
    tabchange({detail}) {
        this.setData({
            tabChose: detail.key
        })
    },
    //店铺分店切换
    shopChange({detail}) {
        this.options.shopId = detail.id;
        this.pageConfig.pageNum = 1;
        this.setData({
            spinShow: true
        })
        this.ressetShop();
    },
    submit({detail}) {
        if (!detail.length) {
            return this.toast("请选择需要捎带的商品");
        }
        //找人捎带,没有捎带者
        if(!this.data.tripList.length){
            this.navigateTo("/packageTrip/add/index?from="+
                    this.options.from+ "&shopId=" +
                    this.options.shopId + "&skus=" +
                    JSON.stringify(detail)
                )
        }
        else this.navigateTo("/packageTrip/list/index?from="+
                this.options.from+ "&shopId=" +
                this.options.shopId + "&skus=" +
                JSON.stringify(detail)
            );
    },

})
