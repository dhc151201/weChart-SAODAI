

let pageConfig = {
    pageNum: 1,
    pageSize: 10
}

Page({

    data: {
        tabChose: "linegoods",
        spinShow: true,
        goodsList: []
    },

    onLoad: function (options) {
        pageConfig.pageNum = 1;
        this.ressetShop();
    },
    onReachBottom() {

        if (!this.pageRequestBefore()) return;
        pageConfig.pageNum += 1;
        this.getSkuSpuBySpuForC().then((res) => {
            this.setPageList("goodsList", res.data.data, pageConfig);
            this.pageRequestAfter(res);
        })

    },
    ressetShop() {
        Promise.all([this.shopDetailForC(), this.getSkuSpuBySpuForC()]).then(([{data}, res_goods]) => {
            //data.distance = this.filters.distance(data.distance);
            this.setData({
                shopInfo: data,
                goodsList: res_goods.data.data,
                spinShow: false
            })
            this.pageRequestAfter(res_goods);

        })
        this.queryTripUserByShopId();
    },
    //店铺详情
    shopDetailForC() {
        return this.POST(this.$url.shop.shopDetailForC, {
            shopId: this.options.shopId,
            lat: this.data.$state.location.location.lat,
            lng: this.data.$state.location.location.lng
        })
    },
    getLatlngCode(){
        if(this.data.$state.location_indexhelp.lng){
            return {
                lng: this.data.$state.location_indexhelp.lng,
                lat: this.data.$state.location_indexhelp.lat,
                cityCode: this.data.$state.location_indexhelp.cityCode
            }
        }else{
            return {
                lat: this.data.$state.location.location.lat,
                lng: this.data.$state.location.location.lng,
                regionCode: this.data.$state.location.ad_info.adcode.toString().substring(0, 4) + "00",
            }
        }
    },
    //店铺下的求捎带者列表
    queryTripUserByShopId() {
        return this.GET(this.$url.orders.orderListByShopId, {
            shopId: this.options.shopId,
        }).then((res)=>{
            this.setData({
                tripList: res.data
            })
        });
    },
    //店铺下可购买商品
    getSkuSpuBySpuForC() {
        return this.POST(this.$url.goods.getSkuSpuBySpuForC, Object.assign({
            shopId: this.options.shopId
        }, pageConfig))
    },
    tabchange({detail}) {
        this.setData({
            tabChose: detail.key
        })
    },
    //店铺分店切换
    shopChange({detail}) {
        this.options.shopId = detail.id;
        pageConfig.pageNum = 1;
        this.setData({
            spinShow: true
        })
        this.ressetShop();
    },

})
