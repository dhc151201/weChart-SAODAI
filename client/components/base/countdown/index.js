import { $wuxCountDown } from './../../../libs/wux/index.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //服务器现在时间
        serverTime: {
            type: Number,
            value: new Date().getTime() + 60000 * 8,
            observer(newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
                // 通常 newVal 就是新设置的数据， oldVal 是旧数据
                // console.log(newVal)
                if(newVal) this.start();
            }
        },
        //开始时间
        startTime: {
            type: Number,
            value: new Date().getTime()
        },
        //从开始时间的总倒计时间分钟数
        minutes: {
            type: Number,
            value: 30
        },
        // DD天hh时mm分ss秒
        format: {
            type: String,
            value: "mm:ss"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        ct: ""
    },
    attached() {
        
    },
    /**
     * 组件的方法列表
     */
    methods: {
        start(){
            let that = this;
            this.c3 = new $wuxCountDown({
                date: +(new Date) + (this.properties.startTime + this.properties.minutes * 60000 - this.properties.serverTime),
                render(date) {
                    const days = +this.leadingZeros(date.days, 2) // + ' 天 '
                    const hours = this.leadingZeros(date.hours, 2) // + ' 时 '
                    const min = this.leadingZeros(date.min, 2) //+ '分'
                    const sec = this.leadingZeros(date.sec, 2) //+ '秒'
                    //console.log(that.properties);
                    let str= that.properties.format.replace("DD", days).replace("hh", hours).replace("mm", min).replace("ss", sec);

                    that.interVal(str);
                },
            });
        },
        interVal(countDown) {
            this.setData({
                ct: countDown,
            })
        }
    }
})
