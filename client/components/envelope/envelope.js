import { $sdaiMask } from "./../base/index.js"
const setStyle = function(){
    return `width: ${this.properties.width+ (typeof this.properties.width == 'number' ? 'rpx' : '') };
         height: ${this.properties.height + (typeof this.properties.height == 'number' ? 'rpx' : '')};
        `;
}

Component({
    properties: {
        //large/normal
        type: {
            type: String,
            value: "normal",
            observer(newVal, oldVal, changedPath) {
                this.setClass()
            }
        },
        width: {
            type: String,
            value: "560rpx",
            observer(newVal, oldVal, changedPath) {
                this.setStyle()
            }
        },
        height: {
            type: String,
            value: "580rpx",
            observer(newVal, oldVal, changedPath) {
                this.setStyle()
            }
        },
        //是否显示关闭icon
        showClose: {
            type: Boolean,
            value: false
        },
        //是否显示最高可领icon
        showMaxicon: {
            type: Boolean,
            value: false
        },
        btnText: {
            type: String,
            value: "邀请好友开启红包"
        },
        //红包数据
        data: {
            type: Object,
            value: {},
        }
    },
    data: {

    },
    methods: {
        setClass(){
            this.setData({
                "className": `envelope-${this.properties.type}`
            })
        },
        setStyle(){
            this.setData({
                "Style": setStyle.call(this)
            })
        },
        closeTip(){
            this.triggerEvent('close', {type: "close"});
        },
        tipSure(){
            this.triggerEvent('sure', {type: "sure"});
        },
    }
})
