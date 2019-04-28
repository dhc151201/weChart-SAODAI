import {bus} from "./../../utils/url.config.js";
Component({
    properties: {

    },
    data: {
        imgWeChat: "",
    },
    attached(){
        this.getWeiChatCode();
    },
    methods: {
        //获取二维码图片地址
        getWeiChatCode(){
            this.POST(bus.weiChatCode, {
                scene: this.data.$state.user.recommandCode,
                page: "packageShare/in/shop/index",
                size: "280",
                autoColor: false,
                lineColor: [255, 255, 255],
                isHyaline: true
            }).then(res => {
                this.setData({
                    imgWeChat: "https://" + res.data.cdnHttp + '/' + res.data.fileName + "?imageView2/1/w/300/h/300/q/100"
                });
            })
        },
    }
})

