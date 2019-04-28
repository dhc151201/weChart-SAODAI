import {filters, getDataset, getProptry} from './../../../utils/public.tool.js'
import {sendTemplmsg} from "./../../../assets/js/tmplmsg.js"

var pageConfig = {
    pageNum: 1,
    pageSize: 10
}

Page({
    fromData: { },
    data: {
        historyWords: [],
        searchList: [],
    },
    onLoadGetLocalStorage() {
        return [
            {
                pageDataKey: "historyWords",
                localStorageKey: "historyWords",
                default: []
            }
        ]
    },
    onLoad() {
        this.GET(this.$url.shop.queryHotwords).then(({data}) => {
            this.setData({
                hotwords: data
            })
        })
    },
    onReachBottom() {

        if (!this.data.keyword || !this.pageRequestBefore()) return;
        pageConfig.pageNum += 1;
        this.searchRrsdShop();

    },
    onShareAppMessage: function () {
        return {
            title: "把实体店铺搬线上， 快来免费入驻，全民都来帮您卖~~~",
            imageUrl: `${this.data.$state.assetsUrl}share_bg_shop.png`,
            path: `/packageShare/in/shop/index?scene=${this.data.$state.user.recommandCode}`,
        }
    },
    onInputFromBefore(e) {
        this.onInputFrom(e);
        //尝试清空搜索结果并回到标签block
        e.detail.value || this.clearSearchList();
    },
    //搜索
    onSearch(e) {

        let keyword = getDataset(e).keyword || this.fromData.keyword;

        this.setData({
            keyword: keyword,
            spinShow: true,
            requested: true
        });

        this.fromData.keyword= this.data.keyword;

        pageConfig.pageNum = 1;
        this.refreshHistoryWords();
        this.searchRrsdShop();

    },
    searchRrsdShop() {
        this.getLatlng().then((data) => {
            this.POST(this.$url.shop.searchRrsdShop, Object.assign(data, {keyword: this.data.keyword}, pageConfig)).then((res) => {
                res.data.data = (res.data.data || []).map((v) => {
                    v.distance = filters.distance(v.distance);
                    return v;
                })
                //分页数据设置
                this.setPageList("searchList", res.data.data, pageConfig);
                //分页结果处理
                this.pageRequestAfter(res);
            })
        })
    },
    refreshHistoryWords() {

        if (!this.fromData || !this.fromData.keyword) return;

        let list = this.data.historyWords.slice(0, 10);
        if (!this.data.historyWords.includes(this.fromData.keyword)) list.push(this.fromData.keyword);
        wx.setStorageSync("historyWords", list);
        this.setData({
            historyWords: list
        })

    },
    clearSearchList() {
        this.setData({
            searchList: [],
            keyword: "",
            requested: false,
        });
        pageConfig.pageNum = 1;
    },
    findWithHandel(e){
        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }
        this.redirectTo("/pages/with-auto/shop-detail/index", {shopId: this.getDataset(e).id , from: "find"} );
    }

})
