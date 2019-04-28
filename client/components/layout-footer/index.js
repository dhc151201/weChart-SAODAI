
Component({
    properties: {
        style: {
            type: String,
            value: ""
        },
        background: {
            type: String,
            value: "",
            observer(newVal) {
                if (newVal && typeof newVal == 'string') this.setStyle(newVal);
            }
        },
    },
    data: {

    },
    methods: {
        setStyle(background){
            this.setData({
                style: `${background ? 'background: ' + background+ ';' : ''}`
            })
        }
    }
})
