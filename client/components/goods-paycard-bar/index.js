import { $sdaiMask } from "./../base/index.js"
import { $wuxGallery } from './../../libs/wux/index.js'
Component({
  
  properties: {
    //商品信息object
    goodsInfo: {
      type: Object,
      value: {}
    },
    //是否显示商品描述
    showDesc: {
      type: Boolean,
      value: false
    },
    //是否显示步进器
    showStepper: {
      type: Boolean,
      value: false
    },
    //商品图片高度
    height: {
      type: String,
      value: "144rpx"
    },
    //块宽度
    blockWidth: {
      type: String,
      value: "400rpx"
    },
    //是否显示放大图
    showGallery: {
      type: Boolean,
      value: true
    }
  },

  
  data: {
    
  },


  methods: {
    showCard() {
      this.setData({
        isShowCard: true
      })
      this.triggerEvent('showGoodsPropertyCard', {goodsInfo: this.properties.goodsInfo} );
      // $sdaiMask(undefined, this).show();
    },
    hideCard() {
      this.setData({
        isShowCard: false
      })
      // $sdaiMask(undefined, this).hide();
      this.triggerEvent('hideGoodsPropertyCard', {goodsInfo: this.properties.goodsInfo} );
    },


    //没有属性的商品数量操作处理
    change({ detail }) {
      let data = Object.assign(this.data.goodsInfo, { choseNum: detail.value });
      this.triggerEvent('chose', data );
    },

    showGallery(e){
        //return;
        if(!this.properties.showGallery){
          this.triggerEvent('showGallery', e.currentTarget.dataset );
          return;
        }
        $wuxGallery(undefined, this).show({
            indicatorDots: true,
            showDelete: false,
            indicatorColor: '#fff',
            indicatorActiveColor: '#ffac1a',
            urls: [
                e.currentTarget.dataset.url
            ]
        })
    }



  }
})
