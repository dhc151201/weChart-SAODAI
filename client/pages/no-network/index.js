import {objectToArrayKeyValue} from "../../utils/public.tool";

const app= getApp();
Page({
    data: {
        spinShow: false
    },
    onUnload(){
        wx.removeStorage({
            key: 'parms'
        })
    },
    tryHandel(){
        app.getNetworkType();
        this.setData({ spinShow: true });
        wx.getNetworkType({
            success: (res) => {

                const networkType = res.networkType;
                //网络状态同步到app
                app.globalData.networkType= networkType;

                if (networkType!= "none"){
                    if(!this.options.after){
                        wx.reLaunch({
                            url: "/pages/with-help/index/index"
                        })
                    }
                    else if (
                        this.options.after.indexOf('pages/with-help/index/index') > -1 ||
                        this.options.after.indexOf('pages/with-auto/index/index') > -1 ||
                        this.options.after.indexOf('pages/with-user/index/index') > -1
                    ){
                        wx.reLaunch({
                            url: this.options.after+ "?" + wx.getStorageSync("parms")
                        })
                    }
                    else{
                        this.redirectTo(this.options.after+ "?" + wx.getStorageSync("parms"));
                    }

                    // this.redirectTo(this.options.after ? this.options.after+ "?" + wx.getStorageSync("parms") : "pages/with-help/index/index");
                    wx.removeStorage({
                        key: 'parms'
                    })
                }
                else{
                    setTimeout(()=>{
                        this.setData({ spinShow: false });
                    }, 1500)
                }
            }
        })
    }
})
