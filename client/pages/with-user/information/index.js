// pages/with-user/information/index.js
Page({
    data: {
        sex: 0,
        phone: ''
    },
    onLoad: function (options) {
        this.get_addressList();
        this.get_professionlist();
        this.setData({
            sex: this.data.$state.user.wxGender== '男' ? 0 : 1,
            phone: this.data.$state.user.phone
        });
        this.dialogPhoneWxml= this.selectComponent("#dialog-phone");
    },
    get_professionlist(){
        this.GET(this.$url.bus.professionlist).then((res)=>{
            this.setData({
                professionlist: res.data.map(v => {
                    v.check= this.getProptry(this.data.$state.user, "profession", '').includes(v.profession);
                    return v;
                })
            })
        })
    },
    choseProfession(e){
        let data= this.data.professionlist.filter(v => v.check );
        if(data.length> 1 && !this.data.professionlist[e.currentTarget.dataset.index].check ){ 
            this.toast("职业最多只能选择2个");
            return;
        };
        let obj= {};
        obj["professionlist["+ e.currentTarget.dataset.index+ "].check"]= !this.data.professionlist[e.currentTarget.dataset.index].check;
        this.setData(obj);
    },
    get_addressList(){
        this.GET(this.$url.user.addressList).then((res)=>{
          this.setData({
            addressList: res.data
          })
        })
    },
    editPhoneDialogShow(){
        this.dialogPhoneWxml.show();
    },
    editPhone({detail}){
        this.POST(this.$url.user.updatePhoneById, {
            checkCode: +detail.code,
            phone: +detail.phone
        }).then((res)=>{
            this.getUserInfo().then(()=>{
                this.dialogPhoneWxml.hide();
                this.toast({
                    type: 'success',
                    duration: 1000,
                    color: '#fff',
                    text: '手机号修改成功'
                });
                this.setData({
                    phone: this.data.$state.user.phone
                });
            });
            
        })
    },
    editAddress(e){
        this.navigateTo("/packageAddress/pages/add/index", {
          id: this.data.addressList[e.currentTarget.dataset.index].id,
          info: JSON.stringify(this.data.addressList[e.currentTarget.dataset.index])
        })
    },
    argumentHandel(e){
        this.setData({
            sex: e.currentTarget.dataset.sex
        })
    },
    update(){
        this.POST(this.$url.user.update, {
            wxGender: this.data.sex== 1 ? '女': '男',
            profession: (this.data.professionlist || []).map((v)=>{
                if(v.check) return v.profession;
            }).filter((v)=> v ).join(","),
            phone: +this.data.phone
        }).then((res)=>{
            this.toast({
                type: 'success',
                duration: 1000,
                color: '#fff',
                text: '修改成功',
                success: ()=> this.navigateBack()
            });
        })
    },
    onShow: function () {
        this.loaded && this.get_addressList();
    },
})