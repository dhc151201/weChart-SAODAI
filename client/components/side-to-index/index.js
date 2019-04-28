const setStyle= function(right, bottom, zindex){
    return `right: ${ typeof right == 'number' ? right+ 'rpx' : right };
            bottom:  ${ typeof bottom == 'number' ? bottom+ 'rpx' : bottom };
            zindex: ${zindex};
            `;
}
Component({
    properties: {
        right: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                this.setStyle();
            }
        },
        bottom: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                this.setStyle();
            }
        },
        zindex: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                this.setStyle();
            }
        },
    },
    data: {
        
    },
    methods: {
        setStyle(){
            this.setData({
                style: setStyle(this.properties.right, this.properties.bottom, this.properties.zindex)
            })
        },
        sideIn(){
            this.data.class== '' || 
            this.setData({
                class: ''
            })
        },
        sideOut(){
            this.data.class== 'out' || 
            this.setData({
                class: 'out'
            })
        }
    }
})
