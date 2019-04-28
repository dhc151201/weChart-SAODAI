
Page({
  tryNum: 0,
  data: {
    htmlUrl: ""
  },
  onLoad: function (options) {

    if(options.type === "auth"){
        this.auth();
    }
    else{
        this.setData({
            htmlUrl: options.htmlUrl
        })
    }

  },

    onShow(){
        this.loaded && this.auth();
    },

    auth(){
        this.tryNum++;
        this.setData({
            htmlUrl: ""
        })
        this.GET( this.$url.bus.preAuth ).then((res)=>{

          this.setData({
              htmlUrl: res.data
          })

        })

    },
    viewLoad(){
        this.getUserInfo().then((res) => {
            if(res.wxPubOpenId){
                this.navigateBack();
            }
            else{
                this.tryNum > 2
                ? wx.showModal({
                        title: '温馨提示',
                        content: '登录出错，请联系客服',
                        showCancel: false,
                        success: (res)=> {
                            this.navigateBack()
                        }
                  })
                : wx.showModal({
                    content: '登录出错，再试一次',
                    success: (res)=> {
                        if (res.confirm) {
                            this.auth();
                        } else if (res.cancel) {
                            this.navigateBack();
                        }
                    }
                })
            }
        })
    }

})
