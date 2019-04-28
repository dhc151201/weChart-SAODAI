import { $wuxSelect } from "./../../../libs/wux/index.js";

Page({
    pageConfig:{
        pageNum: 1,
        pageSize: 10
    },
    data: {
        tabChose: "money",
        statusIndex: 0,
        status: ["全部", "待激活", "已过期", "已领取"],
        statusImage: [null, "icon_coupons_djh@2x.png", "icon_coupons_ygq@2x.png", "icon_coupons_ylq@2x.png"],
    },
    onLoadGetLocalStorage(){
        return [
            { 
                pageDataKey: "list", 
                localStorageKey: "user-voucher-list", 
                default: [] 
            },
            {
                pageDataKey: "moneyTotalAmount", 
                localStorageKey: "user-voucher-amount",
                default: {}
            }
        ]
    },
    onLoad: function (options) {
        this.queryUserTemplateList();
        this.updateReadStatus();
        this.queryUserAmount();
    },
    onReachBottom() {

        if (!this.pageRequestBefore()) return;
        this.pageConfig.pageNum += 1;
        this.queryUserTemplateList();

    },
    //select红包卡券列表
    queryUserTemplateList(){
        this.POST(this.$url.wallet.queryUserTemplateList, Object.assign({
            acType: this.data.tabChose== 'money' ? 1 : 2,
            status: this.data.statusIndex == 0 ? undefined : this.data.statusIndex
        }, this.pageConfig) ).then(res=>{

            this.setPageList("list", res.data.data || [], this.pageConfig);
            this.pageRequestAfter(res);

            if(this.pageConfig.pageNum== 1 && this.data.statusIndex== 0){
                wx.setStorage({
                    key: 'user-voucher-list',
                    data: res.data.data || []
                })
            }

            // //set累计领取红包金额
            // if(this.pageConfig.pageNum== 1 && this.data.tabChose== 'money' ){
            //     this.setData({
            //         moneyTotalCount: res.data.totalCount
            //     })
            // }
            
        })
    },
    //select累计领取红包金额
    queryUserAmount(){
        this.POST(this.$url.wallet.queryUserAmount ).then((res) => {
            this.setData({moneyTotalAmount: res.data});
            wx.setStorage({
                key: 'user-voucher-amount',
                data: res.data || {}
            })
        })
    },
    //update已读状态
    updateReadStatus(){
        this.GET(this.$url.wallet.updateReadStatus);
    },
    showOtherStatus(){
        $wuxSelect().open({
            value: this.data.status[this.data.statusIndex],
            options: this.data.status,
            onConfirm: (value, index, options) => {
                if(value != this.data.status[this.data.statusIndex]){
                    this.pageConfig.pageNum= 1;
                    this.setData({statusIndex: index});
                    this.queryUserTemplateList();
                }
            },
        })
    },
    tabChange({detail}){
        this.setData({
            tabChose: detail.key
        })
        this.pageConfig.pageNum= 1;
        this.setData({list: []});
        this.queryUserTemplateList();
    }
})