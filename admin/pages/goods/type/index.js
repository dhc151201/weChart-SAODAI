// pages/goods/type/index.js
Page({
  data: {
    child: [],
    children: [],
    parentId: "",
    choseId: {},
    choseName: {}
  },
  onLoadGetLocalStorage(){
    return [
      {
        pageDataKey: "parent",
        localStorageKey: "business-type",
        default: []
      }
    ]
  },
  onLoad: function (options) {
    //return;
    this.getChilds({
      parentId: 0 ,
      enable: 'no'
    }).then((list)=>{

      this.setData({ parent: list, parentId: list[0].id });
      wx.setStorageSync("business-type", list);

      list[0] && this.getChilds({
        parentId: list[0].id,
        enable: 'no'
      }).then((child)=>{
        let obj = {}
        obj["child_" + list[0].id] = child || [];
        obj.children = child || [];
        this.setData(obj)
      })

    })

  },
  choseParentIdHandel(e){

    let index = e.currentTarget.dataset.index,
        parentId = e.currentTarget.dataset.id;
    this.setData({
      parentId: parentId
    })
    
    if(this.data["child_" + parentId]){
      this.setData({
        children: this.data["child_" + parentId]
      })
    }else{
      this.getChilds({
        parentId: parentId,
        enable: 'no'
      }).then((child) => {
        let obj = {}
        obj["child_" + parentId] = child || [];
        obj.children = child || [];
        this.setData(obj)
      })
    }  
  },
  choseIdHandel(e){

    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    
    let obj= {}
    if (!this.data.choseId["child_"+ id]){ 
      obj["choseId.child_" + id]= id;
      obj["choseName.child_" + name] = name;
    }
    else{
      obj["choseId.child_" + id] = false;
      obj["choseName.child_" + name] = false;
    }
    this.setData(obj);
    

  },
  onUnload(){
    let arr= Object.values(this.data.choseId).filter((v)=>{
      return v;
    })
    let arrName = Object.values(this.data.choseName).filter((v) => {
      return v;
    })
    wx.setStorageSync("choseId", arr);
    wx.setStorageSync("choseName", arrName);
  },
  getChilds(query){

    return new Promise((r, j)=>{
      this.GET(this.$url.goods.getChilds, query).then((data) => {
        r(data.data)
      })
    })
    
  }
})