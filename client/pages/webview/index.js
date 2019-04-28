import config from './../../utils/global.config.js'
Page({
  data: {
    url: ""
  },
  onLoad: function (options) {

    console.log(options)

    if (!options.url || !options.url.includes("http")) {
      this.alert("联系客服，请配置正确的合法域名");
      return;
    }

    if (options.url.includes("?") || options.url.includes("&")) {
      this.alert("pathParam参数必须encodeURIComponent处理");
      return;
    }

    this.setUrl(options);

  },
  setUrl(options) {

    options.url = decodeURIComponent(options.url);

        let parms = [
            `recommandCode=${this.data.$state.user.recommandCode}`,
            `token=${wx.getStorageSync("token")}`, 
            `versionType=${config.environment}`,
            `appType=1`,
            `share=${this.options.share}`,
        ];
       
        if(options.url.indexOf('?') > -1 ){
            options.url+= "&"+ parms.join("&");
        }else{
            options.url+= "?"+ parms.join("&");
        }

        this.setData({
            url: options.url,
            sharePath: this.getSharePath(options.url).sharePath || '',
            sence: (this.getSharePath(options.url).sence || '').split("|").map(v=>{
                v= v.replace(":", "=");
                return v;
            }).filter(v=> v).join("&"),
        })

    },
    //获取分享参数
    getSharePath(url) {
        if(!url.includes("?")) return;
        url = url == null ? window.location.href : url
        var search = url.substring(url.lastIndexOf('?') + 1)
        if (!search) {
            return {}
        }
        return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    },
    onShow(){
        this.data.sharePath && wx.showShareMenu();
    },
    onShareAppMessage: function () {

        if(this.data.sharePath){
            switch(this.data.sharePath){
                //邀请开店
                case "packageShare/in/shop/index" : 
                    return {
                        title: "把实体店铺搬线上， 快来免费入驻，全民都来帮您卖~~~",
                        imageUrl: `${this.data.$state.assetsUrl}share_bg_shop.png`,
                        path: `${this.data.sharePath}?scene=${this.data.$state.user.recommandCode}&url=${this.options.url}`,
                    };
                //默认
                default : 
                    return {
                        path: `${this.data.sharePath}?${this.data.sence}`,
                    };
            }
            
        }
        
    }
})
