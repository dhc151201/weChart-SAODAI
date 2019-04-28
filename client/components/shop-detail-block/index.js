import { $wuxSelect } from "./../../libs/wux/index.js";
import { $wuxGallery } from './../../libs/wux/index.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showOtherShops(){
      $wuxSelect(undefined, this).open({
        value: this.data.info.shopName,
        options: this.data.info.otherShops.map((v)=>{
          return v.shopName;
        }),
        onConfirm: (value, index, options) => {
            if(value != this.data.info.shopName)
              this.triggerEvent('change', this.data.info.otherShops[index] )
        },
      })
    },
    showGallery(e){
      //return;
      $wuxGallery(undefined, this).show({
          indicatorDots: true,
          showDelete: false,
          indicatorColor: '#fff',
          indicatorActiveColor: '#ffac1a',
          current: e.currentTarget.dataset.index,
          urls: this.properties.info.shopImages
      })
    }
  }
})
