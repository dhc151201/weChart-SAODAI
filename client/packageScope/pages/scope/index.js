const app = getApp();
import config from "./../../../utils/global.config.js"
import {objectToArrayKeyValue} from "./../../../utils/public.tool.js"

Page({

  data: {
    showLoading: false

  },
  getuserinfo: function(data){

    //同意授权
    if (data.detail.userInfo) {

      this.setData({ showLoading: true});
      wx.login({
        success: (res)=> {

          var code = res.code;
          wx.getUserInfo({
            lang: "zh_CN",
            success: (res)=> {

              this.login({
                code: code,
                iv: res.iv,
                encryptedData: res.encryptedData,
                signature: res.signature,
                type: 1,
                versionType: config.environment
              })

            }

          });

        }

      });

    }
    //用户 拒绝了 授权登录
    else {
      console.log("用户已经拒绝了授权登录。");

    }

  },
  login(requestData){

    this.POST(this.$url.user.login, requestData ).then((data)=>{
      wx.setStorageSync("token", data.data);

      this.getUserInfo().then((res)=>{

        if (this.options.after) {
            if (this.options.after.indexOf('pages/with-help/index/index') > -1 ||
                this.options.after.indexOf('pages/with-auto/index/index') > -1 ||
                this.options.after.indexOf('pages/with-user/index/index') > -1
            ){
                wx.reLaunch({
                    url: this.options.after + "?" + objectToArrayKeyValue(this.options).join("&")
                })
            }else{
                this.redirectTo(this.options.after + "?" + objectToArrayKeyValue(this.options).join("&"));
            }
        }

        else
            wx.reLaunch({
                url: "/pages/with-help/index/index"
            })
            //this.redirectTo();


      }).catch(this.hideLoadingHandel)

    }).catch(this.hideLoadingHandel)

  },

  /*
  //获取手机号已授权 获取到相关参数
  ongetphonenumber(e){
    //已授权 获取到相关参数
    if(e.detail.iv){
      wx.login({
        success: (res) => {
          e.detail.code = res.code;
          delete e.detail.errMsg;

          // this.POST(this.$url.user.getPhone, e.detail).then((data) => {
          //   this.setData({
          //     principalTelphone: data.data
          //   })
          //   this.getUserInfo();
          // })

        }
      })
    }
  },
  back: function(){
    // this.navigateBack("/pages/index/index", {test: 123456})
  },
  */

  hideLoadingHandel(){
    this.setData({ showLoading: false });
  }

})
