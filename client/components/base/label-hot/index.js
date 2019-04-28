
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        background: {
            type: String,
            value: "",
            observer(newVal, oldVal, changedPath) {
                this.setStyle(newVal);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        style: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setStyle(background){
            this.setData({
                style: `${background ? 'background: ' + background+ '; ' : ''} `
            })
        }
    }
})
