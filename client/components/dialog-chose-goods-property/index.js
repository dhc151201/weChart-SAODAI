import { $sdaiMask } from "./../base/index.js"
Component({
    
    /**
     * 组件的属性列表
     */
    properties: {
        goodsInfo: {
            type: Object,
            value: {},
            observer(newVal, oldVal, changedPath) {
              console.log("goodsInfo", newVal)
                //此处处理是为了便于选择属性的记录唯一性
                if(!(newVal.propTypes instanceof Array)) return;
                newVal.propTypes= newVal.propTypes.map((v)=>{
                  v.name= v.name.split('|').map((v_)=>{
                    return {name: v_, id: v.id}
                  });
                  return v;
                });
                this.setData({
                  propTypes: newVal.propTypes
                })
                this.resetCard(newVal);
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        choseStatic: {},
        propStatic: {},
        choseNumFromCard: 1,
        propChose: [],
        propTypes: [],
    },
    // attached(){
    //   this.showCard();
    // },

    /**
     * 组件的方法列表
     */
    methods: {
        showCard() {
            this.setData({
              isShowCard: true
            })
            $sdaiMask(undefined, this).show();
          },
          hideCard() {
            this.setData({
              isShowCard: false
            })
            $sdaiMask(undefined, this).hide();
          },

          //新商品重置
          resetCard(newVal){
            this.setData({
              choseNumFromCard: this.data.choseStatic['_'+ newVal.skuId] || 1,
              propChose: this.data.propStatic['_'+ newVal.skuId] ? this.data.propStatic['_'+ newVal.skuId].propChose : {},
            }, ()=>{
              //提供给视图
              this.setData({
                propChoseName: Object.values(this.data.propChose).join(" + ")
              })
            })
          },

          //数量操作
          change_self({ detail }){
            let obj= {};
            obj["choseNumFromCard"]= detail.value;
            obj["choseStatic._"+ this.properties.goodsInfo.skuId]= detail.value;
            this.setData(obj);
          },
          //商品属性选择处理
          propChoseHandel(e){
            let obj= {};
            obj["propChose._"+ e.currentTarget.dataset.id]= e.currentTarget.dataset.name;
            obj["propStatic._"+ this.properties.goodsInfo.skuId+ ".propChose._" + e.currentTarget.dataset.id]= e.currentTarget.dataset.name;
            this.setData(obj, ()=>{
              //提供给视图
              this.setData({
                propChoseName: Object.values(this.data.propChose).join(" + ")
              })
            })
            console.log(this.data.propChose)
          },
          //加入购物车
          addCardHandel(){
            if(!this.data.choseNumFromCard || this.data.choseNumFromCard< 1){
              return this.toast("请添加商品数量");
            }
            let data = Object.assign(this.data.goodsInfo, { 
              choseNum: this.data.choseNumFromCard,
              chosePropNames: Object.values(this.data.propChose),
              chosePropNamesString: Object.values(this.data.propChose).join("+"),
            });
            //console.log(data);
            this.triggerEvent('chose', data );
            this.hideCard();
          },
    }
})
