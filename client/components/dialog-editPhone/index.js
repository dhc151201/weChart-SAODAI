import { $sdaiMask } from "./../base/index.js"
import {isPhoneNum} from './../../utils/public.tool.js'
import {bus, user} from './../../utils/url.config.js'

Component({
    properties: {
        phone: {
            type: String,
            value: ""
        },
        title: {
            type: String,
            value: "完善手机号"
        }
    },
    data: {
        out: true,
        enter: false,
        hidden: true,
        showIcon: false,

        pl_phone: "",
        pl_code: "",

    },
    attached(){
        //this.show();
    },
    methods: {
        nullFun: function () { },
        show: function () {
            $sdaiMask(undefined, this).show();
            this.setData({
                hidden: false,
            })
            setTimeout(() => {
                this.setData({
                    enter: true,
                    out: false
                })
            }, 50);
        },
        hide: function () {
            $sdaiMask(undefined, this).hide();
            this.setData({
                out: true,
                enter: false
            })
            setTimeout(() => {
                this.setData({
                    hidden: true
                })
            }, 300);
        },
        clear(){
            this.setData({
                phone: "",
                code: "",
                pl_phone: "",
                pl_code: "",
            })
            this.didTimeout();
        },
        didTimeout(){
            clearInterval(this.timeout);
            this.timeout= "";
            this.requesting= false;
            this.setData({
                cutTime: ""
            })
        },
        bindinput({detail}){
            this.setData({
                phone: detail.value
            })
        },
        getCheckCode(){
            if(this.requesting) return;
            this.setData({
                pl_phone: "",
                pl_code: ""
            })
            if(!isPhoneNum(this.data.phone)){
                this.setData({pl_phone: '请输入有效的手机号'});
                return;
            }
            this.requesting= true;
            this.setData({
                cutTime: "request"
            })
            this.GET(bus.getCheckCode, {mobile : this.data.phone}).then(()=>{
                var time= 60;
                this.timeout= setInterval(()=>{
                    if(--time < 1){
                        this.didTimeout();
                    }else{
                        this.setData({
                            cutTime: time
                        })
                    }
                    
                }, 1000)
            })
        },
        formSubmit({detail}){
            this.setData({
                pl_phone: "",
                pl_code: ""
            })
            console.warn("完善手机号：：", detail);
            if(!isPhoneNum(detail.value.phone)){
                this.setData({pl_phone: '请输入有效的手机号'})
            }
            if(!detail.value.code){
                this.setData({pl_code: '请输入验证码'})
            }
            if(!(detail.value.code && detail.value.phone)){
                return;
            }
            this.triggerEvent('submit', detail.value);
        },
        ongetphonenumber(e){
            wx.showLoading({
                title: '获取中',
            })
              
            //已授权 获取到相关参数
            if(e.detail.iv){
              wx.login({
                success: (res) => {

                  e.detail.code = res.code;
                  delete e.detail.errMsg;
        
                  this.POST(user.getPhone, e.detail, { proxy: true }).then((data) => {

                    wx.hideLoading();
                    this.triggerEvent('submit', {phone: data.data, code: -100});

                  })
        
                }
              })
            }
        },
    }
})
