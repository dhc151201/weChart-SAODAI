// pages/shop/notes/index.js
Page({
  data: {
    list: [],
    choseList: [],
  },
  onLoad: function (options) {
    this.GET(this.$url.shop.tagQueryList).then((res)=>{
      this.setData({
        list: res.data
      })
    })
  },
  chose(e){

    const data = this.data.list[this.tool.getDataset(e).index];
    this.data.choseList.push(data);
    this.data.list.splice(this.data.list.findIndex(item => item.id == data.id), 1);

    this.setData({
      list: this.data.list,
      choseList: this.data.choseList
    })

  },
  remove(e){

    const data = this.data.choseList[this.tool.getDataset(e).index];
    this.data.list.push(data);
    this.data.choseList.splice(this.data.choseList.findIndex(item => item.id == data.id), 1);

    this.setData({
      list: this.data.list,
      choseList: this.data.choseList
    })

  },
  onUnload(){
    wx.setStorageSync("notesChoseList", this.data.choseList);
  }
})