
Component({
  properties: {

  },
  data: {
    enter: false,
    out: true,
    hidden: true,
  },
  methods: {
    nullFun: function () { },
    show: function () {
      this.setData({
        hidden: false
      })
      setTimeout(() => {
        this.setData({
          enter: true,
          out: false
        })
      }, 50)
    },
    hide: function () {
      this.setData({
        out: true,
        enter: false
      })
      setTimeout(() => {
        this.setData({
          hidden: true
        })
      }, 300);
    },
  }
})
