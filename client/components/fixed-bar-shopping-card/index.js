// components/fixed-bar-shopping-card/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //总数量
        allNum: {
            type: Number,
            value: 0
        },
        //总价
        allPrice: {
            type: Number,
            value: 0
        },
        //捎带费
        crosscityCharge: {
            type: Number,
            value: 0
        },
        //已优惠金额
        discount: {
            type: Number,
            value: 0
        },
        //按钮文案
        btnText: {
            type: String,
            value: "立即下单",
            observer(newVal, oldVal, changedPath) {
                newVal && newVal!= oldVal && this.setData({
                    _btnText: newVal
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _btnText: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showCard(){
            this.triggerEvent("showCard",  {})
        },
        sumbit(){
            this.triggerEvent("sumbit",  {})
        }
    }
})
