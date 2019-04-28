
Page({
  pageConfig:{
    state: 1,
    pageNum: 1,
    pageSize: 10
  },
  weekName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  data: {
    weekName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    tabKey: "goods",
    
    shopHoursRadios: [
      { name: "每日营业时间相同", key: 1, checked: true }
    ],
    goodsList: []
  },
  onLoad: function (options) {
    
    this.pageConfig.shopId= this.options.id;
    this.getSkuSpuByState();

    this.GET(this.$url.shop.getShopDeatil, { shopId: this.options.id }).then((res)=>{

      console.log(res.data)

      let shopHoursRadiosChose= true;
      let defaultStartTime = res.data.hoursList[0].startTime, defaultEndTime = res.data.hoursList[0].endTime;
      res.data.hoursList.forEach((v, i)=>{
        res.data.hoursList[i].weekName = this.weekName[i];
        if (defaultStartTime != v.startTime || defaultEndTime != v.endTime){
          shopHoursRadiosChose= false;
        }
      });
    
      this.setData({
        shopHoursList: res.data.hoursList,
        "shopHoursRadios[0].checked": shopHoursRadiosChose,
        shopHoursRadiosChose: shopHoursRadiosChose,
        info : res.data,
        categoryList: res.data.categoryList.map((v)=>{
          return v.name
        }).join(","),
        tagList: res.data.tagList.map((v) => {
          return v.name
        }).join(","),
      })
    })
  },

  onShow(){
    if (this.loaded){
      this.pageConfig.pageNum= 1;
      this.getSkuSpuByState();
    }
  },

  onReachBottom() {
    if (!this.pageRequestBefore()) return;
    this.pageConfig.pageNum++;
    this.getSkuSpuByState();
  },

  getSkuSpuByState(){
    this.POST(this.$url.goods.getSkuSpuByState, this.pageConfig).then((res)=>{
      if (this.pageConfig.pageNum == 1){
        this.setData({
          goodsList: res.data.data
        });
      }else{
        this.setData({
          goodsList: this.data.goodsList.concat(res.data.data)
        });
      }
      this.pageRequestAfter(res)
    })
  },

  ontabChange(e){
    this.setData({
      tabKey: e.detail.key
    })
  }
  
})