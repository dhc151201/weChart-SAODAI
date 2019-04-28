// pages/with-user/letters/index.js
let pageConfig = {
  pageNum: 1,
  pageSize: 10
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
      lettersList: [],
      startPoint: [0,0],
      isShow: null,
      id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getLettersList();
      this.setData({isShow: false})
    },
    getLettersList () {
      this.POST(this.$url.user.stationmsgList, Object.assign({}, pageConfig)).then((res) => {
        let allCon = res.data.data
        let pattern = /<[^>]+>/g;
        let con = []
        res.data.data.forEach( (item) =>{
          con.push({ 'content': this.getStr(item.content), 'createTime': item.createTime, 'id': item.id})
        })
        // console.log(con)
        //分页数据设置
        this.setPageList("lettersList", con, pageConfig);
        //分页结果处理
        this.pageRequestAfter(res);
        console.log(this.data.lettersList)
      })
    },
    getStr: function (str) {
      // return str.split(key)[1].split("\n")[0].replace("：", '');
      let obj = { title: '', content: [] };
      var result = str.split("n");
      obj.title = result[0].replace(/(<b>|<\/b>\\)/g, '');
      result.forEach((v, i) => {
        i && obj.content.push({ 
          key: v.split('：')[0], 
          value: (v.split('：')[1] || '').replace('\\', '')
        })
      })
      return obj;
    },
    updateMsg () {
      this.GET(this.$url.user.updateMsgStatus).then( (res) =>{

      })
    },
    // 触摸开始
    mytouchstart: function (e) {
      this.setData({startPoint: [e.touches[0].pageX, e.touches[0].pageY]})
    },
    // 触摸移动
    mytouchmove: function (e) {
      // console.log(e)
      var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
      var startPoint = this.data.startPoint;
      if (curPoint[0] <= startPoint[0]){
        if( Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])){
          console.log(e.timeStamp + '- touch left move')
          this.setData({ isShow: true, id: e.currentTarget.id})
        }
      }
    },
    // 取消
    hidebtn: function () {
      this.setData({ isShow: false })
    },
    // 删除某一条
    deletelet: function (e) {
      console.log(e);
      var example = [parseInt(e.currentTarget.id)];
      // Array.push(parseInt(e.currentTarget.id))
      console.log(example);
      this.POST(this.$url.user.deleteOneMsg, example ).then((res) => {
        if (res.code == 200) {
          this.getLettersList()
        }
      })
    },
    // 清空所有消息
    clearAll: function () {
      this.confirm({
        content: '您确定要清空所有消息吗',
        onConfirm: (e) => {
          this.POST(this.$url.user.clearAllMsg).then((res) => {
            if (res.code == 200) {
              this.getLettersList()
            }
          })
          console.log('凭什么吃我的冰淇淋！')
        },
        onCancel(e) {
          console.log('谢谢你不吃之恩！')
        }})
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.updateMsg()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if (!this.pageRequestBefore()) return;
      pageConfig.pageNum += 1;
      this.getLettersList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})