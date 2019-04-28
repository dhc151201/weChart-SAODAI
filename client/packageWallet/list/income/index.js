import { $wuxSelect } from "./../../../libs/wux/index.js"; 
Page({
    pageConfig: {
        pageNum: 1,
        pageSize: 10
    },
    data: {
        typesImgName: [
            "", "", "", 
            "icon_income_sd@2x.png", "icon_balance_fl@2x.png", "icon_balance_hk@2x.png", 
            "", "icon_balance_tx@2x.png", "icon_income_hb@2x.png", 
            ""
        ],
        FilterStr: ["近一个月", "近三个月", "近半年", "近一年"],
        FilterIndex: 0,
        wallet: { },
        spinShow: true
    },
    onLoadGetLocalStorage(){
        return [
            { 
                pageDataKey: "list", 
                localStorageKey: "user-income-list", 
                default: [] 
            },
            {
                pageDataKey: "wallet", 
                localStorageKey: "user-income-wallet",
                default: {}
            }
        ]
    },
    onLoad: function (options) {
        this.walletQuery();
        this.getDetail();
    },
    onReachBottom(){

        if(!this.pageRequestBefore() ) return;
        this.pageConfig.pageNum+= 1;
        this.getDetail();
    
    },
    walletQuery(){
        this.POST(this.$url.wallet.query, {isQueryIncome: true}).then((res) => {
            this.setData({
                wallet: res.data,
                spinShow: false
            })
            wx.setStorage({
                key: 'user-income-wallet',
                data: res.data || {}
            })
        })
    },
    getDetail(){
        this.POST(this.$url.wallet.detail, Object.assign({
            accountType: 0,
            timeType: this.data.FilterIndex+ 1
        }, this.pageConfig )).then((res) => {

            this.setPageList("list", res.data.data, this.pageConfig);
            this.pageRequestAfter(res);

            if(this.pageConfig.pageNum== 1 && this.data.FilterIndex== 0){
                wx.setStorage({
                    key: 'user-income-list',
                    data: res.data.data || []
                })
            }

        })
    },
    openFilterOptions(){
        $wuxSelect().open({
            value: this.data.FilterStr[this.data.FilterIndex],
            options: this.data.FilterStr,
            onConfirm: (value, index, options) => {
                if(value != this.data.FilterStr[this.data.FilterIndex]){
                    this.pageConfig.pageNum= 1;
                    this.setData({FilterIndex: index});
                    this.getDetail();
                }
            },
        })
    },
    
})