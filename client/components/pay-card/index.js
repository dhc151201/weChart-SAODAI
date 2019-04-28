import { $sdaiMask } from "./../base/index.js"
import { $wuxGallery } from './../../libs/wux/index.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        //console.log(changedPath)
        newVal= newVal.map((v)=>{
          this.data.choseGoodsList.map(n => {
            if(v.skuId== n.skuId){
              Object.assign(v, n);
            }
          })
          return v;
        });
        this.setData({
          _list: newVal
        })
      }
    },
    allNum: {
      type: Number,
      value: 0
    },
    choseGoodsList: {
      type: Array,
      value: [ ]
    },
    btnText: {
      type: String,
      value: ""
    },
    shopId: {
      type: Number,
      value: 0
    },
    shopInfo: {
      type: Object,
      value: {}
    },
    //店铺折扣
    discountRate:{
      type: Number,
      value: 0
    },
    //优惠最大金额
    maxDiscountsVel:{
      type: Number,
      value: 0
    },
    discountName:{
      type: String,
      value: ""
    },
    showStepper: {
      type: Boolean,
      value: true
    },
    fixbarleft: {
      type: String,
      value: ""
    },
    tripInfo: {
      type: Object,
      value: {}
    },
    //是否启动滚动条容器
    isScrollView: {
        type: Boolean,
        value: false
    },
    //是否允许纵向滚动
    scrollY: {
        type: Boolean,
        value: true
    },
    scrollViewStyle: {
        type: String,
        value: ""
    },
    loadmoreStatus: {
          type: Number,
          value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _list: [],
    //购物车总计价
    allPrice: 0,
    //已优惠金额
    discount: 0,
    goodsInfo: {}, //此值提供给商品属性选择所需的商品数据
  },
  attached(){
    this.goodsProperty= this.selectComponent("#goodsPropertyCard");
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showCard(){
      this.setData({
        isShowCard: true,
      })
      $sdaiMask(undefined, this).show();
    },
    hideCard() {
      this.setData({
        isShowCard: false
      })
      $sdaiMask(undefined, this).hide();
    },

    showGoodsPropertyCard({detail}){
      this.setData({goodsInfo: detail.goodsInfo})
      this.goodsProperty.showCard();
    },

    hideGoodsPropertyCard(){
      this.goodsProperty.hideCard();
    },

    
    //计算总金额/总数量/优惠金额，挂载选择的商品到视图数据choseGoodsList
    setChoseAllNum(){
      let num = 0, allPrice= 0, discount= 0;
      Object.values(this.choseGoodsList).map((v)=>{ 
        // console.log(v);
        if(this.properties.maxDiscountsVel){

          if(v.discountRate && v.discountRate!= 1){
            //商品折扣
            discount+= v.salePrice* v.choseNum* (1- v.discountRate);
          }
          // else if(this.properties.discountRate && this.properties.discountRate!= 1){
          //   //店铺折扣
          //   discount+= v.salePrice* v.choseNum* (1- this.properties.discountRate);
          // }

        }

        num += v.choseNum;
        allPrice+= +((v.salePrice* v.choseNum));

      })
      if(num && this.properties.tripInfo.crosscityCharge> 0){
        allPrice+= this.properties.tripInfo.crosscityCharge* 1
      }
      //优惠最大金额控制
      if(this.properties.maxDiscountsVel> 0 && discount> this.properties.maxDiscountsVel){
        discount= this.properties.maxDiscountsVel;
      }
      
      // console.log(allPrice, this.properties.tripInfo.crosscityCharge )
      this.setData({ 
        choseGoodsList: Object.values(this.choseGoodsList),
        allNum: num,
        allPrice: (allPrice- discount).toFixed(2),
        discount: discount.toFixed(2),
      });
      this.upChose();
      //console.log(this.properties.list)
    },
    chose({ detail }){
      
      if (!(this.choseGoodsList instanceof Object)){
        this.choseGoodsList = {};
      }

      if (detail.choseNum <= 0){
        delete this.choseGoodsList["_" + detail.skuId];
      }
      else{
        this.choseGoodsList["_" + detail.skuId] = detail;
      }
      
      //计算总选择商品数 并 设置选择的商品list
      this.setChoseAllNum();

    },
    //清除购物车
    clearPayCard(){
      this.choseGoodsList= [];
      this.setData({ 
        _list: this.data._list.map((v)=>{
          v.choseNum= 0;
          return v;
        })
      }, ()=>{
        this.setChoseAllNum();
        this.hideCard();
      });
      
    },
    //购物车小清单里面的数量操作处理
    changeCardNum(e){

      if (e.detail.value <= 0){
        delete this.choseGoodsList["_" + e.currentTarget.dataset.id];
      }
      else{
        this.choseGoodsList["_"+ e.currentTarget.dataset.id].choseNum= e.detail.value;
      }
      
      let obj= { };
      obj._list= this.data._list.map((v)=>{
        if(v.skuId== e.currentTarget.dataset.id){
          v.choseNum= e.detail.value
        }
        else if(this.choseGoodsList["_"+ v.skuId]){
          v.choseNum= this.choseGoodsList["_"+ v.skuId].choseNum;
        }
        return v;
      });

      this.setData(obj, ()=>{
        this.setChoseAllNum();
        if(!this.data.choseGoodsList.length){
          this.hideCard();
        }
      })

    },
    //提供给外层需要自定义bar的处理事件
    upChose(){
        let data = this.data.choseGoodsList.map((v) => {
            return {
                skuId: v.skuId,
                count: v.choseNum,
                propNames: v.chosePropNames || []
            }
        })
        this.triggerEvent('upChose', {
            detail: {
                choseGoodsList: this.data.choseGoodsList,
                allNum: this.data.allNum,
                allPrice: this.data.allPrice,
            },
            simple: data
        });
    },
    //确认发起捎带的事件传递
    sumbit(){

      let data= this.data.choseGoodsList.map((v)=>{
        return {
          skuId: v.skuId,
          count: v.choseNum,
          propNames: v.chosePropNames || []
        }
      })

      this.triggerEvent('submit', data );

    },

    scrolltolower(){
        this.triggerEvent('scrolltolower', {});
    },

    showGallery(e){
      console.log(e)
      $wuxGallery(undefined, this).show({
        indicatorDots: true,
        showDelete: false,
        indicatorColor: '#fff',
        indicatorActiveColor: '#ffac1a',
        urls: [
            e.detail.url
        ]
      })
    },

    scrollHandel(e){
      console.log(e)
    }


  }
})
