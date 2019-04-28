import { $stopSdaiRefresher } from './../../../libs/sdai/index.js';
import {$stopWuxRefresher} from './../../../libs/wux/index.js'
import { $wuxSelect } from "./../../../libs/wux/index.js";
import { $sdaiPicker, $sdaiFilterActionsheet  } from './../../../components/base/index.js';
import {sendTemplmsg} from "./../../../assets/js/tmplmsg.js"

const app = getApp();

Page({
    config: {
        //分页相关控制
        page: {
            payShop: {
                pageNum: 1,
                pageSize: 10,
            }
        }
    },
    data: {
        showSkeleton: true,
        loadmore: 0, //分页结果标识， 0: 初始化，可加载数据， 1:数据请求中， 2:已无更多数据， 3:暂无任何数据
        bannerList: [],
        hotShopList: [],
        payShopList: [],
        spinShow: false,
        showSpinTop: true,
        choseAddress: {},

        scrollIntoViewId: "",
        scrollY: true,

        priority: ["到货最快", "送达地点距我最近", "捎带费最低"],
        orderType: 1,

        screeningData: {
            deliveryRange: undefined,
            minTripAmount: 0,
            maxTripAmount: 100
        },

        children:[],
        classifyData: {
            firstCategory: undefined,
            secondCategories: []
        }

    },
    watch: {
        choseAddress: function (value) {
            this.latLng = {
                lat: value.lat,
                lng: value.lng
            };
            this.region = value.cityCode;
            this.config.page.payShop.pageNum = 1;
            this.getSkuList(this.config.page.payShop);
            app.store.setState({
                "location_indexauto": value
            });
        }
    },
    onLoadGetLocalStorage(){
        return [
            {
                pageDataKey: "bannerList",
                localStorageKey: "auto-index-bannerList",
                default: []
            },
            {
                pageDataKey: "hotShopList",
                localStorageKey: "auto-index-hotShopList",
                default: []
            },
            {
                pageDataKey: "payShopList",
                localStorageKey: "auto-index-payShopList",
                default: []
            }
        ]
    },
    onLoad: function (options) {
        this.getRegionLatlng();
        wx.showShareMenu();
        this.getClassifyParent();
        // this.getShopsByDistance();
        this.getShopTripByCategory();
        this.getHotShopSku();

    },
    ViewScroll(){
        this.isTop = false;
    },
    ViewScrolltoupper(){
        setTimeout(()=>{
            this.isTop = true;
        }, 1000);
    },
    ViewReachBottom() {

        if (!this.pageRequestBefore()) return;
        this.config.page.payShop.pageNum += 1;
        this.getSkuList();

    },
    onReachBottom(){
        this.ViewReachBottom();
    },
    onPullDownRefresh(){
        wx.showNavigationBarLoading();
        this.onRefresh();
    },
    onPulling() {
        //console.log('onPulling')
    },
    onRefresh() {
        console.log("onRefresh ::: ");
        // if (!this.isTop ) {
        //     $stopSdaiRefresher();
        //     return;
        // };
        this.latLng && this.getSkuList({
            pageNum: 1,
            pageSize: this.config.page.payShop.pageNum * this.config.page.payShop.pageSize
        });
        setTimeout(() => {
            //$stopWuxRefresher();
            $stopSdaiRefresher();
        }, 3000)
    },
    getRegionLatlng() {
        Promise.all([this.getCityCode(), this.getLatlng()]).then(([region, latLng]) => {

            this.region = region;
            this.latLng = latLng;

            this.getBannerList().then((banner_res)=>{

                let data= (banner_res.data.data || []).map(v=>{
                    return {
                        imageUrl: v.imageUrl,
                        pathUrl: v.pathUrl,
                        pathParam: v.pathParam
                    }
                });

                this.setData({
                    bannerList: data,
                    showSkeleton: false,
                })
                wx.setStorage({
                    key: 'auto-index-bannerList',
                    data: data
                })

                data= null;
            })

            this.queryRecommandshop().then((recommandshop_res)=>{

                let data= (recommandshop_res.data.data || []).map(v=>{
                    return {
                        imageUrl: v.imageUrl,
                        title: v.title,
                        pathUrl: v.pathUrl,
                        pathParam: v.pathParam
                    }
                });

                this.setData({
                    hotShopList: data,
                    showSkeleton: false,
                })
                wx.setStorage({
                    key: 'auto-index-hotShopList',
                    data: data
                })

                data= null;
            })

            this.getSkuList();

            /*
            Promise.all([this.getBannerList(), this.queryRecommandshop()]).then(([banner_res, recommandshop_res]) => {
                this.setData({
                    bannerList: banner_res.data.data || [],
                    hotShopList: recommandshop_res.data.data || [],
                })
                wx.setStorage({
                    key: 'auto-index-bannerList',
                    data: banner_res.data.data || []
                })
                wx.setStorage({
                    key: 'auto-index-hotShopList',
                    data: recommandshop_res.data.data || []
                })
            }).catch(()=>{
                this.setData({showSpinTop: false});
            })
            this.getSkuList();
            */

        })
    },
    getBannerList() {
        let requestData = {region: this.region, pageNum: 1, pageSize: 8, applyType: 2, showType: 1, status: 1};
        return this.POST(this.$url.bus.bannerList, requestData)
    },
    queryRecommandshop() {
        return this.POST(this.$url.shop.queryRecommandshop, {region: this.region, pageNum: 1, pageSize: 7, status: 1});
    },
    getSkuList(pageConfig) {
        this.POST(this.$url.goods.getSkuList, Object.assign({}, this.latLng, {
            region: this.region,
            orderType: this.data.orderType+ 1,
            firstCategory: this.classifyData.secondCategories.length ? undefined : (this.classifyData.firstCategory || undefined),
            secondCategories: this.classifyData.secondCategories.length ? this.classifyData.secondCategories : undefined,
            }, this.config.page.payShop, pageConfig, this.screeningData)).then((res) => {

            res.data.data = this.getProptry(res, 'data.data', []).map(v => {
                return {
                    shopId: v.shopId,
                    address: v.address,
                    distance: v.distance,
                    arriveTime: v.arriveTime,
                    logoImageUrl: v.logoImageUrl,
                    discountName: v.discountName,
                    shopName: v.shopName,
                    shopTags: this.getProptry(v, 'shopTags', []).slice(0,3),
                    skus: this.getProptry(v, 'skus', []).slice(0,8),
                    trips: this.getProptry(v, 'trips', []).slice(0,5),
                }

            });

            //分页数据设置
            this.setPageList("payShopList", res.data.data, this.config.page.payShop);
            //分页结果处理
            this.pageRequestAfter(res);

            console.log("payShopList:: ", this.data.payShopList);

            if(this.config.page.payShop.pageNum== 1){
                wx.setStorage({
                    key: 'auto-index-payShopList',
                    data: this.data.payShopList || []
                })
                this.setData({showSpinTop: false});
            }

            try {
                //$stopWuxRefresher();
                $stopSdaiRefresher();
            } catch (e) { }
        }).catch(()=>{
            this.setData({showSpinTop: false});
            try {
                //$stopWuxRefresher();
                $stopSdaiRefresher();
            } catch (e) { }
        })
    },
    //优选店铺优先条件
    showPriority(){
        $wuxSelect().open({
            value: this.data.priority[this.data.orderType],
            options: this.data.priority,
            onConfirm: (value, index, options) => {
                if (value != this.data.priority[this.data.orderType]){
                    this.setData({ orderType: index});
                    this.config.page.payShop.pageNum = 1;
                    this.getSkuList();
                }
            },
        })
        this.classifyCancel();
    },
    QuertData: 0,
    //快捷筛选
    choseQuert(e){
        this.setData({
            orderType: +this.getDataset(e).value
        })
    },
    QuertCancel(){
        this.setData({
            orderType: this.QuertData * 1
        })
    },
    QuertSure(){
        this.QuertData= this.data.orderType;
    },
    //优选店铺筛选代码块
    screeningData: {
        deliveryRange: undefined,
        minTripAmount: 0,
        maxTripAmount: 100
    },
    showScreening() {
        this.setData({
            screening: true
        })
        //$sdaiPicker("#screening").show();
        this.classifyCancel();
    },
    //距离选项
    choseDistance(e){
        this.setData({
            "screeningData.deliveryRange": this.getDataset(e).value || ''
        })
    },
    sliderChange({detail}){
        this.setData({
            "screeningData.minTripAmount": detail.value[0],
            "screeningData.maxTripAmount": detail.value[1]
        })
    },
    screeningCancel(){
        this.setData({
            screening: false
        })
        //$sdaiPicker("#screening").hide();
        this.setData({
            screeningData: JSON.parse(JSON.stringify(this.screeningData))
        })
        console.log(this.screeningData, this.data.screeningData)
    },
    //确定选择筛选
    screeningSure(){
        this.setData({
            screening: false
        })
        //$sdaiPicker("#screening").hide();
        this.screeningData = JSON.parse(JSON.stringify(this.data.screeningData));
        this.screeningData.deliveryRange= this.screeningData.deliveryRange || undefined;
        this.config.page.payShop.pageNum = 1;
        //this.getSkuList();
    },

    //分类筛选
    classifyData: {
        firstCategory: undefined,
        secondCategories: []
    },
    getClassifyParent(){
        this.GET(this.$url.shop.getChilds, {enable: 'yes', parentId: 0}).then(res=> {
            this.setData({
                "classifyData.firstCategory": "",
                parent: res.data //[{name: '全部', id: ""}].concat(res.data),
            })
            //this.getChild(res.data[0].id);
        })
    },
    getChild(id){
        this.setData({
            requestChild: true
        })
        this.GET(this.$url.shop.getChilds, {enable: 'yes', parentId: id }).then(res_child=> {
          this.setData({
            children: res_child.data.map(v=>{
                v.chose= this.classifyData.secondCategories.includes(v.id);
                return v;
            }),
            requestChild: false
          })
        })
    },
    tabParent(e){
        let pid= this.data.parentId== this.getDataset(e).id ? '' : this.getDataset(e).id || "";
        this.setData({
          parentId: pid,
          "classifyData.firstCategory": pid,
        })
        if (!pid) {
            this.setData({
                children: []
            })
            return;
        }
        this.getChild(this.getDataset(e).id);
        pid= null;
    },
    choseTag(e){
        let obj= {}, index= this.getDataset(e).index;
        obj["children["+index +"].chose"]= !this.data.children[index].chose
        this.setData(obj);
        obj= null;
    },
    showClassify(){
        this.setData({
            scrollIntoViewId: "column-canshop",
            scrollY: false,
        })
        setTimeout(()=>{
            this.setData({showClassifyBox: true})
        }, 50);
    },
    classifyCancel(){
        this.setData({
            showClassifyBox: false,
            scrollIntoViewId: "",
            scrollY: true,
            //"classifyData.firstCategory": (this.classifyData.firstCategory|| '')+ "",
            children: this.data.children.map(v=>{
                v.chose= this.classifyData.secondCategories.includes(v.id);
                return v;
            }),
        })
    },
    classifySure(){
        this.classifyData.firstCategory= this.data.classifyData.firstCategory;
        this.classifyData.secondCategories= this.data.children.map(v =>{
            if(v.chose) return v.id;
        }).filter(v => v);
        console.log(this.classifyData);
        this.config.page.payShop.pageNum = 1;
        //this.getSkuList();
        this.classifyCancel();
    },

    showFilterOptions(){
        this.setData({
            showFilterOptionsStatus: true
        })
        $sdaiFilterActionsheet().show();
    },
    filterSure(){
        this.classifySure();
        this.screeningSure();
        this.QuertSure();
        this.getSkuList();
    },
    filterCancel(){
        this.setData({
            showFilterOptionsStatus: false
        })
        this.classifyCancel();
        this.screeningCancel();
        this.QuertCancel();
    },

    findWithHandel(e){
        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        this.navigateTo("/pages/with-auto/shop-detail/index", {shopId: this.getDataset(e).id , from: "find"} );
    },

    // getShopsByDistance() {
    //     this.POST(this.$url.shop.getShopsByDistance, Object.assign({
    //         distanceSort: this.data.orderType== 0 ? 'yes' : undefined,
    //         pageNum: 1, pageSize: 2,
    //     }, this.data.$state.location.location )).then((res) => {
    //         this.setData({
    //             nearShopList: this.getProptry(res, 'data.data', [])
    //         })
    //     })
    // },
    getShopTripByCategory(data) {
        this.POST(this.$url.shop.getShopTripByCategory, Object.assign({categoryIds: [], pageNum: 1, pageSize: 2}, this.data.$state.location.location )).then(res => {
            this.setData({
                nearShopList: this.getProptry(res, 'data.data', []).map(v=>{
                    return {
                        shopId: v.shopId,
                        address: v.address,
                        distance: v.distance,
                        logoImageUrl: v.logoImageUrl,
                        discountName: v.discountName,
                        shopName: v.shopName,
                        tags: this.getProptry(v, 'tags', []).slice(0,3),
                        trips: this.getProptry(v, 'trips', []).slice(0,5),
                    }
                })
            })
        })
    },

    getHotShopSku(){
        this.POST(this.$url.shop.getHotShopSku, Object.assign({
            applyType: 2,
            size: 4,
            deliveryRange: 1000,
            region: this.data.$state.location.ad_info.adcode.toString().substring(0, 4)+ '00',
        }, this.data.$state.location.location )).then((res) => {
           this.setData(res.data)
        })
    }

})
