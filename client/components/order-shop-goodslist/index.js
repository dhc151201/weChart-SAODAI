// components/order-shop-goods/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        shopLink: {
            type: Boolean,
            value: false
        },
        data:{
            type: Object,
            value: {}
        },
        //显示商品条数
        showNum: {
            type: Number,
            value: 2
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        src: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4074258740,4079621130&fm=26&gp=0.jpg"
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showAllHandel(){
            this.setData({
                showAll: true
            })
        },
        link(){
            if (this.properties.shopLink){
                this.navigateTo("/pages/with-auto/shop-detail/index", {
                    shopId: this.properties.data.shopId
                })
            }
        }
    }
})
