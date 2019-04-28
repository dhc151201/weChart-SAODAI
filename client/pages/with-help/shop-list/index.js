import { $wuxSelect } from "./../../../libs/wux/index.js"; 
import { $sdaiPicker, $sdaiFilterActionsheet } from './../../../components/base/index.js'
import {sendTemplmsg} from "./../../../assets/js/tmplmsg.js"

const app = getApp();

Page({
    pageConfig: {
        pageNum: 1,
        pageSize: 10
    },
    data: {
        noticeShow: true,
        choseAddress: {},

        priority: ["按距离排序", "按返利排序"],
        orderType: 0,

        screeningData: {
            distance: 3000,
            rebateStart: 0,
            rebateEnd: 100
        }

    },
    watch: {
        choseAddress: function (value) {
            app.store.setState({
                "location_indexhelp": value
            });
            this.pageConfig.pageNum = 1;
            this.location = Object.assign({
                lat: value.lat,
                lng: value.lng,
                cityCode: value.cityCode,
            }, this.pageConfig);
            this.getShopsByDistance();
        }
    },
    onLoad: function (options) {
        this.pageConfig.pageNum = 1;
        //帮人捎带主页能自动定位 后 自选新地址
        if (this.data.$state.location_indexhelp.lng) {
            this.location = {
                lng: this.data.$state.location_indexhelp.lng,
                lat: this.data.$state.location_indexhelp.lat,
                cityCode: this.data.$state.location_indexhelp.cityCode
            };
            this.getShopsByDistance();
            this.getBannerList();
        }
        //帮人捎带自动定位地址
        else {
            this.getLatlng().then((location) => {
                this.getCityCode().then((code) => {
                    this.location = Object.assign(location, {cityCode: code});
                    this.getShopsByDistance();
                    this.getBannerList()
                })
            })
        }

        this.getClassifyParent();

    },
    onReachBottom() {

        if (!this.pageRequestBefore()) return;
        this.pageConfig.pageNum += 1;
        this.getShopsByDistance();

    },
    onShareAppMessage: function () {
        return {
            title: "把实体店铺搬线上， 快来免费入驻，全民都来帮您卖~~~",
            imageUrl: `${this.data.$state.assetsUrl}share_bg_shop.png`,
            path: `/packageShare/in/shop/index?scene=${this.data.$state.user.recommandCode}`,
        }
    },
    onPageScroll() {
        //this.data.noticeShow && this.setData({noticeShow: false});
    },
    hideNoticeHandel(){
        this.setData({ noticeShow: false });
    },
    showNoticeHandel(){
        this.setData({ noticeShow: true });
    },
    getShopsByDistance() {
        this.POST(this.$url.shop.getShopsByDistance, Object.assign({
            distanceSort: this.data.orderType== 0 ? 'yes' : undefined,
            rebateSort: this.data.orderType== 1 ? 'yes' : undefined,
            firstCategory: this.classifyData.secondCategories.length ? undefined : (this.classifyData.firstCategory || undefined),
            secondCategories: this.classifyData.secondCategories.length ? this.classifyData.secondCategories : undefined,
        }, this.location, this.pageConfig, this.screeningData, this.fromData )).then((res) => {
            //分页数据设置
            this.setPageList("shopList", res.data.data, this.pageConfig);
            //分页结果处理
            this.pageRequestAfter(res);
        })
    },
    choseHandel(e) {
        let obj = {choseAll: false};
        obj["shopList[" + e.currentTarget.dataset.index + "].chose"] = !this.data.shopList[e.currentTarget.dataset.index].chose;
        this.setData(obj);
    },
    choseAllHandel() {

        if (this.data.choseAll) {
            this.setData({
                choseAll: false,
                shopList: this.data.shopList.map((v) => {
                    v.chose = false;
                    return v;
                })
            })
        }
        else {
            this.setData({
                choseAll: true,
                shopList: this.data.shopList.map((v) => {
                    v.chose = true;
                    return v;
                })
            })
        }

    },

    noticeCloseHandel() {
        this.setData({
            noticeShow: false
        })
    },

    submit(e) {
        let shop = [];
        this.data.shopList.map((v) => {
            v.chose && shop.push(v.id);
        });
        if (!shop.length) {
            return this.toast("请选择捎带的店铺");
        }
        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        console.log(shop);
        this.redirectTo("/packageTrip/add/index?shopId=" + shop.join(','));
    },

    showFilterOptions(){
        this.setData({
            showFilterOptionsStatus: true
        })
        $sdaiFilterActionsheet().show();
    },
    filterSure(){
        this.pageConfig.pageNum= 1;
        this.sureQuert();
        //距离+ 返利
        this.screeningSure();
        this.classifySure();
        this.getShopsByDistance();
    },
    filterCancel(){
        this.setData({
            showFilterOptionsStatus: false
        })
        this.cancelQuert();
        this.screeningCancel();
        this.classifyCancel();
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
    },
    choseTag(e){
        let obj= {}, index= this.getDataset(e).index;
        obj["children["+index +"].chose"]= !this.data.children[index].chose
        this.setData(obj);
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
            children: [this.data.children || []].map(v=>{
                v.chose= this.classifyData.secondCategories.includes(v.id);
                return v;
            }),
        })
    },
    classifySure(){
        this.classifyData.firstCategory= this.data.classifyData.firstCategory;
        this.classifyData.secondCategories= (this.data.children || []).map(v =>{
            if(v.chose) return v.id;
        }).filter(v => v);
        console.log(this.classifyData);
        //this.config.page.payShop.pageNum = 1;
        //this.getSkuList();
        //this.classifyCancel();
    },

    QuertData: 0,
    //排序条件
    choseQuert(e){
        this.setData({
            orderType:  this.getDataset(e).value
        })
    },
    sureQuert(){
        this.QuertData= this.data.orderType * 1;
    },
    cancelQuert(){
        this.setData({
            orderType:  this.data.value* 1
        })
    },
    //优选店铺筛选代码块
    screeningData: {
        distance: undefined,
        rebateStart: 0,
        rebateEnd: 100
    },
    showScreening() {
        this.setData({
            screening: true
        })
        //$sdaiPicker("#screening").show();
    },
    //距离选项
    choseDistance(e){
        this.setData({
            "screeningData.distance": this.getDataset(e).value || ''
        })
    },
    sliderChange({detail}){
        this.setData({
            "screeningData.rebateStart": detail.value[0],
            "screeningData.rebateEnd": detail.value[1]
        })
    },
    screeningCancel(){
        //$sdaiPicker("#screening").hide();
        this.setData({
            screening: false,
            screeningData: JSON.parse(JSON.stringify(this.screeningData)) 
        })
    },
    //确定选择筛选
    screeningSure(){
        //$sdaiPicker("#screening").hide();
        this.setData({
            screening: false
        })
        this.screeningData= JSON.parse(JSON.stringify(this.data.screeningData));
        this.screeningData.distance= this.screeningData.distance || undefined;
        //this.pageConfig.pageNum = 1;
        //this.getShopsByDistance();
    },

    onSearchfocus(){
        this.setData({searchfocus: true})
    },
    onSearchblur(){
        this.setData({searchfocus: false})
    },
    onSearch(){
        console.log(this.fromData);
        this.pageConfig.pageNum = 1;
        this.getShopsByDistance();
    },

    //顶部banner位
    getBannerList() {

            let requestData = {region: this.location.cityCode, pageNum: 1, pageSize: 1, applyType: 2, showType: 4, status: 1};

            this.POST(this.$url.bus.bannerList, requestData).then(v =>{
             
                this.setData({
                    bannerImageUrl: this.getProptry(v, 'data.data[0]', {}).imageUrl || '',
                    bannerPathParam: this.getProptry(v, 'data.data[0]', {}).pathParam || '',
                    bannerPathUrl: this.getProptry(v, 'data.data[0]', {}).pathUrl || '',
                })

            })

    },

})
