import { $wuxToptips } from './../../../libs/wux/index'
Page({
  data: {
    items: [
      { name: 1, value: '个体', checked: 'true' },
      { name: 2, value: '公司' },
      { name: 3, value: '农户' }
    ],
    bsType: 1
  },
  radioChange(e){
    this.setData({
      bsType: e.detail.value
    })
  },
  onSubmit(e){
    var reqData = e.detail.value, placeholder = "";

    if(this.data.id){
      reqData.id = this.data.id;
    }

    if (!reqData.merchantName) placeholder = '请填写企业或者店铺名称';
    if (placeholder) {
      return $wuxToptips().warn({
        hidden: true,
        text: placeholder,
      })
    }

    this.POST(this.$url.user.saveMerchant, reqData).then((data) => {

      this.GET(this.$url.user.getMerchant, { merhcantId: data.data }).then((res)=>{
        wx.setStorageSync("merchant-info", res.data);
      })

      this.getUserInfo();
      this.setData({
        id: data.data
      })
      
      this.toast({
        type: 'success',
        duration: 3000,
        color: '#fff',
        text: '入驻成功',
        success: ()=> {
          this.redirectTo("/pages/shop/add/index");
        }
      })
      
    })

  }
  
})