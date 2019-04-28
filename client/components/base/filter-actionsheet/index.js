Component({
  properties: {

  },
  data: {
    showDrawer: false,
  },
  methods: {
    show(){
        this.setData({
            showDrawer: true,
        })
    },
    hide(){
        this.setData({
            showDrawer: false,
        })
    },
    sure(){
        this.hide();
        this.triggerEvent('sure', {});
    },
    cancel(){
        this.hide();
        this.triggerEvent('cancel', {});
    }
  }
})
