const buildClass = function (hasFixed){
    let arr= [];
    if (hasFixed.includes('top')) arr.push('has-fixed-top');
    if (hasFixed.includes('bottom')) arr.push('has-fixed-bottom');
    return arr.join(" ");
}
Component({
    properties: {
        hasFixed:{
            type: String,
            value: "",
            observer(newVal) {
                if (newVal && typeof newVal == 'string') this.setClass(newVal);
            }
        },
        style: {
            type: String,
            value: ""
        },
    },
    data: {
        class: ""
    },
    methods: {
        setClass(v){
            this.setData({
                class: buildClass(v),
            })
        }
    }
})
