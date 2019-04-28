import {filters} from './../../../utils/public.tool.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        time: {
            type: Number,
            value: new Date().getTime(),
            observer(newVal, oldVal, changedPath) {
                if (newVal){
                    this.setData({
                        _time: filters.getDayName(newVal)
                    })
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _time: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
