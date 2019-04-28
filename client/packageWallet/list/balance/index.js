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
        frozenStatusStr: ["", "已冻结", "已解冻"],
        spinShow: true,
    },
    onLoadGetLocalStorage(){
        return [
            { 
                pageDataKey: "list", 
                localStorageKey: "user-balance-list", 
                default: [] 
            },
            {
                pageDataKey: "wallet", 
                localStorageKey: "user-balance-wallet",
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
        this.POST(this.$url.wallet.query, {isQueryIncome: false}).then((res) => {
            this.setData({
                wallet: res.data,
                spinShow: false
            })
            
            wx.setStorage({
                key: 'user-balance-wallet',
                data: res.data || {}
            })
            
        })
    },
    getDetail(){
        this.POST(this.$url.wallet.detail, Object.assign({
            timeType: this.data.FilterIndex+ 1
        }, this.pageConfig )).then((res) => {

            this.setPageList("list", res.data.data, this.pageConfig);
            this.pageRequestAfter(res);

            if(this.pageConfig.pageNum== 1 && this.data.FilterIndex== 0){
                wx.setStorage({
                    key: 'user-balance-list',
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
    //体现
    tansferToUser(){
        if(this.data.wallet.availableAmount< 1){
            return this.toast("提现金额不足");
        }
        this.dialog.dialog().prompt({
            resetOnClose: true,
            content: '输入提现金额',
            fieldtype: 'digit',
            defaultText: '',
            placeholder: '请输入提现金额',
            maxlength: 10,
            onConfirm: (e, response)=> {
                
                if(response< 1){
                    return this.toast("提现金额不足1元");
                }
                else if( typeof +response == "number" ){
                    setTimeout(()=>{
                        this.POST(this.$url.wallet.tansferToUser, { 
                            amount: response,
                            desc: "微信提现"
                        }, { proxy: true }).then((res)=>{
                            this.toast("提现成功");
                            this.walletQuery();
                        })
                    }, 600)
                    
                }
                else{
                    return this.toast("请输入有效的提现金额");
                }
            },
        })
    },
    showSummary(){
        this.alert("在行程未完成前，提货款以及您的捎带收入会暂时冻结,待买家签收后解冻即可提现。")
    }
})