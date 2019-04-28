// components/order-shop-goodsList-take/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        orderInfo: {
            type: Object,
            value: {},
            observer(newVal, oldVal, changedPath) {
                if (newVal.skus){
                    let choseNumber = 0, chosePrice = 0;
                    newVal.skus.map((v) => {
                        if (v.chose) {
                            choseNumber += 1;
                            chosePrice += v.salePrice * v.skuCount;
                        }
                    })
                    this.setData({
                        choseNumber: choseNumber,
                        chosePrice: chosePrice.toFixed(2),
                    })
                }
            }
        },
        showNum: {
            type: Number,
            value: 4
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showAll: false,
        choseNumber: 0,
        chosePrice: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showAllHandel() {
            this.setData({
                showAll: true
            })
        },
        chose(e) {
            let sku= this.properties.orderInfo.skus[e.currentTarget.dataset.index];
            //console.log(sku, this.data.chosePrice)
            if(sku.chose){
                this.setData({
                    choseNumber: this.data.choseNumber- 1,
                    chosePrice: (this.data.chosePrice * 1 - sku.salePrice * sku.skuCount).toFixed(2),
                })
            }else{
                this.setData({
                    choseNumber: this.data.choseNumber+ 1,
                    chosePrice: (this.data.chosePrice * 1 + sku.salePrice * sku.skuCount).toFixed(2),
                })
            }
            let obj= {};
            obj["orderInfo.skus["+ e.currentTarget.dataset.index+ "].chose"]= !sku.chose;
            this.setData(obj);
            this.triggerEvent('chose',this.properties.orderInfo);
        },
    }
})
