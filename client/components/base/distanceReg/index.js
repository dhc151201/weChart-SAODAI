import { filters } from './../../../utils/public.tool.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        beforeText: {
            type: String,
            value: ''
        },
        value: {
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                if (newVal) {
                    let _value= filters.distance(newVal);
                    this.setData({
                        _value: _value.includes("附近") ? `${_value}` : `${this.properties.beforeText}${_value}`
                    })
                    //console.log(this.data)
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _value: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
