// components/base/textearea/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        maxlength: {
            type: Number,
            value: 100
        },
        placeholder: {
            type: String,
            value: "请输入"
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _showTextarea: false,
        _value: "",
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showTextarea(){
            this.setData({
                _showTextarea: true,
            })
        },
        hideTextarea() {
            this.setData({
                _showTextarea: false,
            })
        },
        oninput(e){
            this.setData({
                _value: e.detail.value
            })
            this.triggerEvent('input', e.detail)
        }
    }
})
