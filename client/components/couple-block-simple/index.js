import {filters} from "./../../utils/public.tool.js"
import {sendTemplmsg} from "./../../assets/js/tmplmsg.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopId: {
      type: Number,
      value: 0,
    },
    //总条数
    allNum: {
      type: Number,
      value: 0,
    },
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        newVal instanceof Array && this.setData({
          _list: newVal.slice(0, 2).map((v)=>{
            v.arriveTime= filters.getDayName(v.arriveTime, v.systemCurrentTime);
            return v;
          })
        })
      }
    },
    // ‘help’ 或 ‘’
    from: {
      type: String,
      value: "",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    more(e){

      //帮他捎带
      if(this.properties.from== 'help'){
        this.navigateTo("/packageFindWith/near/index", {
          shopId: this.getDataset(e).id
        })
      }
      //找人捎带
      else{
        this.navigateTo("/packageTrip/list/index", {
          shopId: this.getDataset(e).id,
          from: this.properties.from //"auto"
        })
      }

    },
    go(e){

      //帮他捎带
      if(this.properties.from== 'help'){
        if(!e.detail.formId) return;
        sendTemplmsg.call(this, e.detail.formId);
        this.navigateTo("/packageOrder/detail/with-help/index", {
          orderId: this.getDataset(e).id,
          from: "find"
        })
      }
      //找人捎带
      else{
        this.navigateTo("/packageTrip/detail/index", {
          tripId: this.getDataset(e).id,
          from: "auto"
        })
      }

    }
  }
})
