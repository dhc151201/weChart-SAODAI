import { $sdaiPicker } from './../../../components/base/index.js'
import areaList from "./../../../utils/city.js"
Page({
    pageConfig: {
        pageNum: 1,
        pageSize: 10
    },
    data: {
        _index: 0,
        categoryIds: [],
        shopList: [],
        choseTag: {},
        areaList: areaList,
        cityName: "全国"
    },
    watch: {
        choseTag: function (value) {
            this.data.tagList.unshift(value);
            this.setData({
                _index: 1,
                categoryIds: [value.id],
                tagList: this.data.tagList
            })
            this.getLatlng().then(this.getShopTripByCategory)
        }
    },
    onLoad: function (options) {
        wx.showShareMenu();

        this.sideToIndexComp = this.selectComponent("#side-to-index");
        this.pageConfig.pageNum = 1;

        this.GET(this.$url.shop.getChilds, {enable: 'yes', parentId: 0}).then(res => {

            if (this.options.tagId) {

                res.data = res.data.filter(v => {
                    return v.id != this.options.tagId;
                })
                //let target = res.data.splice(res.data.findIndex(v=> v.id== this.options.tagId), 1);
                res.data.unshift({
                    name: this.options.tagName,
                    id: this.options.tagId
                });
                this.setData({
                    categoryIds: [this.options.tagId],
                    _index: 1
                })

            }

            this.setData({
                tagList: res.data.filter(v => v.id)
            })

            this.getLatlng().then(this.getShopTripByCategory);

        })

    },
    onShareAppMessage: function () {
        let parm = [];
        if (this.data._index > 0) {
            parm.push("tagId=" + this.data.tagList[this.data._index - 1].id);
            parm.push("tagName=" + this.data.tagList[this.data._index - 1].name);
        }
        return {
            path: `/pages/with-auto/shop-list/index?${parm.join("&")}&share=true`,
        }
    },
    getShopTripByCategory(data) {
        this.POST(this.$url.shop.getShopTripByCategory, Object.assign(data, {categoryIds: this.data.categoryIds}, this.pageConfig)).then(res => {
            //分页数据设置
            this.setPageList("shopList", this.getProptry(res, 'data.data', []), this.pageConfig);
            //分页结果处理
            this.pageRequestAfter(res);
        })
    },
    onReachBottom() {

        if (!this.pageRequestBefore()) return;
        this.pageConfig.pageNum += 1;
        this.getLatlng().then(this.getShopTripByCategory)
    },
    chosetap(e) {
        if (this.getDataset(e).index == this.data._index) return;
        this.pageConfig.pageNum = 1;
        this.setData({
            _index: this.getDataset(e).index,
            categoryIds: this.getDataset(e).id ? [this.getDataset(e).id] : []
        })
        this.getLatlng().then(this.getShopTripByCategory)

    },
    showArea(){
        $sdaiPicker("#area").show();
    },
    areaCancel(){
        $sdaiPicker("#area").hide();
        if(!this.pageConfig.cityCode) return;
        this.pageConfig.pageNum = 1;
        this.pageConfig.cityCode = undefined;
        this.setData({
            cityName: "全国"
        })
        this.getLatlng().then(this.getShopTripByCategory);
    },
    areaConfirm(e){
        console.log(e)
        $sdaiPicker("#area").hide();
        this.pageConfig.pageNum = 1;
        if(e.detail.values[1]){
            this.pageConfig.cityCode = e.detail.values[1].code;
            this.setData({
                cityName: e.detail.values[1].name
            })
            this.getLatlng().then(this.getShopTripByCategory);
        }
    }
})
