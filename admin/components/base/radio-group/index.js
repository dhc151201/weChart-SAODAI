// components/base/radio-group/index.js
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    //选项是否成块
    block: {
      type: Boolean,
      value: false
    },
    //是否必须选择
    mastChose: {
      type: Boolean,
      value: false,
    },
    width: {
      type: String,
      value: "0rpx",
    },
    list: {
      type: Array,
      value: [
        { name: '单选', key: '0', checked: true },
        { name: '单选', key: '1' }
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    choseKey: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onchange: function(e){
      let list = this.data.list;
      if (this.data.mastChose && list[e.currentTarget.dataset.index].checked) return;
      list.forEach((v, i)=>{
        if (i == e.currentTarget.dataset.index) list[i].checked = !list[i].checked;
        else list[i].checked = false;
      })
      this.setData({
        list: list
      })
      this.triggerEvent('change', list[e.currentTarget.dataset.index] )
    }
  }
})
