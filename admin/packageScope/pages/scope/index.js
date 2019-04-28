const app = getApp()

Page({
  data: {
    showLoading: false
  },
  onLoad(options){
    if(this.data.$state.user.wxPubOpenId){
        this.data.$state.user.merchantId ?
            this.hasMerchantIdCall(res.merchantId)
            :
            this.redirectTo(`/pages/${ this.data.$state.typeIn== 0 ? 'user/join': 'shop/add'}/index`);
    }
  },
  getuserinfo: function(data){
    if (data.detail.userInfo) {
      this.setData({ showLoading: true});
      //后端需要的参数code获取
      wx.login({
        success: (res)=> {
          var code = res.code;
          wx.getUserInfo({
            lang: "zh_CN",
            success: (res)=> {
              //console.log(res)
              //组装服务端获取小程序用户信息所需参数
              var requestData = {
                code: code,
                iv: res.iv,
                encryptedData: res.encryptedData,
                signature: res.signature,
                type: 2,
                sourceRecommandCode: app.globalData.recommandCode || undefined,
              }
              //console.log("组装服务端获取小程序用户信息所需参数:::", requestData)

              this.POST(this.$url.user.login, requestData ).then((data)=>{

                wx.setStorageSync("token", data.data);

                this.getUserInfo().then((res)=>{
                    return res;
                    if(res.wxPubOpenId){
                        return res;
                    }else{
                        this.navigateTo("/pages/webview/index", {
                            type: "auth"
                        })
                    }
                }).then((res)=>{
                  res.merchantId ?
                    this.hasMerchantIdCall(res.merchantId)
                      :
                    this.redirectTo(`/pages/${ this.data.$state.typeIn== 0 ? 'user/join': 'shop/add'}/index`);

                }).catch(this.hideLoadingHandel)

              }).catch(this.hideLoadingHandel)
            },
          });

        },
      });

    }
    //用户 拒绝了 授权登录
    else {
      console.log("用户已经拒绝了收取啊登录。");
    }
  },
  back: function(){
    // this.navigateBack("/pages/index/index", {test: 123456})
  },
  hasMerchantIdCall(merchantId){
    this.GET(this.$url.user.getMerchant, { merhcantId: merchantId }).then((res) => {
      wx.setStorageSync("merchant-info", res.data);
      this.redirectTo(this.options.after)
    })

  },
  hideLoadingHandel(){
    this.setData({ showLoading: false });
  },

    authFn(){
           this.GET("http://uk28a8.natappfree.cc/v1/command/public/wechat/preAuth?userId=25").then(()=>{
               this.GET("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fa38eea1c6945f3&redirect_uri=http%3A%2F%2Fmxsiy9.natappfree.cc%2Fv1%2Fcommand%2Fpublic%2Fwechat%2FgetCode&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect")
           }).catch(()=>{
               this.GET("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5fa38eea1c6945f3&redirect_uri=http%3A%2F%2Fmxsiy9.natappfree.cc%2Fv1%2Fcommand%2Fpublic%2Fwechat%2FgetCode&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect")
           })

    }

})
