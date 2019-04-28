import {types} from "./../../../utils/shop.configs.js"
import {filters} from "./../../../utils/public.tool.js"
import {reverseGeocoder} from "./../../../utils/wx.capacity.js"

const app = getApp();

const resetShopsData = function (res, isShowLabel) {
    let obj = {spinShow: false}, list = {};
    (res.data.data || []).forEach((v, i) => {

        obj["markers[" + i + "].iconPath"] = types[v.category] || types["其他"];
        obj["markers[" + i + "].id"] = v.id;
        obj["markers[" + i + "].latitude"] = v.lat;
        obj["markers[" + i + "].longitude"] = v.lng;
        obj["markers[" + i + "].width"] = 64;
        obj["markers[" + i + "].height"] = 72;
        if(isShowLabel && v.shopName){
            obj["markers[" + i + "].label"] = {
                content: v.shopName,
                textAlign: "center",
                color: "#ffac1a",
                anchorX: -26,
                anchorY: -6,
                bgColor: "#fff",
                borderRadius: 4,
                borderColor: "#ffac1a",
                borderWidth: "2rpx",
                padding: "2rpx"
            }
        }
        else{
            //delete obj.markers[i].label;
            obj["markers[" + i + "].label"] = ""
        }


        if(!v.distance.toString().includes('m') && !v.distance.toString().includes('附近')){
            v.distance = filters.distance(v.distance);
        }

        list["_" + v.id] = v;
    });
    return {obj, list};
}

Page({

    isShowMapLabel: true,

    data: {

        markers: [],
        choseMarker: false,
        choseMarkerInfo: {},
        spinShow: true,
        choseAddress: {},

        showTopBanner: false,//是否展示顶部广告位

    },
    watch: {
        choseAddress: function (value) {
            if (this.data.$state.location.address) {
                //另外全局新key存储临时选择地址
                app.store.setState({
                    "location_indexhelp": value
                });
                this.getRequestData().then(this.getDataAll);
            } else {
                //同步到全局默认定位
                app.getLocation(value.lat, value.lng).then(() => {
                    this.getRequestData().then(this.getDataAll);
                })
            }
        }
    },
    onLoadGetLocalStorage(){
        return [
            {
                pageDataKey: "markers",
                localStorageKey: "hlep-index-markers",
                default: []
            }
        ]
    },
    onLoad() {
        if (!wx.getStorageSync("userInfo")) {
            this.redirectTo("/packageScope/pages/scope/index", {
                after: "/pages/with-help/index/index"
            })
            return;
        }
        wx.showShareMenu();
        this.getRequestData().then(this.getDataAll);
    },
    onShow(){
        this.loaded && this.getRequestData().then(this.getDataAll);
    },
    getRequestData(){
        return new Promise((reslove, reject)=>{
            if (this.data.$state.location_indexhelp.lat) {
                this.location = {
                    lat: this.data.$state.location_indexhelp.lat,
                    lng: this.data.$state.location_indexhelp.lng,
                    cityCode: this.data.$state.location_indexhelp.cityCode,
                    pageNum: 1, pageSize: 1000, distance: 3000
                }
                this.setData({ location: this.data.$state.location_indexhelp })
                reslove();
            }
            else {
                this.getLatlng().then((location) => {
                    this.getCityCode().then((code) => {
                        this.location= {
                            lat: location.lat, lng: location.lng,
                            cityCode: code, pageNum: 1, pageSize: 1000, distance: 3000
                        }
                        this.setData({ location: location })
                        reslove();
                    })
                }).catch(() => {
                    this.setData({
                        spinShow: false
                    })
                })
            }
        })

    },
    getDataAll(){

        if(this.data.$state.user.id)
            wx.showLoading({
                mask: true,
                title: "努力加载中..."
            });
        else
            wx.hideLoading();

        this.getShopsByDistance();
        this.getSpuCountByDistance();
        this.queryTip();
        this.getBannerList();
        this.getMessagebox();
    },
    getShopsByDistance() {
        this.POST(this.$url.shop.getShopsByDistance, this.location, { proxy: true, splitTime: 3000 }).then((res) => {

            this.shopList= res.data.data || []; //记录，以便缩放时店铺名重置

            let {obj, list} = resetShopsData(res, this.isShowMapLabel);

            this.setData(Object.assign(obj, {allHeadPortraits: res.data.data[0] ? res.data.data[0].allHeadPortraits : [] }) );

            wx.setStorage({
                key: 'hlep-index-markers',
                data: this.data.markers.slice(0, 20)
            })

            this.list = list;
            console.log(this.list)
            //查询用户活动红包弹出提示信息
            this.queryTip();

            this.map = wx.createMapContext("map");

            wx.hideLoading();

        })
    },
    getSpuCountByDistance() {

        this.POST(this.$url.goods.getSpuCountByDistance, this.location).then((res) => {
            this.setData({
                canBuyGoodsNum: res.data
            });
        })

    },
    onMapDragEnd(){

        if(!this.map || !this.map.getScale) return;

        this.autoGetCenterLocationTimeout = setTimeout(()=>{
            this.autoGetCenterLocation = false;
        }, 1000);

        if(!this.autoGetCenterLocation){
            wx.showLoading({
                mask: true,
                title: "努力加载中..."
            });
            this.autoGetCenterLocation = true;
            this.map.getCenterLocation({
                success: ({ longitude, latitude })=> {
                    console.log(longitude, latitude, this.data.$state.location_indexhelp)
                    if( this.data.$state.location_indexhelp &&
                        this.data.$state.location_indexhelp.lat== latitude &&
                        this.data.$state.location_indexhelp.lng== longitude
                        ) return;
                    reverseGeocoder(latitude, longitude).then((res)=>{
                        this.setData({
                            choseAddress: {
                                adcode : res.ad_info.adcode,
                                address : res.address,
                                city : res.ad_info.city,
                                lat : res.location.lat,
                                lng : res.location.lng,
                                province : res.ad_info.province,
                                title : res.title,
                                districtCode : res.ad_info.adcode,
                                cityCode : res.ad_info.adcode.toString().substring(0, 4) + '00',
                                cityName : res.ad_info.city
                            }
                        })
                    })
                }
            })
        }
    },
    scaleChange(){

        this.map.getScale({
            success: ({scale})=>{
                console.log("map scale: ", scale);
                if(scale > 16){
                    this.isShowMapLabel = true;
                    let {obj} = resetShopsData({data: {data : this.shopList || [] }}, true);
                    this.setData(obj);
                }
                else{
                    this.isShowMapLabel = false;
                    let {obj} = resetShopsData({data: {data : this.shopList || [] }});
                    this.setData(obj);
                }
            }
        })

    },
    //map视野发生变化时
    onregionchange(e){

        if(e.type != 'end' || !this.map || !this.map.getScale ) return;

        switch(e.causedBy){
            //缩放
            case 'scale': this.scaleChange(); break;
            //拖拽
            case 'drag' : this.onMapDragEnd(); break;
        }

    },
    onmarkertap({markerId}) {
        //this.list["_"+ markerId ].distance= filters.distance(this.list["_"+ markerId ].distance);
        //console.log("markerId:: ",markerId, this.list);
        this.setData({
            markerId: markerId,
            choseMarkerInfo: this.list["_" + markerId],
            choseMarker: true
        })

    },
    markerCancel() {
        this.setData({
            choseMarker: false
        })
    },
    defineLocation() {
        this.map = wx.createMapContext("map");
        this.moveToLocation();
    },
    hideTopBannerHandel(){
        this.setData({
            showTopBanner: false,
        });
        //记录用户已手动关闭广告位
        app.globalData.readedId_helpIndex = this.data.banner[0].id;
    },
    //顶部banner位
    getBannerList() {
        this.getCityCode().then((region)=>{
            let requestData = {region, pageNum: 1, pageSize: 1, applyType: 2, showType: 2, status: 1};
            return this.POST(this.$url.bus.bannerList, requestData).then(v =>{

                let banner= this.getProptry(v, "data.data", []);

                this.setData({
                    banner: banner.map(v=>{
                        v.pathParam= "url="+ encodeURIComponent(this.getProptry(v, 'pathParam', '').replace("url=", ''));
                        return v;
                    }).filter(v => v),
                    showTopBanner: (banner[0] && app.globalData.readedId_helpIndex!= banner[0].id) ? true : false,
                })
            })
        })

    },
    //查询用户活动红包弹出提示信息
    queryTip(){
        this.GET(this.$url.activity.queryTip ).then((res) => {
            this.setData({
                tipInfo: res.data
            });
        })
    },
    closeTip(){
        this.setData({
            "tipInfo.cashAmount": null
        });
    },
    tipSure(){
        wx.showToast({
            title: "已领取成功",
            duration: 3000,
        })
        this.POST(this.$url.activity.readUserTemplate, {id: this.data.tipInfo.id} );
        this.setData({
            "tipInfo.cashAmount": null
        });
    },
    //getMessagebox data
    getMessagebox(){
        this.POST(this.$url.bus.messagebox, {applyType: 2, showType: 2}).then(res =>{
            res.data[0] && this.setData({
                messageboxData: Object.assign( {
                    show: app.globalData.message_helpIndex != res.data[0].id,
                    showDialog: app.globalData.message_helpIndex != res.data[0].id
                }, res.data[0] ),
            })
        })
    },
    closeMessagebox(e){

        this.setData({
            "messageboxData.showDialog": false
        });
        setTimeout(()=>{
            this.setData({
                "messageboxData.show": false
            });
        }, 100);

        //一次性弹窗
        if(this.data.messageboxData.frequencyType== 1){
            this.POST(this.$url.bus.userMessage, { messageId: this.data.messageboxData.id });
        }
        //非一次性记录一次手动关闭
        else{
            app.globalData.message_helpIndex = this.data.messageboxData.id;
        }

        if(this.getDataset(e).url){
            this.navigateTo(this.getDataset(e).url);
        }

    }

})
