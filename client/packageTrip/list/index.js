// pages/trips/list/index.js
Page({
    data: {
        tripList: [],
        spinShow: true
    },
    onLoad(options){
        this.setData(options);
        this.queryTripUserByShopId();
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
    //店铺下的捎带者列表
    queryTripUserByShopId(){
        this.POST(this.$url.trip.queryTripUserByShopId, this._getLatlngShopid()).then((res)=>{
            this.setData({
                spinShow: false,
                tripList: (res.data || []).map(v => {
                    v.arriveTime= this.filters.getDayName(v.arriveTime);
                    v.userInfo.profession= (v.userInfo.profession || '').split(",").filter(v=> v)
                    return v;
                })
            });
        })
    },

    creatOrder(e){
        if(this.options.from== 'auto'){
            this.redirectTo("/packageTrip/detail/index", {
                tripId: e.currentTarget.dataset.id,
                from: 'auto'
            })
            return;
        }
        this.setData({ spinShow: true });
        this.POST(this.$url.orders.create, {
            userId: this.data.$state.user.id,
            tripId: e.currentTarget.dataset.id,
            skus: JSON.parse(this.options.skus) 
        }, { proxy: true }).then((res)=>{
            this.setData({ spinShow: false });
            this.toast({
                type: 'success',
                duration: 3000,
                color: '#fff',
                text: '下单成功',
                success: () => this.redirectTo("/packageOrder/update/with-auto/index", {orderId: res.data} )
            })
        }).catch(()=>{
            this.setData({ spinShow: false });
        })
    },

    addFindWith(){
        this.redirectTo("/packageTrip/add/index?from=find&shopId=" + 
            this.options.shopId + "&skus=" + 
            this.options.skus
        );
    }

})