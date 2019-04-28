import {filters} from "./../../../utils/public.tool.js"
Component({
    properties: {
        value:{
            type: Number,
            value: 0,
            observer(newVal, oldVal, changedPath) {
                this.setVal(newVal)
            }
        }
    },
    data: {

    },
    methods: {
        setVal(newVal){
            this.setData({
                _value: filters.money(newVal)
            })
        }
    }
})
